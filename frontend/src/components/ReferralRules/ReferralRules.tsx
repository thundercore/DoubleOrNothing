import React from 'react'
import './ReferralRules.css'

interface IReferralRuleProps {
  address: string
  refereeCount: string
  reward: string
}

interface IReferralRuleState {
  clicked: boolean
}

export class ReferralRules extends React.PureComponent<
  IReferralRuleProps,
  IReferralRuleState
> {
  state = {
    clicked: false
  }

  renderStat(title: string, val: any) {
    return (
      <div className="referral-stat">
        <div>{title}</div>
        <div>{val}</div>
      </div>
    )
  }

  referralLink = () => {
    return window.location.origin + `?referrer=${this.props.address}`
  }

  copy = () => {
    const input = document.createElement('input')
    document.body.append(input)
    input.value = this.referralLink()
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    this.setState({ clicked: true })
  }

  renderColumn(header: string, val: string, className: string) {
    return (
      <div className={`table-column ${className}`}>
        <div className="cell">{header}</div>
        <div className="cell">{val}</div>
      </div>
    )
  }

  render() {
    const { clicked } = this.state
    const { refereeCount, reward } = this.props
    return (
      <div className="ReferralRule-container">
        <div className="inner-container">
          <div className="share-container">
            Share Your Referral Link to Earn More Rewards!
          </div>
          <div className="referral-title">Your Referral Link</div>
          <div className="referral-link-container">
            <div className="referral-link">{this.referralLink()}</div>
            <button
              onClick={this.copy}
              className={`copy-button ${clicked ? 'clicked' : ''}`}
            >
              copy
            </button>
          </div>
          <div className="referral-stats-container">
            {this.renderStat('Total Referral Reward', reward)}
            {this.renderStat('Number of Referees', refereeCount)}
          </div>
          <div className="referral-rules-container">
            <div className="referral-title">Referral Rule</div>
            <div className="referral-rule-block">
              For every transaction, 3% of the transaction value is reserved for
              the referrers. 60 % of the reserved amount is added to the first
              level referrer’s bonus pool, 30% is added to the 2nd level
              referrer’s bonus pool, and 10% is added to the 3rd level
              referrer’s bonus pool.
            </div>
            <div className="table">
              {this.renderColumn('Bonus Rate', '%', 'dark')}
              {this.renderColumn('Level 1', '60 %', 'light')}
              {this.renderColumn('Level 2', '30 %', 'med')}
              {this.renderColumn('Level 3', '10 %', 'dark')}
            </div>

            <div className="referral-rule-block">
              As a referrer, you will be awarded 50% of your bonus pool if you
              have 4 or less referees, 75% of the pool if you have 5 -24
              referees, and 100% if you have 25 or more referees.
            </div>

            <div className="table">
              {this.renderColumn('Referee Amount', '%', 'dark')}
              {this.renderColumn('1-4', '50 %', 'dark')}
              {this.renderColumn('5-24', '75 %', 'med')}
              {this.renderColumn('25+', '100 %', 'light')}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ReferralRules
