import React from 'react'
import './Header.css'
import { ReactComponent as ArrowCircle } from '../../assets/ic_arrow-down-circle.svg'
import ReferralRules from '../ReferralRules/ReferralRules'
interface IHeaderProps {
  address: string
  rewards: string
  refereeCount: string
  activeTimestamp: number
}
interface IHeaderState {
  open: boolean
}

export class Header extends React.PureComponent<IHeaderProps, IHeaderState> {
  state = {
    open: false
  }

  calcualteEther(wei: string) {
    const amt = wei.padStart(19, '0')
    const decimalIdx = amt.length - 18
    const precisionIdx = decimalIdx + 2
    // round the next precision
    const roundUp = amt.slice(precisionIdx, precisionIdx + 1) >= '5'
    let decimal = roundUp
      ? amt.slice(decimalIdx, precisionIdx - 1) +
        (parseInt(amt.slice(precisionIdx - 1, precisionIdx)) + 1).toString()
      : amt.slice(decimalIdx, precisionIdx)
    decimal = decimal.replace(/0+$/, '')
    return amt.slice(0, decimalIdx) + (decimal ? '.' + decimal : '')
  }

  toggle = () => this.setState({ open: !this.state.open })

  render() {
    const { open } = this.state
    return (
      <>
        <div className="header">
          <div>Double or Nothing</div>
          <div className="header-reward">
            <div>Reward</div>
            <div className="reward-container">
              {this.calcualteEther(this.props.rewards)}
            </div>
            <ArrowCircle
              onClick={this.toggle}
              className={`arrow-circle ${open ? 'open' : ''}`}
            />
          </div>
        </div>
        {open && (
          <ReferralRules
            address={this.props.address}
            reward={this.calcualteEther(this.props.rewards)}
            refereeCount={this.props.refereeCount}
            activeTimestamp={this.props.activeTimestamp}
          />
        )}
      </>
    )
  }
}

export default Header
