pragma solidity 0.5.0;

import '@thundercore/referral-solidity/contracts/Referral.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DoubleOrNothing is Ownable, Referral {
  event BetSettled(address player, uint256 winnings);

  constructor(
    uint256[] memory _levelRate,
    uint _referralBonus,
    uint _decimals,
    uint _secondsUntilInactive,
    bool _onlyRewardActiveReferrers,
    uint256[] memory _refereeBonusRateMap
  ) Referral(
      _levelRate,
      _referralBonus,
      _decimals,
      _secondsUntilInactive,
      _onlyRewardActiveReferrers,
      _refereeBonusRateMap
  ) public {}

  function() external payable {}

  function bet(address payable _referrer) payable external {
    if(!hasReferrer(msg.sender)) {
      addReferrer(_referrer);
    }
    bet();
  }

  function bet() payable public {
    // msg.value is added to the balance to begin with so you need to double it
    require(msg.value * 2 <= address(this).balance, 'Balance too low!');
    uint256 winnings = 0;

    // DO NOT USE THIS IN PRODUCTION, ITS INSECURE
    if(uint256(blockhash(block.number -1)) % 2 == 0) {
      winnings = msg.value * 2;
      address(msg.sender).transfer(winnings);
    }
    payReferral(msg.value);
    emit BetSettled(msg.sender, winnings);
  }

  function withdraw(uint256 _amount) external onlyOwner {
    require(_amount <= address(this).balance, 'Balance too low!');
    address(msg.sender).transfer(_amount);
  }

}
