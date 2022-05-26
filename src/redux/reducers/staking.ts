import { StakingState } from '../../types';
import { stakingActionTypes } from '../actionTypes';

const initialState: StakingState = {
  liquidityPools: {
    public: {
      totalStaked: '',
      lastRewardTime: '0',
      rewardPerSecond: '',
    },
    user: {
      stakedAmount: '',
      pendingReward: '',
      earned: '',
    },
  },
  compounder: {
    public: {
      pricePerShare: '',
      totalShares: '',
    },
    user: {
      stakedShares: '',
      earned: '',
    },
  },
  regular: {
    public: {
      totalStaked: '',
      lastRewardTime: '0',
      rewardPerSecond: '',
    },
    user: {
      stakedAmount: '',
      pendingReward: '',
      earned: '',
    },
  },

  // user tokens' balances
  // NOTE: this is almost duplicate of `store/reducer/user.ts` balances, due to its unknown behaviour that causes to reset the state, not the EXTEND the state
  balances: {},
};

export default (state = initialState, params: any): StakingState => {
  switch (params.type) {
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

    // Regular
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

    // LP
    case stakingActionTypes.SET_LP_PUBLIC_DATA: {
      return {
        ...state,
        liquidityPools: {
          ...state.liquidityPools,
          public: {
            ...state.liquidityPools.public,
            ...params.payload,
          },
        },
      };
    }

    case stakingActionTypes.SET_LP_USER_DATA: {
      return {
        ...state,
        liquidityPools: {
          ...state.liquidityPools,
          user: {
            ...state.liquidityPools.user,
            ...params.payload,
          },
        },
      };
    }

    // Compounder
    case stakingActionTypes.SET_COMPOUNDER_PUBLIC_DATA: {
      return {
        ...state,
        compounder: {
          ...state.compounder,
          public: {
            ...state.compounder.public,
            ...params.payload,
          },
        },
      };
    }

    case stakingActionTypes.SET_COMPOUNDER_USER_DATA: {
      return {
        ...state,
        compounder: {
          ...state.compounder,
          user: {
            ...state.compounder.user,
            ...params.payload,
          },
        },
      };
    }

    default:
      return state;
  }
};
