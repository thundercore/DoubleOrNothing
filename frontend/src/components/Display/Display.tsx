import React from 'react'
import './Display.css'
import { formatEther } from 'ethers/utils'

interface IDisplayProps {
  balance: string
  betAmount: string
}

export class Display extends React.PureComponent<IDisplayProps> {
  render() {
    const { balance, betAmount } = this.props
    return (
      <div className="display">
        <div className="content-container">
          <div className="title">Balance:</div>
          <div className="value">
            {parseFloat(formatEther(balance)).toFixed(2)}
          </div>
        </div>
        <div className="content-container">
          <div className="title">Bet Size:</div>
          <div className="value">{betAmount} TT</div>
        </div>
      </div>
    )
  }
}

export default Display
