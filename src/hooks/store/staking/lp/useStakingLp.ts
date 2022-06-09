import { useCallback, useEffect, useMemo } from 'react';

import gearEthLPToken from '../../../../data/gearEthLPToken';
import { stakingActionTypes } from '../../../../redux/actionTypes';
import { lpStaking } from '../../../../redux/async';
import {
  stakingLpSelectors,
  stakingSelectors,
  uiSelectors,
  userSelectors,
} from '../../../../redux/selectors';
import { ContractsNames, RequestStatus } from '../../../../types';
import { contractsHelper, deserialize, serialize } from '../../../../utils';
import { useShallowSelector } from '../../../useShallowSelector';
import { useWeb3Provider } from '../../../useWeb3Provider';
import { useAllowance, useApprove } from '../../erc20';

const STAKE_TOKEN = gearEthLPToken;

export const useStakingLp = () => {
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
    (amount: string) => {
      lpStaking.stake({
        provider: web3Provider,
        userWalletAddress: userWalletAddress || '',
        amount: serialize(amount, STAKE_TOKEN.decimals),
      });
    },
    [userWalletAddress, web3Provider],
  );
  const handleUnstake = useCallback(
    (amount: string) => {
      lpStaking.unstake({
        provider: web3Provider,
        userWalletAddress: userWalletAddress || '',
        amount: serialize(amount, STAKE_TOKEN.decimals),
      });
    },
    [userWalletAddress, web3Provider],
  );
  const handleCollectReward = useCallback(() => {
    lpStaking.collectReward({
      provider: web3Provider,
      userWalletAddress: userWalletAddress || '',
    });
  }, [userWalletAddress, web3Provider]);

  const stakeTokenUserBalance = useShallowSelector(
    stakingSelectors.selectBalance(STAKE_TOKEN.address),
  );
  const {
    user: { stakedAmount, pendingReward, earned },
    public: { lastRewardTime, totalStaked },
  } = useShallowSelector(stakingSelectors.selectLpStaking);
  const apr = useShallowSelector(stakingLpSelectors.selectLpStakingApr);

  const fetchUserDataRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.SET_LP_USER_DATA),
  );
  const stakeRequestStatus = useShallowSelector(uiSelectors.getProp(stakingActionTypes.LP_STAKE));
  const unstakeRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.LP_UNSTAKE),
  );
  const collectRewardRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.LP_COLLECT_REWARD),
  );
  const publicDataRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.SET_LP_PUBLIC_DATA),
  );

  useEffect(() => {
    if (approveStatus !== RequestStatus.SUCCESS) return;
    handleCheckAllowance();
  }, [approveStatus, handleCheckAllowance]);

  const refetchData = useCallback(() => {
    lpStaking.fetchPublicData({ provider: web3Provider });
    if (!userWalletAddress) return;
    lpStaking.fetchUserData({
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
      stakeAmount: deserialize(stakedAmount, STAKE_TOKEN.decimals),
      pendingReward: deserialize(pendingReward, STAKE_TOKEN.decimals),
      earned: deserialize(earned, STAKE_TOKEN.decimals),
    }),
    [earned, fetchUserDataRequestStatus, pendingReward, stakeTokenUserBalance, stakedAmount],
  );

  return {
    handleStake,
    handleUnstake,
    handleCollectReward,
    userData,
    totalStaked: deserialize(totalStaked, STAKE_TOKEN.decimals),
    lastRewardTime: new Date(+lastRewardTime * 1000).toLocaleString(),
    apr,

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

    publicDataRequestStatus,
  };
};
