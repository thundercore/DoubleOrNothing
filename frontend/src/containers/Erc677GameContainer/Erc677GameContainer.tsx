import React from 'react'
import { Contract } from 'ethers'
import { BigNumber, bigNumberify, parseEther } from 'ethers/utils'
import Game from '../../components/Game/Game'
import Header from '../../components/Header/Header'
import { ContractEnum } from '../../ContractEnum'
import { TransactionReceipt, TransactionResponse } from 'ethers/providers'

interface IErc677GameContainerProps {
  contract: Contract
  address: string
  gameAddress: string
  contractName: ContractEnum
  changeContract(coin: ContractEnum): any
}

interface IAccountInfo {
  reward: string
  referredCount: string
  activeTimestamp: number
}

interface IErc677GameContainerState {
  betAmount: number
  balance: string
  disabled: boolean
  flipping: boolean
  win: boolean
  accountInfo: IAccountInfo
}

const INITIAL_AMOUNT = 0.5

export class Erc677GameContainer extends React.PureComponent<
  IErc677GameContainerProps,
  IErc677GameContainerState
> {
  interval?: NodeJS.Timeout

  constructor(props: IErc677GameContainerProps) {
    super(props)
    this.watchBalance()
    this.state = {
      betAmount: INITIAL_AMOUNT,
      balance: '',
      win: true,
      disabled: false,
      flipping: false,
      accountInfo: {
        reward: '0',
        referredCount: '0',
        activeTimestamp: Date.now()
      }
    }
  }

  componentWillUnmount(): void {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  watchBalance = () => {
    this.interval = setInterval(() => {
      this.props.contract
        .balanceOf(this.props.address)
        .then((bal: BigNumber) => {
          this.setState({ balance: bal.toString() })
        })
    }, 500)
  }

  play = (val: number) => {
    this.setState({ disabled: true })
    this.props.contract
      .transferAndCall(
        this.props.gameAddress,
        parseEther(val.toString()),
        '0xfae',
        { gasLimit: bigNumberify('100000').toHexString() }
      )
      .then((trans: TransactionResponse) => {
        this.setState({ flipping: true })
        return trans.wait()
      })
      .then((receipt: TransactionReceipt) => {
        //@ts-ignore
        const didWin = !!receipt.events.find(
          //@ts-ignore
          evt =>
            evt.event === 'Transfer' &&
            evt.args.to.toLowerCase() === this.props.address.toLowerCase()
        )

        this.setState({
          flipping: false,
          win: didWin
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
          activeTimestamp={accountInfo.activeTimestamp}
        />
        <Game
          changeContract={this.props.changeContract}
          active={this.props.contractName}
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

export default Erc677GameContainer
