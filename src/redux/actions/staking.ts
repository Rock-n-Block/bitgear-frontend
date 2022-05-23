import { stakingActionTypes } from '../actionTypes';

type SetRegularPublicDataPayload = {};
type SetRegularUserDataPayload = {
  userWalletAddress: string;
};

export default {
  setRegularPublicData: (payload: SetRegularPublicDataPayload) => ({
    type: stakingActionTypes.SET_REGULAR_PUBLIC_DATA,
    payload,
  }),
  setRegularUserData: (payload: SetRegularUserDataPayload) => ({
    type: stakingActionTypes.SET_REGULAR_USER_DATA,
    payload,
  }),
};
