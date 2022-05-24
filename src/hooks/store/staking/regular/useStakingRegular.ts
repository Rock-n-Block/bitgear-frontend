import { useCallback, useMemo } from 'react';

import gearToken from '../../../../data/gearToken';
import { stakingActionTypes } from '../../../../redux/actionTypes';
import { stakingSelectors, uiSelectors, userSelectors } from '../../../../redux/selectors';
import { ContractsNames } from '../../../../types';
import { contractsHelper, deserialize, serialize } from '../../../../utils';
import { useShallowSelector } from '../../../useShallowSelector';
import { useAllowance, useApprove } from '../../erc20';

const STAKE_TOKEN = gearToken;

export const useStakingRegular = () => {
  const { network } = useShallowSelector(userSelectors.getUser);
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

  const handleStake = useCallback((...args) => {
    console.log('useStakingRegular/handleStake', args);
  }, []);

  const stakeTokenUserBalance = useShallowSelector(
    stakingSelectors.selectBalance(STAKE_TOKEN.address),
  );

  const fetchUserDataRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.SET_REGULAR_USER_DATA),
  );

  const userData = useMemo(
    () => ({
      balance: deserialize(stakeTokenUserBalance, STAKE_TOKEN.decimals),
      fetchStatus: fetchUserDataRequestStatus,
    }),
    [fetchUserDataRequestStatus, stakeTokenUserBalance],
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
