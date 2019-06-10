import React from 'react'
import './Game.css'
import Coin from '../Coin/Coin'
import Display from '../Display/Display'

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
        <Display balance={balance} betAmount={betAmount.toString()} />
        <div
          className={animating ? 'coin flip' : 'coin'}
          onAnimationEnd={() => {
            this.setState({ animating: false })
          }}
        >
          <Coin showFace={!win} />
        </div>
        <div>
          <button onClick={playGame} disabled={disabled}>
            Bet
          </button>
          <button onClick={reset} disabled={disabled}>
            Reset
          </button>
          <button onClick={double} disabled={disabled || win}>
            Double or Nothing
          </button>
        </div>
      </div>
    )
  }
}

export default Game
