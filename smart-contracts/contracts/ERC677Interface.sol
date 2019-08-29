import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract ERC677 is ERC20 {
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
    function transferAndCall(address, uint, bytes calldata) external returns (bool);
}

contract IBurnableMintableERC677Token is ERC677 {
    function mint(address, uint256) public returns (bool);
    function burn(uint256 _value) public;
    function claimTokens(address _token, address _to) public;
}

contract ERC677Receiver {
    function onTokenTransfer(address _from, uint _value, bytes calldata _data) external returns(bool);
}
