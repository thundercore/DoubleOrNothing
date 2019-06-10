pragma solidity 0.4.25;

contract DoubleOrNothing {
  address public owner;

  event BetSettled(address player, uint256 winnings);

  constructor() public {
    owner = msg.sender;
  }

  function() external payable {}

  function bet() payable external {
    require(msg.value <= address(this).balance, 'Balance too low!');
    uint256 winnings = 0;

    // DO NOT USE THIS IN PRODUCTION, ITS INSECURE
    if(uint256(blockhash(block.number -1)) % 2 == 0) {
      winnings = msg.value * 2;
      address(msg.sender).transfer(winnings);
    }

    emit BetSettled(msg.sender, winnings);
  }

  function withdraw(uint256 _amount) external {
    require(msg.sender == owner, 'Only owner allowed to withdraw');
    require(_amount <= address(this).balance, 'Balance too low!');
    address(msg.sender).transfer(_amount);
  }

}
