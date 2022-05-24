import {
  Chains,
  MapSpenderAddressToAllowance,
  MapTokenAddressToMapSpenderAddressToAllowance,
  UserState,
} from '../../types';
import { userActionTypes } from '../actionTypes';

const initialState: UserState = {
  address: null,
  network: Chains.eth,
  balance: 0,
  balances: {},
  allowances: {},
};

export default (state = initialState, params: any): UserState => {
  switch (params.type) {
    case userActionTypes.SET_DATA: {
      const newState = JSON.parse(
        JSON.stringify({
          ...state,
          ...params.payload,
        }),
      );
      return newState;
    }
    case userActionTypes.SET_ALLOWANCE: {
      const newAllowances: MapTokenAddressToMapSpenderAddressToAllowance = { ...params.payload };
      // need to make all of the keys to be lower cased
      const newAllowancesNormalized = Object.entries(newAllowances).reduce(
        (accumulator, [tokenAddress, value]) => {
          const spenderAddresses = Object.entries(value).reduce(
            (acc, [spenderAddress, allowance]) => {
              acc[spenderAddress.toLowerCase()] = allowance;
              return acc;
            },
            {} as MapSpenderAddressToAllowance,
          );
          accumulator[tokenAddress.toLowerCase()] = spenderAddresses;
          return accumulator;
        },
        {} as MapTokenAddressToMapSpenderAddressToAllowance,
      );
      return {
        ...state,
        allowances: {
          ...state.allowances,
          ...newAllowancesNormalized,
        },
      };
    }
    default:
      return state;
  }
};
