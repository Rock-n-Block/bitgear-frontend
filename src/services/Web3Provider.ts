import WalletConnectProvider from '@walletconnect/web3-provider';
import BigNumber from 'bignumber.js/bignumber';
import { isEqual } from 'lodash';
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

export default class Web3Provider {
  public provider: any;

  public web3Provider: any;

  // public allowanceTarget: string;

  public addresses: any;

  constructor() {
    this.provider = new WalletConnectProvider({
      infuraId: process.env.REACT_APP_INFURA_KEY,
    });
    this.web3Provider = new Web3(this.provider);
    this.addresses = config.addresses;
    // this.allowanceTarget = this.addresses[config.netType].allowanceTarget;

    this.provider.on('accountsChanged', (accounts: string[]) => {
      const fromStorage = localStorage.getItem('accountsWalletConnect') || '{}';
      console.log('Web3Provider accountsChanged:', accounts, JSON.parse(fromStorage).accounts);
      if (!accounts || !isEqual(JSON.parse(fromStorage).accounts, accounts)) {
        localStorage.setItem('accountsWalletConnect', JSON.stringify({ accounts }));
        window.location.reload();
      }
    });

    this.provider.on('chainChanged', (chainId: number) => {
      const fromStorage = localStorage.getItem('chainIdWalletConnect') || '{}';
      console.log('Web3Provider chainChanged:', chainId, JSON.parse(fromStorage).chainId);
      if (!chainId || !isEqual(JSON.parse(fromStorage).chainId, chainId)) {
        localStorage.setItem('chainIdWalletConnect', JSON.stringify({ chainId }));
        window.location.reload();
      }
    });

    this.provider.on('disconnect', (code: number, reason: string) => {
      console.log('Web3Provider disconnect:', code, reason);
    });
  }

  public checkNetwork = async () => {
    const { chainIds } = config;
    const chainIdsByType = chainIds[config.IS_PRODUCTION ? 'mainnet' : 'testnet'];
    const usedNet = chainIdsByType.Ethereum.id;
    const netVersion =
      (await this.provider.request({ method: 'eth_chainId' })) || this.provider.chainId;
    const neededNetName = chainIdsByType.Ethereum.name;
    console.log('Web3Provider checkNetwork:', usedNet, netVersion, neededNetName);
    if (usedNet.includes(netVersion)) return { status: 'SUCCESS', data: netVersion };
    return {
      status: 'ERROR',
      message: `Please, change network to ${neededNetName} in your WalletConnect wallet`,
    };
  };

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

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  public createTxForCustomAddress = async (data: any, userAddress: string) => {
    const transactionMethod = Web3Provider.getMethodInterface(customSwapAbi, 'doThing');

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

  public disconnect = () => {
    this.provider.disconnect();
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
      console.error('Web3Provider totalSupply:', e);
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
      console.log('Web3Provider allowance', {
        userAddress,
        allowanceTarget,
        contractAddress,
        contractAbi,
      });
      const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
      const allowance = await contract.methods.allowance(userAddress, allowanceTarget).call();
      return +allowance;
    } catch (e) {
      console.error('Web3Provider allowance:', e);
      return 0;
    }
  };

  public approve = async ({
    // amount,
    userAddress,
    allowanceTarget,
    contractAbi,
    contractAddress,
  }: TypeApprove) => {
    try {
      const totalSupply = await this.totalSupply({ contractAddress, contractAbi });
      const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
      return contract.methods.approve(allowanceTarget, totalSupply).send({ from: userAddress });
    } catch (e) {
      console.error('Web3Provider approve:', e);
      return null;
    }
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
