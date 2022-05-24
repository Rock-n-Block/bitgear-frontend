import { AbiItem } from 'web3-utils';

export type TChainType = 'mainnet' | 'testnet';

export enum ContractsNames {
  erc20 = 'erc20',
  coinStaking = 'coinStaking',
}

export enum Chains {
  eth = 'Ethereum',
  bsc = 'Binance-Smart-Chain',
  polygon = 'Polygon',
  moonriver = 'Moonriver',
}

export interface IContract {
  address: string;
  abi: AbiItem[];
}

export type IContracts = {
  [contractName in ContractsNames]: {
    [chainType in TChainType]: {
      [key in Chains]: IContract;
    };
  };
};

export type TChainIds = {
  [chainType in TChainType]: {
    [key in Chains]: {
      name: string;
      id: (number | string)[];
    };
  };
};

export type SupportedTestnets = 'rinkeby' | 'ropsten' | 'kovan';
