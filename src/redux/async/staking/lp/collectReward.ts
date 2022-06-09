import config from '../../../../config';
import { ContractsNames, Web3Provider } from '../../../../types';
import { contractsHelper } from '../../../../utils';
import * as apiActions from '../../../actions/ui';
import { stakingActionTypes } from '../../../actionTypes';
import { userSelectors } from '../../../selectors';
import store from '../../../store';

type CollectReward = Web3Provider & {
  userWalletAddress: string;
};

export const collectReward = async ({
  provider,
  userWalletAddress,
}: CollectReward): Promise<void> => {
  const type = stakingActionTypes.LP_COLLECT_REWARD;
  try {
    store.dispatch(apiActions.request(type));

    const state = store.getState();
    const { network } = userSelectors.getUser(state);
    const { address: coinStakingAddress } = contractsHelper.getContractData(
      ContractsNames.coinStaking,
      network,
    );

    const contract = contractsHelper.getCoinStakingContract(provider, coinStakingAddress);
    /**
     * @see https://github.com/Rock-n-Block/bitgear-contracts-staking-compound/blob/d4cb3fbeee8bbe6307dfe6af4fa564afefa53bdb/contracts/CoinStaking.sol#L260
     */
    await contract.methods.withdraw(config.staking.lpPid, 0).send({
      from: userWalletAddress,
    });

    store.dispatch(apiActions.success(type));
  } catch (err) {
    console.log('Redux/Staking/LP/collectReward', err);
    store.dispatch(apiActions.error(type, err));
  }
};
