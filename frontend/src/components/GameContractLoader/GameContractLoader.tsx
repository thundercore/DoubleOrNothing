import React from 'react'
import { Signer, Contract } from 'ethers'
import { abi } from './DoubleOrNothing.json'
import Game from '../Game/Game'

interface IGameProps {
  contractAddress: string
  signer: Signer
}

interface IGameState {
  contract: Contract
  initialized: boolean
  error: boolean
}

export class GameContractLoader extends React.PureComponent<
  IGameProps,
  IGameState
> {
  constructor(props: IGameProps) {
    super(props)
    const contract = new Contract(props.contractAddress, abi, props.signer)
    this.state = {
      contract,
      initialized: false,
      error: false
    }
    contract
      .deployed()
      .then(() => {
        this.setState({ initialized: true })
      })
      .catch(() => {
        this.setState({ error: true })
      })
  }

  renderError() {
    return <div>Error loading contract</div>
  }

  renderLoading() {
    return <div>Loading...</div>
  }

  render() {
    const { initialized, contract, error } = this.state
    if (error) {
      return this.renderError()
    } else if (!initialized) {
      return this.renderLoading()
    }
    return <Game contract={contract} />
  }
}

export default GameContractLoader
