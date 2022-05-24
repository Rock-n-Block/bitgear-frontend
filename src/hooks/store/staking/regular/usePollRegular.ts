import { useEffect } from 'react';

import { regularStaking } from '../../../../redux/async';
import { userSelectors } from '../../../../redux/selectors';
import { useRefresh } from '../../../useRefresh';
import { useShallowSelector } from '../../../useShallowSelector';
import { useWeb3Provider } from '../../../useWeb3Provider';

export const usePollRegular = (): void => {
  const { slowRefresh } = useRefresh();
  const { address: userWalletAddress } = useShallowSelector(userSelectors.getUser);
  const { web3Provider } = useWeb3Provider();

  useEffect(() => {
    regularStaking.fetchPublicData({});
  }, [slowRefresh]);

  useEffect(() => {
    if (userWalletAddress) {
      regularStaking.fetchUserData({
        provider: web3Provider,
        userWalletAddress,
      });
    }
  }, [userWalletAddress, slowRefresh, web3Provider]);
};
