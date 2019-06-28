import React from 'react'
import './Coin.css'

interface ICoinProps {
  showFace: boolean
}

export class Coin extends React.PureComponent<ICoinProps> {
  render() {
    return (
      <div
        className={'coin-container ' + (this.props.showFace ? 'flipped' : '')}
      >
        <div className="disk-body" />
        <div className="disk-body back" />
        <div className="top-face top-back-face disk">
          <div className="half-face half-face-lower" />
          <div className="half-face half-face-upper" />
        </div>
        <div className="disk face bottom-back-face">
          <div className="half-face half-face-lower" />
          <div className="half-face half-face-upper" />
        </div>
        <div className="disk bottom-front-face" />
        <div className="face top-face top-face-front disk" />
      </div>
    )
  }
}

export default Coin
