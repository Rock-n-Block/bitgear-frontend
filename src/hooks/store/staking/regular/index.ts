import { useEffect } from 'react';

import { regularStaking } from '../../../../redux/async';
import { userSelectors } from '../../../../redux/selectors';
import { useShallowSelector } from '../../../useShallowSelector';

export const usePollRegular = (): void => {
  const { address: userWalletAddress } = useShallowSelector(userSelectors.getUser);

  useEffect(() => {
    regularStaking.fetchPublicData({ payload: {} });
  }, []);

  useEffect(() => {
    if (userWalletAddress) {
      regularStaking.fetchUserData({
        payload: {
          userWalletAddress,
        },
      });
    }
  }, [userWalletAddress]);
};
