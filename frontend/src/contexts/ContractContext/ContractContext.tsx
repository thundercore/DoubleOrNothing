import React from 'react'
import { Contract, Signer } from 'ethers'
import { JsonRpcProvider } from 'ethers/providers'

interface IContractContextProps {
  signer: Signer
  checkOnLoad?: boolean
  contractAddress: string
  abi: any[]
}

interface IContractContextState {
  contract: Contract
  loading: boolean
  error: boolean
}

export interface IContractContext extends IContractContextState {
  loadContract(): void
}

const { Consumer, Provider } = React.createContext<IContractContext>({
  contract: new Contract('', [], new JsonRpcProvider('')),
  loading: true,
  error: true,
  loadContract(): void {}
})

export class ContractProvider extends React.PureComponent<
  IContractContextProps,
  IContractContextState
> {
  state = {
    contract: new Contract(
      this.props.contractAddress,
      this.props.abi,
      this.props.signer
    ),
    loading: !!this.props.checkOnLoad,
    error: false
  }

  componentDidMount(): void {
    if (this.props.checkOnLoad) {
      this.loadContract()
    }
  }

  loadContract = () => {
    this.setState({ loading: true })
    this.state.contract
      .deployed()
      .then(() => {
        this.setState({ loading: false })
      })
      .catch(() => {
        this.setState({ loading: false, error: true })
      })
  }

  render() {
    return (
      <Provider value={{ ...this.state, loadContract: this.loadContract }}>
        {this.props.children}
      </Provider>
    )
  }
}

export default ContractProvider

export const ContractConsumer = Consumer
