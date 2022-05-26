import gearToken from '../../../../data/gearToken';
import { ContractsNames, Web3Provider } from '../../../../types';
import { contractsHelper } from '../../../../utils';
import * as apiActions from '../../../actions/ui';
import { stakingActionTypes } from '../../../actionTypes';
import { userSelectors } from '../../../selectors';
import store from '../../../store';
import { fetchAllowance, fetchBalance } from '../../erc20';
import { fetchUsdPrice } from '../../tokens';

import { fetchLastRewardTime, fetchTotalStaked } from './public';
import { fetchEarned, fetchPendingReward, fetchStakedAmount } from './user';

type FetchPublicData = Web3Provider;

export const fetchPublicData = async ({ provider }: FetchPublicData): Promise<void> => {
  const type = stakingActionTypes.SET_REGULAR_PUBLIC_DATA;
  try {
    store.dispatch(apiActions.request(type));

    await Promise.all([
      fetchTotalStaked({ provider }),
      fetchLastRewardTime({ provider }),
      fetchUsdPrice({ symbol: gearToken.symbol, tokenAddress: gearToken.address }),
    ]);

    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Regular/fetchPublicData', err);
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
      fetchStakedAmount({ provider, userWalletAddress }),
      fetchPendingReward({ provider, userWalletAddress }),
      fetchEarned({ provider, userWalletAddress }),
    ]);

    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Regular/fetchUserData', err);
    store.dispatch(apiActions.error(type, err));
  }
};
