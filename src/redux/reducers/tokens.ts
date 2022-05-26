import { TokensState } from '../../types';
import { tokensActionTypes } from '../actionTypes';

const initialState: TokensState = {
  usdPrices: {},
};

export default (state = initialState, params: any): TokensState => {
  switch (params.type) {
    case tokensActionTypes.SET_USD_PRICES: {
      // lower case all of the addresses
      const newPrices = Object.entries(params.payload as TokensState['usdPrices']).reduce(
        (acc, [address, value]) => {
          acc[address.toLowerCase()] = value;
          return acc;
        },
        {} as TokensState['usdPrices'],
      );
      return {
        ...state,
        usdPrices: {
          ...state.usdPrices,
          ...newPrices,
        },
      };
    }
    default:
      return state;
  }
};
