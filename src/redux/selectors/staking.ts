import BigNumber from 'bignumber.js/bignumber';

import { StakingState, State } from '../../types';
import { deserialize } from '../../utils/bigNumberSerializers';

const selectStaking = (state: State): StakingState => state.staking;
const selectRegularStaking = (state: State) => selectStaking(state).regular;
const selectLpStaking = (state: State) => selectStaking(state).liquidityPools;
const selectCompounderStaking = (state: State) => selectStaking(state).compounder;

const selectBalances = (state: State) => selectStaking(state).balances;
const selectBalance =
  (tokenAddress: string) =>
  (state: State): string => {
    return selectBalances(state)[tokenAddress.toLowerCase()] || '';
  };

export const stakingSelectors = {
  selectStaking,

  selectBalances,
  selectBalance,

  selectRegularStaking,
  selectLpStaking,
  selectCompounderStaking,
};

export const stakingCompounderSelectors = {
  selectTotalStaked(state: State) {
    const { pricePerShare, totalShares } = selectCompounderStaking(state).public;
    const totalStaked = deserialize(new BigNumber(totalShares).multipliedBy(pricePerShare), 18);
    return totalStaked;
  },
  selectStakedAmount(state: State) {
    const compounderStaking = selectCompounderStaking(state);
    const { pricePerShare } = compounderStaking.public;
    const { stakedShares } = compounderStaking.user;
    return deserialize(new BigNumber(stakedShares).multipliedBy(pricePerShare), 18);
  },
};
