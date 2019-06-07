import React from 'react'
import './Coin.css'
import { ReactComponent as TTIcon } from '../../assets/icon_TT.svg'

export class Coin extends React.PureComponent {
  render() {
    return (
      <div className="coin-container">
        <TTIcon className="face" />
        <div className="face back-face" />
      </div>
    )
  }
}

export default Coin
