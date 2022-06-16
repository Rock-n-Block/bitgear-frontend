import qs from 'query-string';

import { NetType } from '../config';
import { Chains } from '../types';

const dexUrls: Record<Chains, string> = {
  [Chains.eth]: 'https://app.uniswap.org/#',
  [Chains.bsc]: 'https://pancakeswap.finance',
  [Chains.moonriver]: '',
  [Chains.polygon]: '',
};

const swapUrls: Record<Chains, string> = {
  [Chains.eth]: `${dexUrls[Chains.eth]}/swap?outputCurrency=`,
  [Chains.bsc]: `${dexUrls[Chains.bsc]}/swap?outputCurrency=`,
  [Chains.moonriver]: '',
  [Chains.polygon]: '',
};

const addLiquidityUrls: Record<Chains, string> = {
  [Chains.eth]: `${dexUrls[Chains.eth]}/add/v2/`,
  [Chains.bsc]: `${dexUrls[Chains.bsc]}/add/`,
  [Chains.moonriver]: '',
  [Chains.polygon]: '',
};

export const constructSwapUrl = (address: string, network: Chains): string => {
  return `${swapUrls[network]}${address}`;
};

export const constructAddLiquidityUrl = (
  tokenAddress1: string,
  tokenAddress2: string,
  network: Chains,
  options?: {
    chain: NetType;
  },
): string => {
  return `${addLiquidityUrls[network]}${tokenAddress1}/${tokenAddress2}${
    options ? `?${qs.stringify(options)}` : ''
  }`;
};
