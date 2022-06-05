import { ContractsNames, Web3Provider } from '../../../../types';
import { contractsHelper } from '../../../../utils';
import * as apiActions from '../../../actions/ui';
import { stakingActionTypes } from '../../../actionTypes';
import { userSelectors } from '../../../selectors';
import store from '../../../store';

type Harvest = Web3Provider & {
  userWalletAddress: string;
};

export const harvest = async ({ provider, userWalletAddress }: Harvest): Promise<void> => {
  const type = stakingActionTypes.COMPOUNDER_HARVEST;
  try {
    store.dispatch(apiActions.request(type));

    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const { address: tokenVaultAddress } = contractsHelper.getContractData(
      ContractsNames.tokenVault,
      network,
    );
    const contract = contractsHelper.getTokenVaultContract(provider, tokenVaultAddress);
    await contract.methods.harvest().send({
      from: userWalletAddress,
    });

    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Compounder/harvest', err);
    store.dispatch(apiActions.error(type, err));
  }
};
