import React from 'react'
import { Contract, Signer } from 'ethers'

interface IContractContextProps {
  contracts: IContractData[]
}

interface IContractData {
  signer: Signer
  checkOnLoad?: boolean
  address: string
  abi: any[]
}

interface IContractState {
  contract: Contract
  loading: boolean
  error: boolean
  load(): void
}

interface IContractContextState {
  [key: string]: IContractState
}

export type IContractContext = IContractContextState

const { Consumer, Provider } = React.createContext<IContractContext>({})

export class ContractProvider extends React.PureComponent<
  IContractContextProps,
  IContractContextState
> {
  constructor(props: IContractContextProps) {
    super(props)
    const contractInfo = props.contracts.reduce(
      (agg, contractData) => {
        agg[contractData.address] = {
          contract: new Contract(
            contractData.address,
            contractData.abi,
            contractData.signer
          ),
          loading: !!contractData.checkOnLoad,
          error: false,
          load: () => {
            this.loadContract(contractData.address)
          }
        }
        return agg
      },
      {} as {
        [k: string]: IContractState
      }
    )
    this.state = contractInfo

    props.contracts.forEach(contractData => {
      if (contractData.checkOnLoad) {
        this.loadContract(contractData.address, true)
      }
    })
  }

  private loadContract = (address: string, initializing?: boolean) => {
    const contractData = this.state[address]
    if (!contractData) {
      return
    }
    if (!initializing) {
      this.setState({
        [address]: { ...contractData, loading: true, error: false }
      })
    }
    contractData.contract
      .deployed()
      .then(() => {
        this.setState({
          [address]: { ...contractData, loading: false }
        })
      })
      .catch(() => {
        this.setState({
          [address]: { ...contractData, loading: false, error: true }
        })
      })
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>
  }
}

export default ContractProvider

export const ContractConsumer = Consumer
