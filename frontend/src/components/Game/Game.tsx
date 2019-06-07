import React from 'react'
import './Game.css'
import { Contract, Signer } from 'ethers'
import Coin from '../Coin/Coin'

interface IGameProps {
  contract: Contract
}
interface IGameState {
  signer: Signer
}

export class Game extends React.PureComponent<IGameProps, IGameState> {
  render() {
    return <Coin />
  }
}

export default Game
