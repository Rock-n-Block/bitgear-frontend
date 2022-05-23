import { StakingState } from '../../types';
import { stakingActionTypes } from '../actionTypes';

const initialState: StakingState = {
  liquidityPools: {
    public: {},
    user: {},
  },
  compounder: {
    public: {},
    user: {},
  },
  regular: {
    public: {},
    user: {},
  },

  // user tokens' balances
  // NOTE: this is almost duplicate of `store/reducer/user.ts` balances, due to unknown behaviour that causes to reset the state, not the EXTEND the state
  balances: {},
};

export default (state = initialState, params: any) => {
  switch (params.type) {
    case stakingActionTypes.SET_REGULAR_PUBLIC_DATA: {
      return {
        ...state,
        regular: {
          ...state.regular,
          public: {
            ...state.regular.public,
            ...params.payload,
          },
        },
      };
    }

    case stakingActionTypes.SET_REGULAR_USER_DATA: {
      return {
        ...state,
        regular: {
          ...state.regular,
          user: {
            ...state.regular.user,
            ...params.payload,
          },
        },
      };
    }

    default:
      return state;
  }
};
