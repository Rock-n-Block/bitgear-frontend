import Web3 from 'web3';

import config, { contracts } from '../config';
import { coinStakingAbi, erc20Abi } from '../config/abi';
import { Chains, ContractsNames, IContract } from '../types';
import { CoinStaking, Erc20 } from '../types/contracts';

const contractsGetter = {
  getErc20Contract(provider: Web3, contractAddress: string) {
    return new provider.eth.Contract(erc20Abi, contractAddress) as unknown as Erc20;
  },
  getCoinStakingContract(provider: Web3, contractAddress: string) {
    return new provider.eth.Contract(coinStakingAbi, contractAddress) as unknown as CoinStaking;
  },
};

export const contractsHelper = {
  ...contractsGetter,

  getContractData(
    contractName: ContractsNames,
    network: Chains,
    isMainnet: boolean = config.IS_PRODUCTION,
  ): IContract {
    return contracts[contractName][isMainnet ? 'mainnet' : 'testnet'][network];
  },
};
