import React from 'react'
import './Game.css'
import Coin from '../Coin/Coin'
import Display from '../Display/Display'
import cardSrc from '../../assets/ig_coin_card.png'

interface IGameProps {
  playGame(): any
  double(): any
  reset(): any
  flipping: boolean
  disabled: boolean
  win: boolean
  balance: string
  betAmount: number
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
      reset
    } = this.props
    const { animating } = this.state
    return (
      <div className="game-container">
        <div className="display-container">
          <Display balance={balance} betAmount={betAmount.toString()} />
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
