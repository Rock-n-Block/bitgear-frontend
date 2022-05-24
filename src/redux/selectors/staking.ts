import { StakingState, State } from '../../types';

const selectStaking = (state: State): StakingState => state.staking;
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
};
