import React from 'react'
import './App.css'
import { abi } from './DoubleOrNothing.json'
import Web3Loader from '../Web3Loader/Web3Loader'
import ContractLoader from '../ContractLoader/ContractLoader'
import { IWeb3Context } from '../../contexts/Web3Context/Web3Context'
import { IContractContext } from '../../contexts/ContractContext/ContractContext'
import GameContainer from '../../containers/GameContainer/GameContainer'

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
    return (
      <div className="app">
        <ContractLoader
          renderEnabled={contractParams =>
            this.renderGame(contractParams, params.address)
          }
          renderLoading={this.renderLoading}
          renderUnavailable={this.renderUnavailable}
          signer={params.signer!}
          contractAddress={process.env.REACT_APP_CONTRACT_ADDRESS}
          abi={abi}
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
    return <GameContainer address={address} contract={params.contract} />
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
