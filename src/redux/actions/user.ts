import { UserState } from '../../types';
import { userActionTypes } from '../actionTypes';

export default {
  setUserData: (payload: Partial<UserState>) => ({
    type: userActionTypes.SET_DATA,
    payload,
  }),
  setAllowance: (payload: UserState['allowances']) => ({
    type: userActionTypes.SET_ALLOWANCE,
    payload,
  }),
};
