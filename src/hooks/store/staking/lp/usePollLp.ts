import { useEffect } from 'react';

import { lpStaking } from '../../../../redux/async';
import { userSelectors } from '../../../../redux/selectors';
import { useRefresh } from '../../../useRefresh';
import { useShallowSelector } from '../../../useShallowSelector';
import { useWeb3Provider } from '../../../useWeb3Provider';

export const usePollLp = (): void => {
  const { slowRefresh } = useRefresh();
  const { address: userWalletAddress } = useShallowSelector(userSelectors.getUser);
  const { web3Provider } = useWeb3Provider();

  useEffect(() => {
    lpStaking.fetchPublicData({ provider: web3Provider });
  }, [slowRefresh, web3Provider]);

  useEffect(() => {
    if (userWalletAddress) {
      lpStaking.fetchUserData({
        provider: web3Provider,
        userWalletAddress,
      });
    }
  }, [userWalletAddress, slowRefresh, web3Provider]);
};
