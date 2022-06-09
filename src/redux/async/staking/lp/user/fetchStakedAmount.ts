import config from '../../../../../config';
import { ContractsNames, Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { stakingActions } from '../../../../actions';
import { userSelectors } from '../../../../selectors';
import store from '../../../../store';

type FetchStakedAmount = Web3Provider & {
  userWalletAddress: string;
};

export const fetchStakedAmount = async ({ provider, userWalletAddress }: FetchStakedAmount) => {
  try {
    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const coinStakingAddress = contractsHelper.getContractData(
      ContractsNames.coinStaking,
      network,
    ).address;
    const contract = contractsHelper.getCoinStakingContract(provider, coinStakingAddress);
    const { amount: stakedAmount } = await contract.methods
      .userInfo(config.staking.lpPid, userWalletAddress)
      .call();

    store.dispatch(
      stakingActions.setLpUserData({
        stakedAmount,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/LP/fetchStakedAmount', err);
  }
};
