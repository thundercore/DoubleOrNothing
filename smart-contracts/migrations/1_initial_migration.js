var Migrations = artifacts.require("./Migrations.sol");
var Double = artifacts.require("./DoubleOrNothing.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Double);
};
