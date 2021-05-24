import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';

import config from '../config';

export default class MetamaskService {
  public provider: any;

  public web3Provider: any;

  // public allowanceTarget: string;

  public addresses: any;

  constructor() {
    this.provider = (window as any).ethereum;
    this.web3Provider = new Web3(this.provider);
    this.addresses = config.addresses;
    // this.allowanceTarget = this.addresses[config.netType].allowanceTarget;
  }

  public checkNetwork = async () => {
    const { chainIds } = config;
    const chainIdsByType = chainIds[config.IS_PRODUCTION ? 'mainnet' : 'testnet'];
    const usedNet = chainIdsByType.Ethereum.id;
    const netVersion = this.provider.chainId;
    const neededNetName = chainIdsByType.Ethereum.name;
    console.log('MetamaskService checkNetwork:', usedNet, netVersion, neededNetName);
    if (usedNet.includes(netVersion)) return { status: 'SUCCESS', data: usedNet[0] };
    return {
      status: 'ERROR',
      message: `Please, change network to ${neededNetName}`,
    };
  };

  public connect = async () => {
    return this.provider.request({ method: 'eth_requestAccounts' });
  };

  public getBalance = async (address: string) => {
    const balance = await this.web3Provider.eth.getBalance(address);
    return +new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toFixed();
  };

  public sendTx = async (data: any) => {
    try {
      const result = await this.web3Provider.eth.sendTransaction(data);
      return { status: 'SUCCESS', data: result };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: null };
    }
  };

  public balanceOf = async ({ address, contractAddress, contractAbi }: any) => {
    const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
    const balance = await contract.methods.balanceOf(address).call();
    const decimals = await contract.methods.decimals().call();
    return +new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals)).toFixed();
  };

  public totalSupply = async ({ contractAddress, contractAbi }: any) => {
    const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
    const totalSupply = await contract.methods.totalSupply().call();
    return +totalSupply;
  };

  public approve = async ({ data, contractAbi }: any) => {
    try {
      // const { from, allowanceTarget, sellTokenAddress, sellAmount } = data;
      const { from, sellTokenAddress, sellAmount, allowanceTarget } = data;
      console.log('Web3Provider approve data:', data);
      const contractAddress = sellTokenAddress;
      // const totalSupply = await this.totalSupply({
      //   contractAddress,
      //   contractAbi: JSON.parse(contractAbi),
      // });
      const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
      return contract.methods.approve(allowanceTarget, sellAmount).send({ from });
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  public getGasPrice = async () => {
    const price = await this.web3Provider.eth.getGasPrice();
    // console.log('Web3Provider getGasPrice:', price);
    return +new BigNumber(price).dividedBy(new BigNumber(10).pow(18)).toFixed();
  };
}
