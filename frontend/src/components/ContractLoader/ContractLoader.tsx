import React from 'react'

import ContractProvider, {
  ContractConsumer,
  IContractContext
} from '../../contexts/ContractContext/ContractContext'
import { Signer } from 'ethers'

interface IContractData {
  abi: any[]
  address: string
  signer: Signer
}

interface IContractLoaderProps {
  contractData: IContractData[]
  renderLoading(params: IContractContext): React.ReactNode
  renderEnabled(params: IContractContext): React.ReactNode
  renderUnavailable(params: IContractContext): React.ReactNode
}

interface IContractLoaderState {
  contracts: IContractData[]
}

export class ContractLoader extends React.PureComponent<
  IContractLoaderProps,
  IContractLoaderState
> {
  static getDerivedStateFromProps(props: IContractLoaderProps) {
    return {
      contracts: props.contractData.map(data => ({
        ...data,
        checkOnLoad: true
      }))
    }
  }
  state: IContractLoaderState = {
    contracts: []
  }

  renderContractState = (params: IContractContext) => {
    // @ts-ignore
    if (Object.keys(params).find(key => params[key].loading)) {
      return this.props.renderLoading(params)
      // @ts-ignore
    } else if (Object.keys(params).find(key => params[key].error)) {
      return this.props.renderUnavailable(params)
    }
    return this.props.renderEnabled(params)
  }

  render() {
    return (
      <ContractProvider contracts={this.state.contracts}>
        <ContractConsumer>{this.renderContractState}</ContractConsumer>
      </ContractProvider>
    )
  }
}

export default ContractLoader
