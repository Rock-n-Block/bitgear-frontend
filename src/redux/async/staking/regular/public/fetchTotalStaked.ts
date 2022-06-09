import config from '../../../../../config';
import { ContractsNames, Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { stakingActions } from '../../../../actions';
import { userSelectors } from '../../../../selectors';
import store from '../../../../store';

type FetchTotalStaked = Web3Provider;

export const fetchTotalStaked = async ({ provider }: FetchTotalStaked) => {
  try {
    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const coinStakingAddress = contractsHelper.getContractData(
      ContractsNames.coinStaking,
      network,
    ).address;
    const contract = contractsHelper.getCoinStakingContract(provider, coinStakingAddress);
    const poolInfo = await contract.methods.poolInfo(config.staking.regularPid).call();

    store.dispatch(
      stakingActions.setRegularPublicData({
        totalStaked: poolInfo.totalStaked,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/Regular/fetchTotalStaked', err);
  }
};
