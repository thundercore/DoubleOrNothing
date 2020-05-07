import { ContractEnum } from './ContractEnum'

export default {
  [ContractEnum.DoubleOrNothing]: process.env.REACT_APP_DOUBLE_CONTRACT_ADDRESS,
  [ContractEnum.TTUsdt]: process.env.REACT_APP_TT_USDT_CONTRACT
}
