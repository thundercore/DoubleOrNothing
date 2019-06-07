import React from 'react'
import './App.css'
import { Signer } from 'ethers'
import { Web3Provider } from 'ethers/providers'

interface IAppProps {}
interface IAppState {
  web3CapableBrowser: boolean
  signer?: Signer
}

export class Game extends React.PureComponent<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props)
    const web3CapableBrowser = !!window.ethereum

    this.state = {
      web3CapableBrowser,
      signer:
        web3CapableBrowser && new Web3Provider(window.ethereum).getSigner()
    }
  }

  renderWeb3MissingError() {
    return <div>Please connect a Web3 provider</div>
  }

  renderGame() {
    return null
  }

  render() {
    const { web3CapableBrowser } = this.state
    return (
      <div>
        {!web3CapableBrowser
      ? this.renderWeb3MissingError()
      : this.renderGame()}
    </div>
  )
  }
}

export default App
