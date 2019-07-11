import React from 'react'

import ContractProvider, {
  ContractConsumer,
  IContractContext
} from '../../contexts/ContractContext/ContractContext'
import { Signer } from 'ethers'

interface IContractLoaderProps {
  signer: Signer
  abi: any[]
  contractAddress: string
  renderLoading(params: IContractContext): React.ReactNode
  renderEnabled(params: IContractContext): React.ReactNode
  renderUnavailable(params: IContractContext): React.ReactNode
}

export class ContractLoader extends React.PureComponent<IContractLoaderProps> {
  renderContractState = (params: IContractContext) => {
    if (params.loading) {
      return this.props.renderLoading(params)
    } else if (params.error) {
      return this.props.renderUnavailable(params)
    }
    return this.props.renderEnabled(params)
  }

  render() {
    const { signer, contractAddress, abi } = this.props
    return (
      <ContractProvider
        checkOnLoad={true}
        abi={abi}
        contractAddress={contractAddress}
        signer={signer}
      >
        <ContractConsumer>{this.renderContractState}</ContractConsumer>
      </ContractProvider>
    )
  }
}

export default ContractLoader
