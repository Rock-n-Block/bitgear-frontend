import BigNumber from 'bignumber.js/bignumber';

import config from '../../config';
import gearToken from '../../data/gearToken';
import { userSelectors } from '../../redux/selectors';
import store from '../../redux/store';
import { serialize } from '../bigNumberSerializers';

const {
  deviatingAddressReducedFee,
  deviatingAddressRegularFee,
  minTokenAmountToApplyLowerFees,
  reducedFee,
  regularFee,
} = config.tradeFees;

const minTokenAmountToApplyLowerFeesSerialized = serialize(
  minTokenAmountToApplyLowerFees,
  gearToken.decimals,
);

/**
 * @param isDeviatingAddress when you want to exchange a token, but so that it does not come to your address, but, for example, to another user's wallet.
 */
export const getService0xBuyQuoteTokenFees = (isDeviatingAddress = false): number => {
  const state = store.getState();
  const { balances } = userSelectors.getUser(state);
  console.log('balances', balances);
  // lower case balances map keys
  const balancesWithLowerCasedKeys = Object.entries(balances).reduce((acc, [key, value]) => {
    acc[key.toLowerCase()] = value;
    return acc;
  }, {} as typeof balances);
  const gearTokenUserBalance = balancesWithLowerCasedKeys[gearToken.address.toLowerCase()];
  console.log(
    'gearToken.address.toLowerCase()',
    gearToken.address.toLowerCase(),
    gearTokenUserBalance,
  );
  const shouldApplyDecreasedFee = new BigNumber(gearTokenUserBalance).isGreaterThanOrEqualTo(
    minTokenAmountToApplyLowerFeesSerialized,
  );

  if (isDeviatingAddress) {
    if (shouldApplyDecreasedFee) {
      return deviatingAddressReducedFee;
    }
    return deviatingAddressRegularFee;
  }

  if (shouldApplyDecreasedFee) {
    return reducedFee;
  }

  return regularFee;
};
