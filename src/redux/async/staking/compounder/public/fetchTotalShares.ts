import { ContractsNames, Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { stakingActions } from '../../../../actions';
import { userSelectors } from '../../../../selectors';
import store from '../../../../store';

type FetchTotalShares = Web3Provider;

export const fetchTotalShares = async ({ provider }: FetchTotalShares) => {
  try {
    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const tokenVaultAddress = contractsHelper.getContractData(
      ContractsNames.tokenVault,
      network,
    ).address;
    const contract = contractsHelper.getTokenVaultContract(provider, tokenVaultAddress);
    const totalShares = await contract.methods.totalShares().call();

    store.dispatch(
      stakingActions.setCompounderPublicData({
        totalShares,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/Compounder/fetchTotalShares', err);
  }
};
