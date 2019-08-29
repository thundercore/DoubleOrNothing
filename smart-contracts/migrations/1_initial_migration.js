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
    [1, 500, 5, 750, 25, 1000],
    [
      "0x42532085e51e5618575005f626589ff57d280d68", // tt-usdt testnet token address
      "0xd60db41a718a73da844a4c454c8bd6e07173d722" // tt-dai testnet token address
    ]
    // [
    //   "0x2b31e3b88847f03c1335E99A0d1274A2c72059DE" // tt-dai mainnet token address
    //   "0x4f3C8E20942461e2c3Bdd8311AC57B0c222f2b82" // tt-usdt mainnet token address
    // ]
  )
}
