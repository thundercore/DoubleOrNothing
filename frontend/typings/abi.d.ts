declare module '*.json' {
  export const abi: Abi
}

declare type Abi = Array<{
  constant: any
  inputs: any
  name: any
  outputs: any
  payable: any
  stateMutability: any
  type: any
}>
