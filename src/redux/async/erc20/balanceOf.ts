import { Web3Provider } from '../../../types';
import { contractsHelper } from '../../../utils';
import { stakingActions } from '../../actions';
import store from '../../store';

type FetchBalance = Web3Provider & {
  ownerAddress: string;
  tokenAddress: string;
};

export const fetchBalance = async ({ provider, ownerAddress, tokenAddress }: FetchBalance) => {
  try {
    const contract = contractsHelper.getErc20Contract(provider, tokenAddress);
    const balance = await contract.methods.balanceOf(ownerAddress).call();

    store.dispatch(
      stakingActions.setBalance({
        [tokenAddress]: balance,
      }),
    );
  } catch (err) {
    console.log('Redux/erc20/fetchBalance', err);
  }
};
