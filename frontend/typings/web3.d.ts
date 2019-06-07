interface IWeb3Provider {
  sendAsync(payload: any, callback: (e: Error, val: any) => void): any
  enable(): Promise<string[]>
}

interface Window {
  ethereum: IWeb3Provider
}
