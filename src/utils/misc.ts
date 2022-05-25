import BigNumber from 'bignumber.js/bignumber';

// TODO: logic getting the token USD prices
const prices: Record<string, string> = {
  'GEAR': '0.23',
  'GEAR-ETH': '5.2',
};

export const getDollarAmount = (amount: string | number, token: keyof typeof prices | string) => {
  const price = prices[token];
  return new BigNumber(amount).multipliedBy(price).toFixed();
};
