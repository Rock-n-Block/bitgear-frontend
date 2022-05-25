import gearToken from '../../../../data/gearToken';
import { ContractsNames, Web3Provider } from '../../../../types';
import { contractsHelper } from '../../../../utils';
import { stakingActions } from '../../../actions';
import * as apiActions from '../../../actions/ui';
import { stakingActionTypes } from '../../../actionTypes';
import { userSelectors } from '../../../selectors';
import store from '../../../store';
import { fetchAllowance } from '../../erc20';
import { fetchBalance } from '../../erc20/balanceOf';

export const fetchPublicData = async ({
  type = stakingActionTypes.SET_REGULAR_PUBLIC_DATA,
  payload,
}: Partial<ReturnType<typeof stakingActions.setRegularPublicData>>): Promise<void> => {
  try {
    store.dispatch(apiActions.request(type));
    console.log('Test', payload);
    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Regular', err);
    store.dispatch(apiActions.error(type, err));
  }
};

type FetchUserData = Web3Provider & {
  userWalletAddress: string;
};

export const fetchUserData = async ({
  provider,
  userWalletAddress,
}: FetchUserData): Promise<void> => {
  const type = stakingActionTypes.SET_REGULAR_USER_DATA;
  try {
    store.dispatch(apiActions.request(type));

    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const { address: spenderAddress } = contractsHelper.getContractData(
      ContractsNames.coinStaking,
      network,
    );

    await Promise.all([
      fetchBalance({ provider, ownerAddress: userWalletAddress, tokenAddress: gearToken.address }),
      fetchAllowance({
        provider,
        ownerAddress: userWalletAddress,
        tokenAddress: gearToken.address,
        spenderAddress,
      }),
    ]);

    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Regular', err);
    store.dispatch(apiActions.error(type, err));
  }
};
