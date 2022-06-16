import BigNumber from 'bignumber.js/bignumber';

import { tokensSelectors } from '../redux/selectors';
import store from '../redux/store';

// // TODO: logic getting the token USD prices
// const prices: Record<string, string> = {
//   'GEAR': '0.23',
//   'GEAR-ETH': '5.2',
// };

export const getDollarAmount = (amount: string | number, tokenAddress: string) => {
  const state = store.getState();
  const price = tokensSelectors.selectUsdPrice(tokenAddress)(state);

  return new BigNumber(amount).multipliedBy(price).toFixed();
};
