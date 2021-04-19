import WalletConnectProvider from '@walletconnect/web3-provider';
// import BigNumber from 'bignumber.js';
// import * as BigNumber from 'bignumber.js';
import Web3 from 'web3';

export default class Web3Provider {
  private provider: any;

  public web3Provider: any;

  constructor() {
    this.provider = new WalletConnectProvider({
      infuraId: 'd1bbf6a40e514be6878e06b2d01a7f41',
    });

    this.web3Provider = new Web3(this.provider);

    this.provider.on('accountsChanged', (accounts: string[]) => {
      console.log('Web3Provider accountsChanged:', accounts);
    });

    this.provider.on('chainChanged', (chainId: number) => {
      console.log('Web3Provider chainChanged:', chainId);
    });

    this.provider.on('disconnect', (code: number, reason: string) => {
      console.log('Web3Provider disconnect:', code, reason);
    });
  }

  public connect = async () => {
    console.log('Web3Provider connect:', this.provider);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    window.provider = this.provider;
    return new Promise<any>((resolve, reject) => {
      this.provider
        .enable()
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          // window.location.reload();
          reject(err);
        });
    });
  };

  public disconnect = () => {
    this.provider.disconnect();
  };

  public getBalance = async (address: string) => {
    const balance = await this.web3Provider.eth.getBalance(address);
    // return +new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toFixed()
    return balance / 10e17;
  };
}
