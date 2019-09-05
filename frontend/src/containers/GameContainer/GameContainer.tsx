import React from 'react'
import { Contract } from 'ethers'
import { ContractEnum } from '../../ContractEnum'
import DoubleGameContainer from '../DoubleGameContainer/DoubleGameContainer'
import Erc677GameContainer from '../Erc677GameContainer/Erc677GameContainer'

interface IGameContainerProps {
  contracts: {
    [ContractEnum.DoubleOrNothing]: Contract
    [ContractEnum.TTUsdt]: Contract
    [ContractEnum.TTDai]: Contract
  }
  address: string
}

interface IGameContainerState {
  currentContract: ContractEnum
}

export class GameContainer extends React.PureComponent<
  IGameContainerProps,
  IGameContainerState
> {
  state = {
    currentContract: ContractEnum.DoubleOrNothing
  }

  changeContract = (contract: ContractEnum) => {
    this.setState({ currentContract: contract })
  }

  render() {
    const { currentContract } = this.state
    const { address, contracts } = this.props
    if (currentContract === ContractEnum.DoubleOrNothing) {
      return (
        <DoubleGameContainer
          contract={contracts[ContractEnum.DoubleOrNothing]}
          address={address}
          changeContract={this.changeContract}
        />
      )
    } else if (currentContract === ContractEnum.TTDai) {
      return (
        <Erc677GameContainer
          gameAddress={contracts[ContractEnum.DoubleOrNothing].address}
          contractName={ContractEnum.TTDai}
          contract={contracts[ContractEnum.TTDai]}
          address={address}
          changeContract={this.changeContract}
        />
      )
    } else {
      return (
        <Erc677GameContainer
          gameAddress={contracts[ContractEnum.DoubleOrNothing].address}
          contractName={ContractEnum.TTUsdt}
          contract={contracts[ContractEnum.TTUsdt]}
          address={address}
          changeContract={this.changeContract}
        />
      )
    }
  }
}

export default GameContainer
