import BigNumber from 'bignumber.js/bignumber';

import { ContractsNames, Web3Provider } from '../../../../types';
import { contractsHelper, serialize } from '../../../../utils';
import * as apiActions from '../../../actions/ui';
import { stakingActionTypes } from '../../../actionTypes';
import { userSelectors } from '../../../selectors';
import store from '../../../store';

type Unstake = Web3Provider & {
  userWalletAddress: string;
  amount: string;
  stakedAmount: string;
  pricePerShare: string;
};

export const unstake = async ({
  provider,
  userWalletAddress,
  amount,
  stakedAmount,
  pricePerShare,
}: Unstake): Promise<void> => {
  const type = stakingActionTypes.COMPOUNDER_UNSTAKE;
  try {
    store.dispatch(apiActions.request(type));

    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const { address: tokenVaultAddress } = contractsHelper.getContractData(
      ContractsNames.tokenVault,
      network,
    );
    const contract = contractsHelper.getTokenVaultContract(provider, tokenVaultAddress);

    // trigger withdrawAll function if count of shares to unstake is not INTEGER
    const userStakedShares = serialize(new BigNumber(stakedAmount).dividedBy(pricePerShare), 18);
    const unstakeAmountShares = serialize(new BigNumber(amount).dividedBy(pricePerShare), 18);
    const minNonDividedShareAmount = 1;
    const isWithdrawingAll = new BigNumber(userStakedShares)
      .minus(unstakeAmountShares)
      .isLessThan(minNonDividedShareAmount);
    if (isWithdrawingAll) {
      await contract.methods.withdrawAll().send({
        from: userWalletAddress,
      });
    } else {
      await contract.methods
        .withdrawShares(new BigNumber(unstakeAmountShares).toFixed(0, BigNumber.ROUND_UP))
        .send({
          from: userWalletAddress,
        });
    }

    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/Compounder/unstake', err);
    store.dispatch(apiActions.error(type, err));
  }
};
