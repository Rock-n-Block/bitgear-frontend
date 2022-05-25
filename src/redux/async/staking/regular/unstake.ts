import config from '../../../../config';
import { ContractsNames, Web3Provider } from '../../../../types';
import { contractsHelper } from '../../../../utils';
import * as apiActions from '../../../actions/ui';
import { stakingActionTypes } from '../../../actionTypes';
import { userSelectors } from '../../../selectors';
import store from '../../../store';

type Unstake = Web3Provider & {
  userWalletAddress: string;
  amount: string;
};

export const unstake = async ({ provider, userWalletAddress, amount }: Unstake): Promise<void> => {
  const type = stakingActionTypes.REGULAR_UNSTAKE;
  try {
    store.dispatch(apiActions.request(type));

    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const { address: coinStakingAddress } = contractsHelper.getContractData(
      ContractsNames.coinStaking,
      network,
    );
    const contract = contractsHelper.getCoinStakingContract(provider, coinStakingAddress);
    await contract.methods.withdraw(config.staking.regularPid, amount).send({
      from: userWalletAddress,
    });

    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Regular/unstake', err);
    store.dispatch(apiActions.error(type, err));
  }
};
