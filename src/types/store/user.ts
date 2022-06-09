import { Chains } from '../walletConnect';

/**
 * @example {
 *   [spenderAddress]: '100000000000',
 * }
 */
export type MapSpenderAddressToAllowance = Record<string, string>;

/**
 * @example {
 *    [tokenAddress]: {
 *        [spenderAddress]: '100000000',
 *    }
 * }
 */
export type MapTokenAddressToMapSpenderAddressToAllowance = Record<
  string,
  MapSpenderAddressToAllowance
>;

export type UserState = {
  address?: string | null;
  network: Chains;
  balance: number;
  /**
   * map address to tokenBalance value
   * @see https://github.com/Rock-n-Block/bitgear-frontend/blob/e91f95b11e2deef4a3ec726d2c31206543afde01/src/App.tsx#L376
   */
  balances: Record<string, string>;
  allowances: MapTokenAddressToMapSpenderAddressToAllowance;
};
