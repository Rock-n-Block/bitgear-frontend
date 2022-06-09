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

  setLpPublicData: (payload: Partial<StakingState['liquidityPools']['public']>) => ({
    type: stakingActionTypes.SET_LP_PUBLIC_DATA,
    payload,
  }),
  setLpUserData: (payload: Partial<StakingState['liquidityPools']['user']>) => ({
    type: stakingActionTypes.SET_LP_USER_DATA,
    payload,
  }),

  setCompounderPublicData: (payload: Partial<StakingState['compounder']['public']>) => ({
    type: stakingActionTypes.SET_COMPOUNDER_PUBLIC_DATA,
    payload,
  }),
  setCompounderUserData: (payload: Partial<StakingState['compounder']['user']>) => ({
    type: stakingActionTypes.SET_COMPOUNDER_USER_DATA,
    payload,
  }),

  setBalance: (payload: StakingState['balances']) => ({
    type: stakingActionTypes.SET_BALANCES,
    payload,
  }),
};
