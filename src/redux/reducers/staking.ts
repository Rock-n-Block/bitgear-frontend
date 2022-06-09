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
    public: {
      totalStaked: '',
      lastRewardTime: '0',
    },
    user: {
      stakedAmount: '',
      pendingReward: '',
    },
  },

  // user tokens' balances
  // NOTE: this is almost duplicate of `store/reducer/user.ts` balances, due to its unknown behaviour that causes to reset the state, not the EXTEND the state
  balances: {},
};

export default (state = initialState, params: any): StakingState => {
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

    case stakingActionTypes.SET_BALANCES: {
      // lower case all of the addresses
      const newBalances = Object.entries(params.payload as StakingState['balances']).reduce(
        (acc, [address, value]) => {
          acc[address.toLowerCase()] = value;
          return acc;
        },
        {} as StakingState['balances'],
      );
      return {
        ...state,
        balances: {
          ...state.balances,
          ...newBalances,
        },
      };
    }

    default:
      return state;
  }
};
