import React from 'react'
import './App.css'
import { abi } from './DoubleOrNothing.json'
import Web3Loader from '../Web3Loader/Web3Loader'
import ContractLoader from '../ContractLoader/ContractLoader'
import { IWeb3Context } from '../../contexts/Web3Context/Web3Context'
import { IContractContext } from '../../contexts/ContractContext/ContractContext'
import GameContainer from '../../containers/GameContainer/GameContainer'
import config from '../../config'
import { abi as Erc677Abi } from './ERC677.json'
import { ContractEnum } from '../../ContractEnum'

interface IAppProps {}
interface IAppState {}

export class App extends React.PureComponent<IAppProps, IAppState> {
  renderIncapable() {
    return (
      <div className="app">
        <div className="app-message">Please connect a Web3 provider</div>
      </div>
    )
  }

  renderPleaseEnable() {
    return (
      <div className="app">
        <div className="app-message">Please enable your Web3 Provider</div>
      </div>
    )
  }

  renderEnabled = (params: IWeb3Context) => {
    const a = config[ContractEnum.DoubleOrNothing]
    return (
      <div className="app">
        <ContractLoader
          contractData={[
            {
              address: config[ContractEnum.DoubleOrNothing],
              signer: params.signer!,
              abi
            },
            {
              address: config[ContractEnum.TTDai],
              signer: params.signer!,
              abi: Erc677Abi
            },
            {
              address: config[ContractEnum.TTUsdt],
              signer: params.signer!,
              abi: Erc677Abi
            }
          ]}
          renderEnabled={contractParams =>
            this.renderGame(contractParams, params.address)
          }
          renderLoading={this.renderLoading}
          renderUnavailable={this.renderUnavailable}
        />
      </div>
    )
  }

  renderLoading() {
    return <div className="app-message">Loading...</div>
  }

  renderUnavailable() {
    return <div className="app-message">Error loading contract</div>
  }

  renderGame(params: IContractContext, address: string) {
    return (
      <GameContainer
        address={address}
        contracts={{
          [ContractEnum.DoubleOrNothing]:
            params[config[ContractEnum.DoubleOrNothing]].contract,
          [ContractEnum.TTUsdt]: params[config[ContractEnum.TTUsdt]].contract,
          [ContractEnum.TTDai]: params[config[ContractEnum.TTDai]].contract
        }}
      />
    )
  }

  render() {
    return (
      <Web3Loader
        renderWeb3Incapable={this.renderIncapable}
        renderEnabled={this.renderEnabled}
        renderEnabling={this.renderEnabled}
        renderUnabled={this.renderPleaseEnable}
      />
    )
  }
}

export default App
