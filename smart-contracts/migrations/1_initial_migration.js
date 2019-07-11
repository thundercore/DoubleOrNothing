var Migrations = artifacts.require('./Migrations.sol')
var Double = artifacts.require('./DoubleOrNothing.sol')

module.exports = function(deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(
    Double,
    1000,
    30,
    86400,
    true,
    [600, 200, 100],
    [1, 500, 5, 750, 25, 1000]
  )
}
