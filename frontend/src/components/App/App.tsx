import React from 'react'
import './App.css'
import { Signer } from 'ethers'
import { Web3Provider } from 'ethers/providers'
import GameContractLoader from '../GameContractLoader/GameContractLoader'
import cloudSrc from '../../assets/ig_cloud.png'
import topBg from '../../assets/ig_bg.jpg'

interface IAppProps {}
interface IAppState {
  signer?: Signer
  enabled: boolean
}

export class App extends React.PureComponent<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props)
    const web3CapableBrowser = !!window.ethereum
    let signer: Signer | undefined
    if (web3CapableBrowser) {
      signer = new Web3Provider(window.ethereum).getSigner()
      window.ethereum.enable().catch(() =>
        this.setState({
          enabled: false
        })
      )
    }
    this.state = {
      signer,
      enabled: web3CapableBrowser
    }
  }

  renderWeb3MissingError() {
    return <div>Please connect a Web3 provider</div>
  }

  renderEnableProvider() {
    return <div>Please enable Your Web3 Provider</div>
  }

  render() {
    const { signer, enabled } = this.state
    return (
      <div className="app">
        <div className="top">
          <img src={topBg} alt="" />
        </div>
        <div className="flex" />
        <div className="clouds">
          <img src={cloudSrc} />
        </div>
        <div className="overlay">
          <div className="content-container">
            {!signer ? (
              this.renderWeb3MissingError()
            ) : enabled ? (
              <GameContractLoader
                contractAddress={process.env.REACT_APP_CONTRACT_ADDRESS}
                signer={signer}
              />
            ) : (
              this.renderEnableProvider()
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default App
