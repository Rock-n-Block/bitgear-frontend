import { UserState } from '../../types';

export default {
  setUserData: (payload: Partial<UserState>) => ({
    type: 'USER:SET_DATA',
    payload,
  }),
};
