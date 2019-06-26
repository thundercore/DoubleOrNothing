THIS IS NOT PRODUCTION READY AND SHOULD NOT BE USED IN ANY WAY IN PRODUCTION.

[DoubleOrNothing](https://jiang-yifan.github.io) is a coin flip game built on Thunder.

# Getting Started

1. Fork this repo
2. Rename the forked repo as {{Your-github-username}}.github.io
3. ssh `git clone git@github.com:{{Your-github-username}}/{{Your-github-username}}.github.io.git`
 \
 or 
 \
https `git clone https://github.com/{{Your-github-username}}/{{Your-github-username}}.github.io.git`
4. `cd {{Your-github-username}}.git.hub.io.git`
5. `git commit --allow-empty -m "bump"`
6. `git push`  
*Note: If you see the error “push declined due to email privacy restrictions”, you will need to allow command line pushes that expose your email address. This under “Settings”, “Emails”
7. It will take ~10 mins for Github to create your page. It can be accessed at 
\
`https://{{Your-github-username}}.github.io`
8. While you wait, make sure to have [Metamask](https://metamask.io/) installed
9. Set it up to a new Custom RPC url: https://mainnet-rpc.thundercore.com
10. When your page is built, you should be able to play the game


# Understanding the Repo for development

### Setup
- `cd smart-contracts`
- `yarn install` or ` npm install`
- `cd ../frontend`
- `yarn install` or `npm install`
- `yarn start` or `npm run start`

### Smart Contracts

This project uses [Truffle](https://www.trufflesuite.com) to handle all of the smart contract related work.

In the `/smart-contracts/contracts` folder, you will find `DoubleOrNothing.sol` which contains the game logic.
 
After you make any updates to it, you will have to redeploy the contract.

`yarn migrate --network development/thunder --reset` or `npm run migrate -- --network development/thunder --reset`

** Development points to localhost:8545 [Ganache](https://www.trufflesuite.com/ganache)
 
** To deploy on thunder, you must add a mnemonic to `/smart-contracts/truffle-config.js`

### Frontend
The frontend is built using the [create-react-app](https://github.com/facebook/create-react-app) project with [Typescript](https://www.typescriptlang.org/). 
To interact with the chain, we use [Ethers.js](https://docs.ethers.io/ethers.js/html/).
