import { useCallback, useState } from 'react';

import { fetchAllowance } from '../../../redux/async';
import { userSelectors } from '../../../redux/selectors';
import { useShallowSelector } from '../../useShallowSelector';
import { useWeb3Provider } from '../../useWeb3Provider';

export const useAllowance = () => {
  const { web3Provider } = useWeb3Provider();
  const { address: userWalletAddress } = useShallowSelector(userSelectors.getUser);
  const [isLoading, setIsLoading] = useState(false);

  const checkAllowance = useCallback(
    async (tokenAddress: string, spenderAddress: string) => {
      if (!userWalletAddress) return;
      setIsLoading(true);
      await fetchAllowance({
        provider: web3Provider,
        ownerAddress: userWalletAddress,
        tokenAddress,
        spenderAddress,
      });
      setIsLoading(false);
    },
    [userWalletAddress, web3Provider],
  );

  return {
    isLoading,
    checkAllowance,
  };
};
