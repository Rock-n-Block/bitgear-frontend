import { useCallback, useState } from 'react';

import { fetchApprove } from '../../../redux/async';
import { userSelectors } from '../../../redux/selectors';
import { RequestStatus } from '../../../types';
import { useShallowSelector } from '../../useShallowSelector';
import { useWeb3Provider } from '../../useWeb3Provider';

export const useApprove = () => {
  const { web3Provider } = useWeb3Provider();
  const { address: userWalletAddress } = useShallowSelector(userSelectors.getUser);
  const [fetchStatus, setFetchStatus] = useState(RequestStatus.INIT);

  const approve = useCallback(
    async (tokenAddress: string, spenderAddress: string, amount: string) => {
      setFetchStatus(RequestStatus.REQUEST);
      const approveStatus = await fetchApprove({
        provider: web3Provider,
        userWalletAddress: userWalletAddress ?? '',
        tokenAddress,
        spenderAddress,
        amount,
      });
      if (approveStatus) {
        setFetchStatus(RequestStatus.SUCCESS);
      } else {
        setFetchStatus(RequestStatus.ERROR);
      }
    },
    [userWalletAddress, web3Provider],
  );

  return {
    fetchStatus,
    approve,
  };
};
