import { useCallback, useEffect, useMemo } from 'react';

import gearToken from '../../../../data/gearToken';
import { stakingActionTypes } from '../../../../redux/actionTypes';
import { regularStaking } from '../../../../redux/async';
import { stakingSelectors, uiSelectors, userSelectors } from '../../../../redux/selectors';
import { ContractsNames, RequestStatus } from '../../../../types';
import { contractsHelper, deserialize, serialize } from '../../../../utils';
import { useShallowSelector } from '../../../useShallowSelector';
import { useWeb3Provider } from '../../../useWeb3Provider';
import { useAllowance, useApprove } from '../../erc20';

const STAKE_TOKEN = gearToken;

export const useStakingRegular = () => {
  const { web3Provider } = useWeb3Provider();
  const { address: userWalletAddress, network } = useShallowSelector(userSelectors.getUser);
  const coinStakingAddress = useMemo(
    () => contractsHelper.getContractData(ContractsNames.coinStaking, network).address,
    [network],
  );

  const stakeAllowance = useShallowSelector(
    userSelectors.selectAllowance(STAKE_TOKEN.address, coinStakingAddress),
  );

  const { checkAllowance, isLoading: isAllowanceLoading } = useAllowance();
  const handleCheckAllowance = useCallback(() => {
    checkAllowance(STAKE_TOKEN.address, coinStakingAddress);
  }, [checkAllowance, coinStakingAddress]);

  const { approve, fetchStatus: approveStatus } = useApprove();
  const handleApprove = useCallback(
    (amount: string) => {
      approve(STAKE_TOKEN.address, coinStakingAddress, serialize(amount, STAKE_TOKEN.decimals));
    },
    [approve, coinStakingAddress],
  );

  const handleStake = useCallback(
    (amount) => {
      regularStaking.stake({
        provider: web3Provider,
        userWalletAddress: userWalletAddress || '',
        amount: serialize(amount, STAKE_TOKEN.decimals),
      });
    },
    [userWalletAddress, web3Provider],
  );
  const handleUnstake = useCallback(
    (amount) => {
      regularStaking.unstake({
        provider: web3Provider,
        userWalletAddress: userWalletAddress || '',
        amount: serialize(amount, STAKE_TOKEN.decimals),
      });
    },
    [userWalletAddress, web3Provider],
  );
  const handleCollectReward = useCallback(() => {
    regularStaking.collectReward({
      provider: web3Provider,
      userWalletAddress: userWalletAddress || '',
    });
  }, [userWalletAddress, web3Provider]);

  const stakeTokenUserBalance = useShallowSelector(
    stakingSelectors.selectBalance(STAKE_TOKEN.address),
  );
  // TODO: take stakeAmount from store/stakingSelectors/regular
  const stakeAmount = '5000000000000000000';

  const fetchUserDataRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.SET_REGULAR_USER_DATA),
  );
  const stakeRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.REGULAR_STAKE),
  );
  const unstakeRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.REGULAR_UNSTAKE),
  );
  const collectRewardRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.REGULAR_COLLECT_REWARD),
  );

  useEffect(() => {
    if (approveStatus !== RequestStatus.SUCCESS) return;
    handleCheckAllowance();
  }, [approveStatus, handleCheckAllowance]);

  const refetchData = useCallback(() => {
    regularStaking.fetchPublicData({});
    if (!userWalletAddress) return;
    regularStaking.fetchUserData({
      provider: web3Provider,
      userWalletAddress,
    });
  }, [userWalletAddress, web3Provider]);

  useEffect(() => {
    if (stakeRequestStatus !== RequestStatus.SUCCESS) return;
    refetchData();
  }, [refetchData, stakeRequestStatus]);
  useEffect(() => {
    if (unstakeRequestStatus !== RequestStatus.SUCCESS) return;
    refetchData();
  }, [refetchData, unstakeRequestStatus]);
  useEffect(() => {
    if (collectRewardRequestStatus !== RequestStatus.SUCCESS) return;
    refetchData();
  }, [refetchData, collectRewardRequestStatus]);

  const userData = useMemo(
    () => ({
      fetchStatus: fetchUserDataRequestStatus,
      balance: deserialize(stakeTokenUserBalance, STAKE_TOKEN.decimals),
      stakeAmount: deserialize(stakeAmount, STAKE_TOKEN.decimals),
    }),
    [fetchUserDataRequestStatus, stakeTokenUserBalance],
  );

  const ret = {
    handleStake,
    handleUnstake,
    handleCollectReward,
    userData,

    stakeTokenAllowance: {
      isAllowanceLoading,
      allowance: stakeAllowance,
      handleCheckAllowance,
      handleApprove,
      approveStatus,
    },

    stakeRequestStatus,
    unstakeRequestStatus,
    collectRewardRequestStatus,
  };
  return ret;
};
