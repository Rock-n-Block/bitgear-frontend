// import BigNumber from 'bignumber.js';
// import * as BigNumber from 'bignumber.js';
import Web3 from 'web3';

export default class MetamaskService {
  private provider: any;

  public web3Provider: any;

  constructor() {
    this.provider = (window as any).ethereum;
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
    return this.provider.request({ method: 'eth_requestAccounts' });
  };

  public getBalance = async (address: string) => {
    const balance = await this.web3Provider.eth.getBalance(address);
    // return +new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toFixed()
    return +balance / 10e17;
  };

  public sendTx = async (data: any) => {
    return this.web3Provider.eth.sendTransaction(data);
  };

  public balanceOf = async ({ address, contractAddress, contractAbi }: any) => {
    const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
    const balance = await contract.methods.balanceOf(address).call();
    return +balance / 10e17;
  };

  public approve = async ({ data, contractAbi }: any) => {
    try {
      const { from, allowanceTarget, sellAmount, sellTokenAddress } = data;
      // console.log('Web3Provider approve data:', data);
      const contractAddress = sellTokenAddress;
      // console.log('Web3Provider approve contractAbi:', contractAbi);
      const contract = new this.web3Provider.eth.Contract(JSON.parse(contractAbi), contractAddress);
      return contract.methods.approve(allowanceTarget, sellAmount).send({ from });
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
