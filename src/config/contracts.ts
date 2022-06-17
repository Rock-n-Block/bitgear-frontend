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
        // address: '0x52Ec8c87FC09C1eF75fAe44139cE8A0A425f9B40', // rinkeby
        address: '0x04112386DbA832f665f006C46960535DE802D1a2', // ropsten
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
        // address: '0xdf0E7F1df4BCA344e006428B59321653bC0b5daF', // rinkeby
        address: '0xBa5323aEE78F0802137a92492Bfd8C7A241f9163', // rinkeby
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
