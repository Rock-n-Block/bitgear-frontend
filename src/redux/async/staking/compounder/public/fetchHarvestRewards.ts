import { ContractsNames, Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { stakingActions } from '../../../../actions';
import { userSelectors } from '../../../../selectors';
import store from '../../../../store';

type FetchHarvestRewards = Web3Provider;

export const fetchHarvestRewards = async ({ provider }: FetchHarvestRewards) => {
  try {
    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const tokenVaultAddress = contractsHelper.getContractData(
      ContractsNames.tokenVault,
      network,
    ).address;
    const contract = contractsHelper.getTokenVaultContract(provider, tokenVaultAddress);
    const harvestRewards = await contract.methods.calculateHarvestRewards().call();

    store.dispatch(
      stakingActions.setCompounderPublicData({
        harvestRewards,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/Compounder/fetchHarvestRewards', err);
  }
};
