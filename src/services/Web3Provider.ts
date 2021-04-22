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

  public sendTx = async (data: any) => {
    return this.web3Provider.eth.sendTransaction(data);
  };

  public balanceOf = async ({ contractAddress, contractAbi }: any) => {
    const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
    return contract.balanceOf(contractAddress).call();
  };

  public approve = async ({ data, contractAbi }: any) => {
    try {
      console.log('Web3Provider approve data:', data);
      const contractAddress = data.sellTokenAddress;
      console.log('Web3Provider approve contractAbi:', contractAbi);
      const contract = new this.web3Provider.eth.Contract(JSON.parse(contractAbi), contractAddress);
      return contract.methods.approve(data.allowanceTarget, data.sellAmount).send();
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
