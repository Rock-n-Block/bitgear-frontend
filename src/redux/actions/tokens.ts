import { TokensState } from '../../types';
import { tokensActionTypes } from '../actionTypes';

export default {
  setUsdPrices: (payload: TokensState['usdPrices']) => ({
    type: tokensActionTypes.SET_USD_PRICES,
    payload,
  }),
};
