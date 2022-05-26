import { ContractsNames, Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { stakingActions } from '../../../../actions';
import { userSelectors } from '../../../../selectors';
import store from '../../../../store';

type FetchStakedShares = Web3Provider & {
  userWalletAddress: string;
};

export const fetchStakedShares = async ({ provider, userWalletAddress }: FetchStakedShares) => {
  try {
    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const tokenVaultAddress = contractsHelper.getContractData(
      ContractsNames.tokenVault,
      network,
    ).address;
    const contract = contractsHelper.getTokenVaultContract(provider, tokenVaultAddress);
    const { shares } = await contract.methods.userInfo(userWalletAddress).call();

    store.dispatch(
      stakingActions.setCompounderUserData({
        stakedShares: shares,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/Compounder/fetchStakedShares', err);
  }
};
