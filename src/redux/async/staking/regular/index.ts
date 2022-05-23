import { stakingActions } from '../../../actions';
import * as apiActions from '../../../actions/ui';
import { stakingActionTypes } from '../../../actionTypes';
import store from '../../../store';

const fetchPublicData = async ({
  type = stakingActionTypes.SET_REGULAR_PUBLIC_DATA,
  payload,
}: Partial<ReturnType<typeof stakingActions.setRegularPublicData>>): Promise<void> => {
  try {
    store.dispatch(apiActions.request(type));
    console.log('Test', payload);
    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Regular', err);
    store.dispatch(apiActions.error(type, err));
  }
};

const fetchUserData = async ({
  type = stakingActionTypes.SET_REGULAR_USER_DATA,
  payload,
}: Partial<ReturnType<typeof stakingActions.setRegularUserData>>): Promise<void> => {
  try {
    store.dispatch(apiActions.request(type));
    console.log('Test', payload);
    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Regular', err);
    store.dispatch(apiActions.error(type, err));
  }
};

export default {
  fetchPublicData,
  fetchUserData,
};
