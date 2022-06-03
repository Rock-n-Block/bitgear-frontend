import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';

import config from '../config';
import { customSwapAbi } from '../config/abi';

type TypeAllowance = {
  userAddress: string;
  allowanceTarget: string;
  contractAddress: string;
  contractAbi: any;
};

type TypeApprove = {
  amount?: string;
  userAddress: string;
  allowanceTarget: string;
  contractAddress: string;
  contractAbi: any;
};

export default class MetamaskService {
  public provider: any;

  public web3Provider: any;

  public addresses: any;

  constructor() {
    this.provider = window.ethereum;
    this.web3Provider = new Web3(this.provider);
    this.addresses = config.addresses;
  }

  public checkNetwork = async () => {
    const { chainIds, IS_PRODUCTION } = config;
    const chainIdsByType = chainIds[IS_PRODUCTION ? 'mainnet' : 'testnet'];
    const usedNet = chainIdsByType.Ethereum.id;
    const currentChainId = this.provider.chainId;
    const neededNetName = chainIdsByType.Ethereum.name;
    console.log('MetamaskService checkNetwork:', { usedNet, currentChainId, neededNetName });
    const [usedNetAsNumber] = usedNet;
    const usedNetAsHex = `0x${usedNetAsNumber.toString(16)}`;
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: usedNetAsHex }],
      });
      return { status: 'SUCCESS', data: usedNetAsNumber };
    } catch (error) {
      if (usedNet.includes(currentChainId)) return { status: 'SUCCESS', data: usedNetAsNumber };
      return {
        status: 'ERROR',
        message: `Please, change network to ${neededNetName}`,
      };
    }
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

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  public createTxForCustomAddress = async (data: any, userAddress: string) => {
    const transactionMethod = MetamaskService.getMethodInterface(customSwapAbi, 'doThing');

    const signature = this.web3Provider.eth.abi.encodeFunctionCall(transactionMethod, data);

    const tx: any = {
      from: userAddress,
      to: '0x85e00a4D4dE1071e299D0657EEeb987Cf016eA5F',
      data: signature,
    };

    if (data[3] === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      const value = data[4];
      tx.value = value;
    }

    return tx;
  };

  public isAddress = (address: string) => {
    return this.web3Provider.utils.isAddress(address);
  };

  public balanceOf = async ({ address, contractAddress, contractAbi }: any) => {
    const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
    const balance = await contract.methods.balanceOf(address).call();
    const decimals = await contract.methods.decimals().call();
    return +new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals)).toFixed();
  };

  public decimals = async ({ contractAddress, contractAbi }: any) => {
    const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
    const decimals = await contract.methods.decimals().call();
    return +decimals;
  };

  public totalSupply = async ({ contractAddress, contractAbi }: any) => {
    try {
      const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
      const totalSupply = await contract.methods.totalSupply().call();
      return new BigNumber(totalSupply).toString(10);
    } catch (e) {
      console.error('MetamaskService totalSupply:', e);
      return '0';
    }
  };

  public allowance = async ({
    userAddress,
    allowanceTarget,
    contractAddress,
    contractAbi,
  }: TypeAllowance) => {
    try {
      console.log('MetamaskService allowance', {
        userAddress,
        allowanceTarget,
        contractAddress,
        contractAbi,
      });
      const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
      const allowance = await contract.methods.allowance(userAddress, allowanceTarget).call();
      return +allowance;
    } catch (e) {
      console.error('MetamaskService allowance:', e);
      return 0;
    }
  };

  public approve = async ({
    amount,
    userAddress,
    allowanceTarget,
    contractAbi,
    contractAddress,
  }: TypeApprove) => {
    try {
      const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
      return contract.methods.approve(allowanceTarget, amount).send({ from: userAddress });
    } catch (e) {
      console.error('MetamaskService approve:', e);
      return null;
    }
  };

  public getGasPrice = async () => {
    const price = await this.web3Provider.eth.getGasPrice();
    return +new BigNumber(price).dividedBy(new BigNumber(10).pow(9)).toFixed();
  };

  public getLastBlockInverval = async () => {
    try {
      const latestBlock = await this.web3Provider.eth.getBlock('latest');
      const prevBlock = await this.web3Provider.eth.getBlock(latestBlock.number - 1);
      const prevPrevBlock = await this.web3Provider.eth.getBlock(latestBlock.number - 2);
      const interval1 = latestBlock.timestamp - prevBlock.timestamp;
      const interval2 = prevBlock.timestamp - prevPrevBlock.timestamp;
      console.log('MetamaskService getLastBlockInverval:', latestBlock, prevBlock);
      return { status: 'SUCCESS', data: ((interval1 + interval2) / 2) * 1000 };
    } catch (e) {
      console.error('MetamaskService getLastBlockInverval:', e);
      return { status: 'ERROR', data: null };
    }
  };
}
