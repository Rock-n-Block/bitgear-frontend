import { useEffect } from 'react';

import { compounderStaking } from '../../../../redux/async';
import { userSelectors } from '../../../../redux/selectors';
import { useRefresh } from '../../../useRefresh';
import { useShallowSelector } from '../../../useShallowSelector';
import { useWeb3Provider } from '../../../useWeb3Provider';

export const usePollCompounder = (): void => {
  const { slowRefresh } = useRefresh();
  const { address: userWalletAddress } = useShallowSelector(userSelectors.getUser);
  const { web3Provider } = useWeb3Provider();

  useEffect(() => {
    compounderStaking.fetchPublicData({ provider: web3Provider });
  }, [slowRefresh, web3Provider]);

  useEffect(() => {
    if (userWalletAddress) {
      compounderStaking.fetchUserData({
        provider: web3Provider,
        userWalletAddress,
      });
    }
  }, [userWalletAddress, slowRefresh, web3Provider]);
};
