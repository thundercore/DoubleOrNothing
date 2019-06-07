pragma solidity 0.4.25;

contract DoubleOrNothing {
  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  function() external payable {}

  function bet() payable external {
    require(msg.value <= address(this).balance, 'Balance too low!');

    if(uint256(blockhash(block.number -1)) % 2 == 0) {
      address(msg.sender).transfer(msg.value * 2);
    }
  }

  function withdraw(uint256 _amount) external {
    require(msg.sender == owner, 'Only owner allowed to withdraw');
    address(msg.sender).transfer(_amount);
  }

}
