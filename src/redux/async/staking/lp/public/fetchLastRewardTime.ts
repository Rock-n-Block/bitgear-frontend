import config from '../../../../../config';
import { ContractsNames, Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { stakingActions } from '../../../../actions';
import { userSelectors } from '../../../../selectors';
import store from '../../../../store';

type FetchLastRewardTime = Web3Provider;

export const fetchLastRewardTime = async ({ provider }: FetchLastRewardTime) => {
  try {
    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const coinStakingAddress = contractsHelper.getContractData(
      ContractsNames.coinStaking,
      network,
    ).address;
    const contract = contractsHelper.getCoinStakingContract(provider, coinStakingAddress);
    const poolInfo = await contract.methods.poolInfo(config.staking.lpPid).call();

    store.dispatch(
      stakingActions.setLpPublicData({
        lastRewardTime: poolInfo.lastRewardTime,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/LP/fetchLastRewardTime', err);
  }
};
