import config from '../../../../config';
import { ContractsNames, Web3Provider } from '../../../../types';
import { contractsHelper } from '../../../../utils';
import * as apiActions from '../../../actions/ui';
import { stakingActionTypes } from '../../../actionTypes';
import { userSelectors } from '../../../selectors';
import store from '../../../store';

type Stake = Web3Provider & {
  userWalletAddress: string;
  amount: string;
};

export const stake = async ({ provider, userWalletAddress, amount }: Stake): Promise<void> => {
  const type = stakingActionTypes.REGULAR_STAKE;
  try {
    store.dispatch(apiActions.request(type));

    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const { address: coinStakingAddress } = contractsHelper.getContractData(
      ContractsNames.coinStaking,
      network,
    );
    const contract = contractsHelper.getCoinStakingContract(provider, coinStakingAddress);
    await contract.methods.deposit(config.staking.regularPid, amount).send({
      from: userWalletAddress,
    });

    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Regular/stake', err);
    store.dispatch(apiActions.error(type, err));
  }
};
