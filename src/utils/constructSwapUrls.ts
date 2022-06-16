import { Chains } from '../types';

const swapUrls: Record<Chains, string> = {
  [Chains.eth]: 'https://app.uniswap.org/#/swap?outputCurrency=',
  [Chains.bsc]: 'https://pancakeswap.finance/swap?outputCurrency=',
  [Chains.moonriver]: '',
  [Chains.polygon]: '',
};

export const constructSwapUrl = (address: string, network: Chains) => {
  return `${swapUrls[network]}${address}`;
};
