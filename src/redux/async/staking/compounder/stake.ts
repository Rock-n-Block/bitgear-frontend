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
  const type = stakingActionTypes.COMPOUNDER_STAKE;
  try {
    store.dispatch(apiActions.request(type));

    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const { address: tokenVaultAddress } = contractsHelper.getContractData(
      ContractsNames.tokenVault,
      network,
    );
    const contract = contractsHelper.getTokenVaultContract(provider, tokenVaultAddress);
    await contract.methods.deposit(amount).send({
      from: userWalletAddress,
    });

    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Compounder/stake', err);
    store.dispatch(apiActions.error(type, err));
  }
};
