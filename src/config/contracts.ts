import { Chains, ContractsNames, IContracts } from '../types';

import { coinStakingAbi, erc20Abi } from './abi';

export const contracts: IContracts = {
  [ContractsNames.erc20]: {
    mainnet: {
      [Chains.eth]: {
        address: '',
        abi: erc20Abi,
      },
      [Chains.bsc]: {
        address: '',
        abi: erc20Abi,
      },
      [Chains.polygon]: {
        address: '',
        abi: erc20Abi,
      },
      [Chains.moonriver]: {
        address: '',
        abi: erc20Abi,
      },
    },
    testnet: {
      [Chains.eth]: {
        address: '',
        abi: erc20Abi,
      },
      [Chains.bsc]: {
        address: '',
        abi: erc20Abi,
      },
      [Chains.polygon]: {
        address: '',
        abi: erc20Abi,
      },
      [Chains.moonriver]: {
        address: '',
        abi: erc20Abi,
      },
    },
  },
  [ContractsNames.coinStaking]: {
    mainnet: {
      [Chains.eth]: {
        address: '',
        abi: coinStakingAbi,
      },
      [Chains.bsc]: {
        address: '',
        abi: coinStakingAbi,
      },
      [Chains.polygon]: {
        address: '',
        abi: coinStakingAbi,
      },
      [Chains.moonriver]: {
        address: '',
        abi: coinStakingAbi,
      },
    },
    testnet: {
      [Chains.eth]: {
        address: '0xbe5ef7839132CEc790bEC588aEB74478DdAc7990', // rinkeby
        abi: coinStakingAbi,
      },
      [Chains.bsc]: {
        address: '',
        abi: coinStakingAbi,
      },
      [Chains.polygon]: {
        address: '',
        abi: coinStakingAbi,
      },
      [Chains.moonriver]: {
        address: '',
        abi: coinStakingAbi,
      },
    },
  },
};
