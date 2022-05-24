import { useCallback, useMemo } from 'react';

import gearToken from '../../../../data/gearToken';
// import { useWeb3Provider } from 'src/hooks/useWeb3Provider';
import { userSelectors } from '../../../../redux/selectors';
import { ContractsNames } from '../../../../types';
import { contractsHelper, serialize } from '../../../../utils';
import { useShallowSelector } from '../../../useShallowSelector';
import { useAllowance, useApprove } from '../../erc20';

// import { regularStaking } from '../../../../redux/async';
// import { userSelectors } from '../../../../redux/selectors';
// import { useRefresh } from '../../../useRefresh';
// import { useShallowSelector } from '../../../useShallowSelector';

export const useStakingRegular = () => {
  // const { slowRefresh } = useRefresh();
  // const { address: userWalletAddress } = useShallowSelector(userSelectors.getUser);
  // useEffect(() => {
  //   regularStaking.fetchPublicData({});
  // }, [slowRefresh]);
  // useEffect(() => {
  //   if (userWalletAddress) {
  //     regularStaking.fetchUserData({
  //       payload: {
  //         userWalletAddress,
  //       },
  //     });
  //   }
  // }, [userWalletAddress, slowRefresh]);

  // const { web3Provider } = useWeb3Provider();
  const { network } = useShallowSelector(userSelectors.getUser);
  const coinStakingAddress = useMemo(
    () => contractsHelper.getContractData(ContractsNames.coinStaking, network).address,
    [network],
  );
  // const contract = contractsHelper.getCoinStakingContract(web3Provider, coinStakingAddress);

  const stakeAllowance = useShallowSelector(
    userSelectors.selectAllowance(gearToken.address, coinStakingAddress),
  );

  const { checkAllowance, isLoading: isAllowanceLoading } = useAllowance();
  const handleCheckAllowance = useCallback(() => {
    checkAllowance(gearToken.address, coinStakingAddress);
  }, [checkAllowance, coinStakingAddress]);

  const { approve, fetchStatus: approveStatus } = useApprove();
  const handleApprove = useCallback(
    (amount: string) => {
      approve(gearToken.address, coinStakingAddress, serialize(amount, gearToken.decimals));
    },
    [approve, coinStakingAddress],
  );

  const handleStake = useCallback((...args) => {
    console.log('useStakingRegular/handleStake', args);
  }, []);

  const userData = useMemo(
    () => ({
      balance: '25',
    }),
    [],
  );

  const ret = {
    handleStake,
    userData,

    stakeTokenAllowance: {
      isAllowanceLoading,
      allowance: stakeAllowance,
      handleCheckAllowance,
      handleApprove,
      approveStatus,
    },
  };
  return ret;
};
