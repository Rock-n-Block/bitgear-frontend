import config from '../../../../../config';
import { ContractsNames, Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { stakingActions } from '../../../../actions';
import { userSelectors } from '../../../../selectors';
import store from '../../../../store';

type FetchEarned = Web3Provider & {
  userWalletAddress: string;
};

export const fetchEarned = async ({ provider, userWalletAddress }: FetchEarned) => {
  try {
    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const coinStakingAddress = contractsHelper.getContractData(
      ContractsNames.coinStaking,
      network,
    ).address;
    const contract = contractsHelper.getCoinStakingContract(provider, coinStakingAddress);
    const { earned } = await contract.methods
      .userInfo(config.staking.lpPid, userWalletAddress)
      .call();

    store.dispatch(
      stakingActions.setLpUserData({
        earned,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/LP/fetchEarned', err);
  }
};
