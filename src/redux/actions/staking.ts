import { StakingState } from '../../types';
import { stakingActionTypes } from '../actionTypes';

export default {
  setRegularPublicData: (payload: Partial<StakingState['regular']['public']>) => ({
    type: stakingActionTypes.SET_REGULAR_PUBLIC_DATA,
    payload,
  }),
  setRegularUserData: (payload: Partial<StakingState['regular']['user']>) => ({
    type: stakingActionTypes.SET_REGULAR_USER_DATA,
    payload,
  }),

  setBalance: (payload: StakingState['balances']) => ({
    type: stakingActionTypes.SET_BALANCES,
    payload,
  }),
};
