import { Web3Provider } from '../../../types';
import { contractsHelper } from '../../../utils';

type TFetchApprove = Web3Provider & {
  userWalletAddress: string;
  tokenAddress: string;
  spenderAddress: string;
  amount: string;
};

export const fetchApprove = async ({
  provider,
  userWalletAddress,
  tokenAddress,
  spenderAddress,
  amount,
}: TFetchApprove) => {
  try {
    const contract = contractsHelper.getErc20Contract(provider, tokenAddress);
    const tx = await contract.methods.approve(spenderAddress, amount).send({
      from: userWalletAddress,
    });
    return tx.status;
  } catch (err) {
    console.log('Redux/erc20/fetchApprove', err);
    return false;
  }
};
