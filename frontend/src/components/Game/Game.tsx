import React from 'react'
import './Game.css'
import { Contract } from 'ethers'
import Coin from '../Coin/Coin'

interface IGameProps {
  contract: Contract
}
interface IGameState {
  flip: boolean
}

export class Game extends React.PureComponent<IGameProps, IGameState> {
  state = {
    flip: false
  }

  flip = () => {
    this.setState({ flip: true })
    setTimeout(() => this.setState({ flip: false }), 2000)
  }

  render() {
    return (
      <div>
        <div className={this.state.flip ? 'coin flip' : 'coin'}>
          <Coin />
        </div>
        <button onClick={this.flip}>Test</button>
      </div>
    )
  }
}

export default Game
