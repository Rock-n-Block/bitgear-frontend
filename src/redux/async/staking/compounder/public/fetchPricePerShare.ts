import { ContractsNames, Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { stakingActions } from '../../../../actions';
import { userSelectors } from '../../../../selectors';
import store from '../../../../store';

type FetchPricePerShare = Web3Provider;

export const fetchPricePerShare = async ({ provider }: FetchPricePerShare) => {
  try {
    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const tokenVaultAddress = contractsHelper.getContractData(
      ContractsNames.tokenVault,
      network,
    ).address;
    const contract = contractsHelper.getTokenVaultContract(provider, tokenVaultAddress);
    const pricePerShare = await contract.methods.getPricePerFullShare().call();

    store.dispatch(
      stakingActions.setCompounderPublicData({
        pricePerShare,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/Compounder/fetchPricePerShare', err);
  }
};
