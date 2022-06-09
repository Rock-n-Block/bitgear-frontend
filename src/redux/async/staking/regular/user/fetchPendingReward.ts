import config from '../../../../../config';
import { ContractsNames, Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { stakingActions } from '../../../../actions';
import { userSelectors } from '../../../../selectors';
import store from '../../../../store';

type FetchPendingReward = Web3Provider & {
  userWalletAddress: string;
};

export const fetchPendingReward = async ({ provider, userWalletAddress }: FetchPendingReward) => {
  try {
    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const coinStakingAddress = contractsHelper.getContractData(
      ContractsNames.coinStaking,
      network,
    ).address;
    const contract = contractsHelper.getCoinStakingContract(provider, coinStakingAddress);
    const pendingReward = await contract.methods
      .pendingReward(config.staking.regularPid, userWalletAddress)
      .call();

    store.dispatch(
      stakingActions.setRegularUserData({
        pendingReward,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/Regular/fetchPendingReward', err);
  }
};
