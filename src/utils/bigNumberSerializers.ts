import BigNumber from 'bignumber.js/bignumber';

/**
 * As BigNumber.
 * @param amount 1 (`decimals` = 18)
 * @returns 1000000000000000000 (=`amount` * 10 ** `decimals`)
 */
export const serializeBN = (amount: BigNumber | string | number, decimals = 18): BigNumber =>
  new BigNumber(amount).times(new BigNumber(10).pow(decimals));

/**
 * @param amount 1 (`decimals` = 18)
 * @returns 1000000000000000000 (=`amount` * 10 ** `decimals`)
 */
export const serialize = (amount: BigNumber | string | number, decimals = 18): string =>
  serializeBN(amount, decimals).toFixed();

/**
 * As BigNumber.
 * @param decimalAmount 1000000000000000000 (`decimals` = 18)
 * @returns 1 (=`decimalAmount` / 10 ** `decimals`)
 */
export const deserializeBN = (
  decimalAmount: BigNumber | number | string,
  decimals = 18,
): BigNumber => new BigNumber(decimalAmount).dividedBy(new BigNumber(10).pow(decimals));

/**
 * @param decimalAmount 1000000000000000000 (`decimals` = 18)
 * @returns 1 (=`decimalAmount` / 10 ** `decimals`)
 */
export const deserialize = (decimalAmount: BigNumber | number | string, decimals = 18): string =>
  deserializeBN(decimalAmount, decimals).toFixed();
