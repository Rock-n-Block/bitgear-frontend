import { Chains, ContractsNames, IContracts } from '../types';

import { coinStakingAbi, erc20Abi, tokenVaultAbi, uniswapV2PairAbi } from './abi';

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
  [ContractsNames.uniswapV2Pair]: {
    mainnet: {
      [Chains.eth]: {
        address: '',
        abi: uniswapV2PairAbi,
      },
      [Chains.bsc]: {
        address: '',
        abi: uniswapV2PairAbi,
      },
      [Chains.polygon]: {
        address: '',
        abi: uniswapV2PairAbi,
      },
      [Chains.moonriver]: {
        address: '',
        abi: uniswapV2PairAbi,
      },
    },
    testnet: {
      [Chains.eth]: {
        address: '',
        abi: uniswapV2PairAbi,
      },
      [Chains.bsc]: {
        address: '',
        abi: uniswapV2PairAbi,
      },
      [Chains.polygon]: {
        address: '',
        abi: uniswapV2PairAbi,
      },
      [Chains.moonriver]: {
        address: '',
        abi: uniswapV2PairAbi,
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
  [ContractsNames.tokenVault]: {
    mainnet: {
      [Chains.eth]: {
        address: '',
        abi: tokenVaultAbi,
      },
      [Chains.bsc]: {
        address: '',
        abi: tokenVaultAbi,
      },
      [Chains.polygon]: {
        address: '',
        abi: tokenVaultAbi,
      },
      [Chains.moonriver]: {
        address: '',
        abi: tokenVaultAbi,
      },
    },
    testnet: {
      [Chains.eth]: {
        address: '0xc8FD81056C4fe7689443D9a973A23B650B42313C', // rinkeby
        abi: tokenVaultAbi,
      },
      [Chains.bsc]: {
        address: '',
        abi: tokenVaultAbi,
      },
      [Chains.polygon]: {
        address: '',
        abi: tokenVaultAbi,
      },
      [Chains.moonriver]: {
        address: '',
        abi: tokenVaultAbi,
      },
    },
  },
};
