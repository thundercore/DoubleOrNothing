import React from 'react'
import { Signer } from 'ethers'
import { Web3Provider as EthersProvider } from 'ethers/providers'

interface IWeb3ContextProps {
  enableOnLoad?: boolean
}

interface IWeb3ContextState {
  signer?: Signer
  enabled: boolean
  enabling: boolean
  address: string
}

export interface IWeb3Context {
  enable(): void
  signer?: Signer
  enabled: boolean
  enabling: boolean
  address: string
}

const { Consumer, Provider } = React.createContext<IWeb3Context>({
  enable: () => {},
  address: '',
  signer: undefined,
  enabling: false,
  enabled: false
})

export class Web3Provider extends React.PureComponent<
  IWeb3ContextProps,
  IWeb3ContextState
> {
  constructor(props: IWeb3ContextProps) {
    super(props)
    const web3Capable = !!window.ethereum
    this.state = {
      address: '',
      signer: web3Capable && new EthersProvider(window.ethereum).getSigner(),
      enabled: false,
      enabling: web3Capable && !!props.enableOnLoad
    }
  }

  componentDidMount(): void {
    if (this.props.enableOnLoad) {
      this.enable()
    }
  }

  enable = () => {
    if (this.state.signer) {
      this.setState({ enabling: true })
      this.state.signer
        //@ts-ignore
        .provider!._web3Provider.enable()
        .then(([address]: [string]) => {
          this.setState({ enabling: false, enabled: true, address })
        })
        .catch(() => {
          this.setState({
            enabling: false,
            enabled: false
          })
        })
    }
  }

  render() {
    return (
      <Provider value={{ ...this.state, enable: this.enable }}>
        {this.props.children}
      </Provider>
    )
  }
}

export default Web3Provider

export const Web3Consumer = Consumer
