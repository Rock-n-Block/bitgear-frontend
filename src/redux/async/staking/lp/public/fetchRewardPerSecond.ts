import BigNumber from 'bignumber.js/bignumber';

import config from '../../../../../config';
import { ContractsNames, Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { stakingActions } from '../../../../actions';
import { userSelectors } from '../../../../selectors';
import store from '../../../../store';

type FetchRewardPerSecond = Web3Provider;

export const fetchRewardPerSecond = async ({ provider }: FetchRewardPerSecond) => {
  try {
    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const coinStakingAddress = contractsHelper.getContractData(
      ContractsNames.coinStaking,
      network,
    ).address;
    const contract = contractsHelper.getCoinStakingContract(provider, coinStakingAddress);
    const [rewardPerSecond, { allocPoint }, totalAllocPoint] = await Promise.all([
      contract.methods.rewardPerSecond().call(),
      contract.methods.poolInfo(config.staking.lpPid).call(),
      contract.methods.totalAllocPoint().call(),
    ]);

    store.dispatch(
      stakingActions.setLpPublicData({
        rewardPerSecond: new BigNumber(rewardPerSecond)
          .multipliedBy(allocPoint)
          .dividedBy(totalAllocPoint)
          .toFixed(),
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/LP/fetchRewardPerSecond', err);
  }
};
