import React from 'react'
import Web3Provider, {
  IWeb3Context,
  Web3Consumer
} from '../../contexts/Web3Context/Web3Context'

interface IWeb3LoaderProps {
  renderWeb3Incapable(params: IWeb3Context): React.ReactNode
  renderEnabling(params: IWeb3Context): React.ReactNode
  renderEnabled(params: IWeb3Context): React.ReactNode
  renderUnabled(params: IWeb3Context): React.ReactNode
}
interface IWeb3LoaderState {}

export class Web3Loader extends React.PureComponent<
  IWeb3LoaderProps,
  IWeb3LoaderState
> {
  renderAppState = (params: IWeb3Context) => {
    if (!params.signer) {
      return this.props.renderWeb3Incapable(params)
    } else if (params.enabling) {
      return this.props.renderEnabling(params)
    } else if (params.enabled) {
      return this.props.renderEnabled(params)
    }
    return this.props.renderUnabled(params)
  }

  render() {
    return (
      <Web3Provider enableOnLoad={true}>
        <Web3Consumer>{this.renderAppState}</Web3Consumer>
      </Web3Provider>
    )
  }
}

export default Web3Loader
