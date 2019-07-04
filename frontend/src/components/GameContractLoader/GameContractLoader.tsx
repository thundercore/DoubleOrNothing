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
  referrer?: string
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
    const referrerMatch = window.location.search.match(
      /referrer=(0x[a-fA-F0-9]{40})/
    )
    const address = referrerMatch ? referrerMatch[1] : ''
    this.state = {
      referrer: address.toLowerCase(),
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
    const params: any = [
      {
        value: parseEther(val.toString()).toHexString(),
        // because there is an if else based on time, the estimate gas will fail and teh transaction will fail
        // you must set the gas limit
        gasLimit: bigNumberify('200000').toHexString()
      }
    ]
    const referrer = !!this.state.referrer
    if (referrer) {
      params.unshift(this.state.referrer)
    }
    this.state.contract[referrer ? 'bet(address)' : 'bet()'](...params)
      .then((trans: TransactionResponse) => {
        this.setState({ flipping: true })
        return trans.wait()
      })
      .then((receipt: TransactionReceipt) => {
        //@ts-ignore
        const event = receipt.events.find(evt => evt.event === 'BetSettled')

        this.setState({
          flipping: false,
          win: event.args.winnings.toString() !== '0'
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
