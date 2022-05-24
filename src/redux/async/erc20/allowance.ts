import { Web3Provider } from '../../../types';
import { contractsHelper } from '../../../utils';
import { userActions } from '../../actions';
import store from '../../store';

type TGetTokenAllowance = Web3Provider & {
  ownerAddress: string;
  tokenAddress: string;
  spenderAddress: string;
};

export const fetchAllowance = async ({
  provider,
  ownerAddress,
  tokenAddress,
  spenderAddress,
}: TGetTokenAllowance) => {
  try {
    const contract = contractsHelper.getErc20Contract(provider, tokenAddress);
    const tokenAllowance = await contract.methods.allowance(ownerAddress, spenderAddress).call();

    store.dispatch(
      userActions.setAllowance({
        [tokenAddress]: {
          [spenderAddress]: tokenAllowance,
        },
      }),
    );
  } catch (err) {
    console.log('Redux/erc20/fetchAllowance', err);
  }
};
