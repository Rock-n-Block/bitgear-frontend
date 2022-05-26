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
    const tokenVaultAddress = contractsHelper.getContractData(
      ContractsNames.tokenVault,
      network,
    ).address;
    const contract = contractsHelper.getTokenVaultContract(provider, tokenVaultAddress);
    const earnedToDate = await contract.methods.getTotalStakeOf(userWalletAddress).call();

    store.dispatch(
      stakingActions.setCompounderUserData({
        earned: earnedToDate,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/Compounder/fetchEarned', err);
  }
};
