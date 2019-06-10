import React from 'react'
import './Coin.css'
import { ReactComponent as TTIcon } from '../../assets/icon_TT.svg'

export class Coin extends React.PureComponent {
  render() {
    return (
      <div className="coin-container">
        <div className="disk-body" />
        <div className="disk face bottom-face" />
        <div className="face top-face top-face-back disk" />
        <TTIcon className="face top-face top-face-front disk" />
      </div>
    )
  }
}

export default Coin
