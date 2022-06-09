import { AbiItem } from 'web3-utils';

import coinStaking from './CoinStaking.json';
import customSwap from './CustomSwap.json';
import erc20 from './Erc20.json';

export const erc20Abi = erc20 as AbiItem[];
export const coinStakingAbi = coinStaking as AbiItem[];
export const customSwapAbi = customSwap as AbiItem[];
