var Migrations = artifacts.require('./Migrations.sol')
var Double = artifacts.require('./DoubleOrNothing.sol')

module.exports = function(deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(Double, [300, 200, 100], 30, 1000, 86400, true, [
    1,
    500,
    5,
    750,
    25,
    1000
  ])
}
