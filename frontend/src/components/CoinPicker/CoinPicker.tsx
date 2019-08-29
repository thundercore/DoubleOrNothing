import React from 'react'
import './CoinPicker.css'
import TTDaiImg from '../../assets/tt-dai.png'
import TTUsdtImg from '../../assets/tt-usdt.png'
import TTImg from '../../assets/icon_TT.png'
import { ContractEnum } from '../../ContractEnum'

interface ICoinPickerProps {
  active: ContractEnum
  changeContract(coin: ContractEnum): any
}

const buttons = [
  {
    name: ContractEnum.DoubleOrNothing,
    img: TTImg,
    text: 'TT'
  },
  {
    name: ContractEnum.TTUsdt,
    img: TTUsdtImg,
    text: 'TT USDT'
  },
  {
    name: ContractEnum.TTDai,
    img: TTDaiImg,
    text: 'TT DAI'
  }
]

export class CoinPicker extends React.PureComponent<ICoinPickerProps> {
  render() {
    const { active, changeContract } = this.props
    return (
      <div className="coin-picker-container">
        {buttons.map(button => (
          <div className="coin-button-container" key={button.name}>
            <button
              onClick={() => changeContract(button.name)}
              disabled={active === button.name}
              className={`coin-picker-button ${
                active === button.name ? 'active' : ''
              }`}
            >
              <img
                className="coin-picker-button-icon"
                src={button.img}
                alt=""
              />
              {button.text}
            </button>
          </div>
        ))}
      </div>
    )
  }
}

export default CoinPicker
