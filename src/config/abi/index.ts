import { AbiItem } from 'web3-utils';

import coinStaking from './CoinStaking.json';
import customSwap from './CustomSwap.json';
import erc20 from './Erc20.json';
import uniswapV2Pair from './UniswapV2Pair.json';

export const erc20Abi = erc20 as AbiItem[];
export const uniswapV2PairAbi = uniswapV2Pair as AbiItem[];
export const coinStakingAbi = coinStaking as AbiItem[];
export const customSwapAbi = customSwap as AbiItem[];
