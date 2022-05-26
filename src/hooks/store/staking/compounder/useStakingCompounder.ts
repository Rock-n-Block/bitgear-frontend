import { useCallback, useEffect, useMemo } from 'react';

import gearToken from '../../../../data/gearToken';
import { stakingActionTypes } from '../../../../redux/actionTypes';
import { compounderStaking } from '../../../../redux/async';
import {
  stakingCompounderSelectors,
  stakingSelectors,
  uiSelectors,
  userSelectors,
} from '../../../../redux/selectors';
import { ContractsNames, RequestStatus } from '../../../../types';
import { contractsHelper, deserialize, serialize } from '../../../../utils';
import { useShallowSelector } from '../../../useShallowSelector';
import { useWeb3Provider } from '../../../useWeb3Provider';
import { useAllowance, useApprove } from '../../erc20';

const STAKE_TOKEN = gearToken;

export const useStakingCompounder = () => {
  const { web3Provider } = useWeb3Provider();
  const { address: userWalletAddress, network } = useShallowSelector(userSelectors.getUser);
  const tokenVaultAddress = useMemo(
    () => contractsHelper.getContractData(ContractsNames.tokenVault, network).address,
    [network],
  );

  const {
    public: { pricePerShare },
    user: { earned },
  } = useShallowSelector(stakingSelectors.selectCompounderStaking);
  const stakeAllowance = useShallowSelector(
    userSelectors.selectAllowance(STAKE_TOKEN.address, tokenVaultAddress),
  );
  const stakeTokenUserBalance = useShallowSelector(
    stakingSelectors.selectBalance(STAKE_TOKEN.address),
  );
  const totalStaked = useShallowSelector(stakingCompounderSelectors.selectTotalStaked);
  const stakedAmount = useShallowSelector(stakingCompounderSelectors.selectStakedAmount);
  const apy = useShallowSelector(stakingCompounderSelectors.selectApy);

  const { checkAllowance, isLoading: isAllowanceLoading } = useAllowance();
  const handleCheckAllowance = useCallback(() => {
    checkAllowance(STAKE_TOKEN.address, tokenVaultAddress);
  }, [checkAllowance, tokenVaultAddress]);

  const { approve, fetchStatus: approveStatus } = useApprove();
  const handleApprove = useCallback(
    (amount: string) => {
      approve(STAKE_TOKEN.address, tokenVaultAddress, serialize(amount, STAKE_TOKEN.decimals));
    },
    [approve, tokenVaultAddress],
  );

  const handleStake = useCallback(
    (amount) => {
      compounderStaking.stake({
        provider: web3Provider,
        userWalletAddress: userWalletAddress || '',
        amount: serialize(amount, STAKE_TOKEN.decimals),
      });
    },
    [userWalletAddress, web3Provider],
  );
  const handleUnstake = useCallback(
    (amount) => {
      compounderStaking.unstake({
        provider: web3Provider,
        userWalletAddress: userWalletAddress || '',
        amount: serialize(amount, STAKE_TOKEN.decimals),
        stakedAmount,
        pricePerShare,
      });
    },
    [pricePerShare, stakedAmount, userWalletAddress, web3Provider],
  );

  const fetchUserDataRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.SET_COMPOUNDER_USER_DATA),
  );
  const stakeRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.COMPOUNDER_STAKE),
  );
  const unstakeRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.COMPOUNDER_UNSTAKE),
  );
  const publicDataRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.SET_COMPOUNDER_PUBLIC_DATA),
  );

  useEffect(() => {
    if (approveStatus !== RequestStatus.SUCCESS) return;
    handleCheckAllowance();
  }, [approveStatus, handleCheckAllowance]);

  const refetchData = useCallback(() => {
    compounderStaking.fetchPublicData({ provider: web3Provider });
    if (!userWalletAddress) return;
    compounderStaking.fetchUserData({
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

  const userData = useMemo(
    () => ({
      fetchStatus: fetchUserDataRequestStatus,
      balance: deserialize(stakeTokenUserBalance, STAKE_TOKEN.decimals),
      stakeAmount: deserialize(stakedAmount, STAKE_TOKEN.decimals),
      earned: deserialize(earned, STAKE_TOKEN.decimals),
    }),
    [earned, fetchUserDataRequestStatus, stakeTokenUserBalance, stakedAmount],
  );

  const ret = {
    handleStake,
    handleUnstake,
    userData,
    totalStaked: deserialize(totalStaked, STAKE_TOKEN.decimals),
    apy,

    stakeTokenAllowance: {
      isAllowanceLoading,
      allowance: stakeAllowance,
      handleCheckAllowance,
      handleApprove,
      approveStatus,
    },

    stakeRequestStatus,
    unstakeRequestStatus,

    publicDataRequestStatus,
  };
  return ret;
};
