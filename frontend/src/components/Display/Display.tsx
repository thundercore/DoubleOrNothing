import React from 'react'
import './Display.css'

interface IDisplayProps {
  balance: string
  betAmount: string
  symbol: string
}

export class Display extends React.PureComponent<IDisplayProps> {
  render() {
    const { balance, betAmount, symbol } = this.props
    return (
      <div className="display">
        <div className="title-container">
          <div className="title">Balance:</div>
          <div className="value">
            {parseFloat(balance).toFixed(2)} {symbol}
          </div>
        </div>
        <div className="title-container">
          <div className="title">Bet Size:</div>
          <div className="value">{betAmount} {symbol}</div>
        </div>
      </div>
    )
  }
}

export default Display
