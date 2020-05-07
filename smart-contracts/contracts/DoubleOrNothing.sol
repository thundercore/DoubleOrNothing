pragma solidity 0.5.0;

import '@thundercore/referral-solidity/contracts/Referral.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./ERC677Interface.sol";
import "./ThunderRandomLibraryInterface.sol";

contract DoubleOrNothing is Ownable, Referral, ERC677Receiver {

    TokenData[] internal tokens;
    ThunderRandomLibraryInterface internal RNGLibrary;
    struct TokenData {
        IBurnableMintableERC677Token instance;
        uint256 lastBalance; // Don't trust this; see onTokenTransfer
    }

    event BetSettled(address player, uint256 winnings);

    constructor(
        uint _decimals,
        uint _referralBonus,
        uint _secondsUntilInactive,
        bool _onlyRewardActiveReferrers,
        uint256[] memory _levelRate,
        uint256[] memory _refereeBonusRateMap,
        address[] memory _tokenAddresses,
        address _randomNumberContractAddress
    ) Referral(
        _decimals,
        _referralBonus,
        _secondsUntilInactive,
        _onlyRewardActiveReferrers,
        _levelRate,
        _refereeBonusRateMap
    ) public {
        for (uint i = 0; i < _tokenAddresses.length; i++) {
            tokens.push(generateTokenData(_tokenAddresses[i]));
        }
        RNGLibrary = ThunderRandomLibraryInterface(_randomNumberContractAddress);
    }

    function generateTokenData(address _tokenAddress) internal view returns (TokenData memory) {
        IBurnableMintableERC677Token token = IBurnableMintableERC677Token(_tokenAddress);
        return TokenData(token, token.balanceOf(address(this)));
    }

    // Return a TokenData value passed by reference so we can modify it directly.
    function getToken(address _tokenAddress) internal view returns (TokenData storage) {
        for (uint i = 0; i < tokens.length; i++) {
            if (address(tokens[i].instance) == _tokenAddress) {
                return tokens[i];
            }
        }
        revert("Token not found.");
    }

    function addToken(address _tokenAddress) external onlyOwner {
        for (uint i = 0; i < tokens.length; i++) {
            if (address(tokens[i].instance) == _tokenAddress) {
                revert('A token with the provided address already exists.');
            }
        }
        tokens.push(generateTokenData(_tokenAddress));
    }

    function deleteToken(address _tokenAddress) external onlyOwner {
        for (uint i = 0; i < tokens.length; i++) {
            if (address(tokens[i].instance) == _tokenAddress) {
                uint256 lastIdx = tokens.length - 1;
                tokens[i] = tokens[lastIdx];
                delete lastIdx;
                break;
            }
        }
        revert('Token targeted for deletion not found.');
    }

    function bet(address payable _referrer) payable external {
        if(!hasReferrer(msg.sender)) {
            addReferrer(_referrer);
        }
        bet();
    }

    // value transfer tx based bet.
    function bet() payable public {
        // msg.value is added to the balance to begin with so you need to double it
        require(msg.value * 2 <= address(this).balance, 'Balance too low!');

        // prevent "revert txn unless I won" attacks, see
        // https://developers.thundercore.com/docs/random-number-generator/
        require(msg.sender == tx.origin);

        uint256 winnings = 0;

        if(RNGLibrary.rand() % 2 == 0) {
            // 3% is deducted to cover the referral bonus
            winnings = msg.value * 197/100;
            address(msg.sender).transfer(winnings);
        }

        payReferral(msg.value);
        emit BetSettled(msg.sender, winnings);
    }

    // This function handles ERC677 token bets.
    // This function does _not_ pay out referral bonuses.
    function betTokens(IBurnableMintableERC677Token _token, uint256 _amount) internal {
        // The smart contract needs to be able to pay double the value sent.
        require(_amount * 2 <= _token.balanceOf(address(this)), 'Contract balance too low!');

        uint256 winnings = 0;

        if(RNGLibrary.rand()  % 2 == 0) {
            winnings = _amount * 2;

            // This transaction can fail due to not enough gas being sent
            // with the call, so we specify the amount of gas to forward.
            _token.transfer.gas(50000)(tx.origin, winnings);
        }

        emit BetSettled(tx.origin, winnings);
    }

    // With no data sent, the contract token balance is simply updated.
    // Any data provided indicates that a user wants to make a bet.
    function onTokenTransfer(address /*_from*/, uint _value, bytes calldata _data) external returns(bool) {
        TokenData storage token = getToken(msg.sender);
        uint256 updatedBalance = token.instance.balanceOf(address(this));

        if (_data.length == 0) {
            token.lastBalance = updatedBalance;
        } else {
            // It doesn't matter if the current stored `lastTokenBalance` is correct.
            // The balance increase needs to be _at least_ as much as the
            // stated _value.
            require(updatedBalance - token.lastBalance >= _value, "onTokenTransfer was called but no balance increase was detected.");
            token.lastBalance = updatedBalance;
            betTokens(token.instance, _value);
        }
        return true;
    }

    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, 'Balance too low!');
        address payable owner = address(uint160(owner()));
        owner.transfer(_amount);
    }

    function withdrawTokens(address _tokenAddress, uint256 _amount) external onlyOwner {
        TokenData storage token = getToken(_tokenAddress);
        uint256 currentTokenBalance = token.instance.balanceOf(address(this));

        require(_amount <= currentTokenBalance, 'Token balance too low!');

        token.instance.transfer(owner(), _amount);
        token.lastBalance = currentTokenBalance - _amount;
    }

    // This fallback function eats all funds and gas sent to it.
    // The owner can withdraw from the contract balance via `withdraw` above.
    function() external payable {}
}
