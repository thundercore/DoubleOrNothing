import React from 'react'
import './Game.css'
import Coin from '../Coin/Coin'
import Display from '../Display/Display'
import cardSrc from '../../assets/ig_coin_card.png'
import CoinPicker from '../CoinPicker/CoinPicker'
import { ContractEnum } from '../../ContractEnum'
import { formatUnits }  from 'ethers/utils'

interface IGameProps {
  active: ContractEnum
  changeContract(coin: ContractEnum): any
  playGame(): any
  double(): any
  reset(): any
  flipping: boolean
  disabled: boolean
  win: boolean
  balance: string
  betAmount: number
  decimals: number
  symbol: string
}

interface IGameState {
  animating: boolean
}

export class Game extends React.PureComponent<IGameProps, IGameState> {
  static getDerivedStateFromProps(props: IGameProps, state: IGameState) {
    return props.flipping && !state.animating ? { animating: true } : null
  }

  state = {
    animating: false
  }

  render() {
    const {
      playGame,
      disabled,
      win,
      double,
      balance,
      betAmount,
      reset,
      active,
      changeContract,
      decimals,
      symbol,
    } = this.props
    const { animating } = this.state
    let b = balance.length === 0 ? '0' : balance
    return (
      <div className="game-container">
        <CoinPicker active={active} changeContract={changeContract} />
        <div className="display-container">
          <Display balance={formatUnits(b, decimals).toString()} betAmount={betAmount.toString()} symbol={symbol} />
        </div>
        <div className="coin-display-container container">
          <img src={cardSrc} alt="" />
          <div className="center">
            <div
              className={animating ? 'coin flip' : 'coin'}
              onAnimationEnd={() => {
                this.setState({ animating: false })
              }}
            >
              <Coin showFace={!win} />
            </div>
          </div>
        </div>
        <div className="container">
          <button
            onClick={playGame}
            disabled={disabled}
            className="bet-button button"
          />
        </div>
        <div className="container">
          <button
            onClick={double}
            disabled={disabled || win}
            className="double-button button"
          />
          <button
            onClick={reset}
            disabled={disabled}
            className="reset-button button"
          />
        </div>
      </div>
    )
  }
}

export default Game
