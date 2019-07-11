import React from 'react'
import { Contract } from 'ethers'
import { bigNumberify, parseEther } from 'ethers/utils'
import { TransactionReceipt, TransactionResponse } from 'ethers/providers'
import Game from '../../components/Game/Game'
import Header from '../../components/Header/Header'

interface IGameContainerProps {
  contract: Contract
  address: string
}

interface IAccountInfo {
  reward: string
  referredCount: string
}

interface IGameContainerState {
  referrer?: string
  betAmount: number
  balance: string
  disabled: boolean
  flipping: boolean
  win: boolean
  accountInfo: IAccountInfo
}

const INITIAL_AMOUNT = 0.5

export class GameContainer extends React.PureComponent<
  IGameContainerProps,
  IGameContainerState
> {
  constructor(props: IGameContainerProps) {
    super(props)
    this.watchBalance()
    this.watchReferrals()
    const referrerMatch = window.location.search.match(
      /referrer=(0x[a-fA-F0-9]{40})/
    )
    const address = referrerMatch ? referrerMatch[1] : ''
    this.state = {
      referrer: address.toLowerCase(),
      betAmount: INITIAL_AMOUNT,
      balance: '',
      win: true,
      disabled: false,
      flipping: false,
      accountInfo: {
        reward: '0',
        referredCount: '0'
      }
    }
  }

  watchBalance = () => {
    setInterval(() => {
      this.props.contract.provider.getBalance(this.props.address).then(bal => {
        this.setState({ balance: bal.toString() })
      })
    }, 500)
  }

  watchReferrals = () => {
    setInterval(() => {
      this.props.contract.accounts(this.props.address).then((info: any) => {
        this.setState({
          accountInfo: {
            reward: info.reward.toString(),
            referredCount: info.referredCount.toString()
          }
        })
      })
    }, 500)
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
    this.props.contract[referrer ? 'bet(address)' : 'bet()'](...params)
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
      disabled,
      flipping,
      win,
      balance,
      betAmount,
      accountInfo
    } = this.state
    return (
      <>
        <Header
          address={this.props.address}
          rewards={accountInfo.reward}
          refereeCount={accountInfo.referredCount}
        />
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
      </>
    )
  }
}

export default GameContainer
