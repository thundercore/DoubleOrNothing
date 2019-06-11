import React from 'react'
import { Signer, Contract } from 'ethers'
import { abi } from './DoubleOrNothing.json'
import Game from '../Game/Game'
import { bigNumberify, parseEther } from 'ethers/utils'
import { TransactionReceipt, TransactionResponse } from 'ethers/providers'

interface IGameProps {
  contractAddress: string
  signer: Signer
}

interface IGameState {
  contract: Contract
  betAmount: number
  balance: string
  initialized: boolean
  error: boolean
  disabled: boolean
  flipping: boolean
  win: boolean
}

const INITIAL_AMOUNT = 0.5

export class GameContractLoader extends React.PureComponent<
  IGameProps,
  IGameState
> {
  constructor(props: IGameProps) {
    super(props)
    const contract = new Contract(props.contractAddress, abi, props.signer)
    this.watchBalance()
    this.state = {
      betAmount: INITIAL_AMOUNT,
      balance: '',
      contract,
      win: true,
      initialized: false,
      error: false,
      disabled: false,
      flipping: false
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

  watchBalance = () => {
    this.props.signer.getAddress().then(address =>
      setInterval(() => {
        this.props.signer.provider!.getBalance(address).then(bal => {
          this.setState({ balance: bal.toString() })
        })
      }, 500)
    )
  }

  renderError() {
    return <div>Error loading contract</div>
  }

  renderLoading() {
    return <div>Loading...</div>
  }

  play = (val: number) => {
    this.setState({ disabled: true })
    this.state.contract
      .bet({
        value: parseEther(val.toString()).toHexString(),
        // because there is an if else based on time, the estimate gas will fail and teh transaction will fail
        // you must set the gas limit
        gasLimit: bigNumberify('40000').toHexString()
      })
      .then((trans: TransactionResponse) => {
        this.setState({ flipping: true })
        return trans.wait()
      })
      .then((receipt: TransactionReceipt) => {
        //@ts-ignore
        const eventValue = receipt.events[0].args
        this.setState({
          flipping: false,
          win: eventValue.winnings.toString() !== '0'
        })
      })
      .finally(() => {
        this.setState({ disabled: false, flipping: false })
      })
  }

  playGame = () => {
    this.play(this.state.betAmount)
  }

  double = () => {
    const newBet = this.state.betAmount * 2
    this.setState({ betAmount: newBet })
    this.play(newBet)
  }

  reset = () => {
    this.setState({ betAmount: INITIAL_AMOUNT })
  }

  render() {
    const {
      initialized,
      error,
      disabled,
      flipping,
      win,
      balance,
      betAmount
    } = this.state
    if (error) {
      return this.renderError()
    } else if (!initialized) {
      return this.renderLoading()
    }
    return (
      <Game
        double={this.double}
        playGame={this.playGame}
        reset={this.reset}
        betAmount={betAmount}
        balance={balance}
        win={win}
        disabled={disabled}
        flipping={flipping}
      />
    )
  }
}

export default GameContractLoader
