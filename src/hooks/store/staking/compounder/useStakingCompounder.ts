import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import BigNumber from 'bignumber.js/bignumber';

import gearToken from '../../../../data/gearToken';
import { modalActions, uiActions } from '../../../../redux/actions';
import { stakingActionTypes } from '../../../../redux/actionTypes';
import { compounderStaking } from '../../../../redux/async';
import {
  stakingCompounderSelectors,
  stakingSelectors,
  uiSelectors,
  userSelectors,
} from '../../../../redux/selectors';
import { ContractsNames, RequestStatus } from '../../../../types';
import { contractsHelper, deserialize, deserializeBN, serialize } from '../../../../utils';
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
    public: { pricePerShare, harvestRewards },
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
  const handleHarvest = useCallback(() => {
    compounderStaking.harvest({
      provider: web3Provider,
      userWalletAddress: userWalletAddress || '',
    });
  }, [userWalletAddress, web3Provider]);

  const fetchUserDataRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.SET_COMPOUNDER_USER_DATA),
  );
  const stakeRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.COMPOUNDER_STAKE),
  );
  const unstakeRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.COMPOUNDER_UNSTAKE),
  );
  const harvestRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.COMPOUNDER_HARVEST),
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

  const dispatch = useDispatch();
  useEffect(() => {
    if (harvestRequestStatus === RequestStatus.SUCCESS) {
      dispatch(modalActions.closeModal());
      dispatch(uiActions.reset(stakingActionTypes.COMPOUNDER_HARVEST));
    }
  }, [dispatch, harvestRequestStatus]);

  const userData = useMemo(
    () => ({
      fetchStatus: fetchUserDataRequestStatus,
      balance: deserialize(stakeTokenUserBalance, STAKE_TOKEN.decimals),
      // need to cut decimals more than 18, due to shares are unlimited with decimals
      stakeAmount: deserializeBN(stakedAmount, STAKE_TOKEN.decimals)
        .decimalPlaces(STAKE_TOKEN.decimals, BigNumber.ROUND_DOWN)
        .toFixed(),
      earned: deserialize(earned, STAKE_TOKEN.decimals),
    }),
    [earned, fetchUserDataRequestStatus, stakeTokenUserBalance, stakedAmount],
  );

  return {
    handleStake,
    handleUnstake,
    handleHarvest,
    userData,
    harvestRewards: deserialize(harvestRewards, STAKE_TOKEN.decimals),
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
    harvestRequestStatus,

    publicDataRequestStatus,
  };
};
