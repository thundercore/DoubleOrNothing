import React from 'react'
import './Coin.css'
import { ReactComponent as TTIcon } from '../../assets/icon_TT.svg'
import { ReactComponent as HurtIcon } from '../../assets/hurt.svg'

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
        <div className="top-face top-back-face disk" />
        <div className="disk face bottom-back-face" />
        <HurtIcon className="disk bottom-front-face" />
        <TTIcon className="face top-face top-face-front disk" />
      </div>
    )
  }
}

export default Coin
