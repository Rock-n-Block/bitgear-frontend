import { useEffect } from 'react';

import { regularStaking } from '../../../../redux/async';
import { userSelectors } from '../../../../redux/selectors';
import { useRefresh } from '../../../useRefresh';
import { useShallowSelector } from '../../../useShallowSelector';

export const usePollRegular = (): void => {
  const { slowRefresh } = useRefresh();
  const { address: userWalletAddress } = useShallowSelector(userSelectors.getUser);

  useEffect(() => {
    regularStaking.fetchPublicData({});
  }, [slowRefresh]);

  useEffect(() => {
    if (userWalletAddress) {
      regularStaking.fetchUserData({
        payload: {
          userWalletAddress,
        },
      });
    }
  }, [userWalletAddress, slowRefresh]);
};
