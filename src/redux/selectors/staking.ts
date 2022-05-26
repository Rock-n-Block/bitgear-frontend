import BigNumber from 'bignumber.js/bignumber';

import gearEthLPToken from '../../data/gearEthLPToken';
import gearToken from '../../data/gearToken';
import { StakingState, State } from '../../types';
import { deserialize } from '../../utils/bigNumberSerializers';

import { tokensSelectors } from './tokens';

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

/**
 * @see https://discord.com/channels/804639233033109545/824936734461657099/978260849561055242
 */
const selectRegularStakingApr = (state: State) => {
  const regularStaking = selectRegularStaking(state);
  const { rewardPerSecond, totalStaked } = regularStaking.public;
  const YEAR_IN_SECONDS = 3153600;
  const apr = new BigNumber(rewardPerSecond)
    .multipliedBy(YEAR_IN_SECONDS)
    .dividedBy(totalStaked)
    .multipliedBy(100)
    .toFixed();
  return apr;
};

/**
 * @see https://discord.com/channels/804639233033109545/824936734461657099/978260849561055242
 */
const selectLpStakingApr = (state: State) => {
  const lpStaking = selectLpStaking(state);
  const { rewardPerSecond, totalStaked } = lpStaking.public;
  // CAUTION: hardcode
  const stakeTokenUsdPrice = tokensSelectors.selectUsdPrice(gearToken.address)(state);
  const earnTokenUsdPrice = tokensSelectors.selectUsdPrice(gearEthLPToken.address)(state);
  const rewardPerSecondInUsd = new BigNumber(rewardPerSecond).multipliedBy(stakeTokenUsdPrice);
  const totalStakedInUsd = new BigNumber(totalStaked).multipliedBy(earnTokenUsdPrice);
  const YEAR_IN_SECONDS = 3153600;
  const apr = new BigNumber(rewardPerSecondInUsd)
    .multipliedBy(YEAR_IN_SECONDS)
    .dividedBy(totalStakedInUsd)
    .multipliedBy(100)
    .toFixed();
  return apr;
};

export const stakingLpSelectors = {
  selectLpStakingApr,
};

export const stakingRegularSelectors = {
  selectRegularStakingApr,
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

  /**
   * @see https://discord.com/channels/804639233033109545/824936734461657099/978260849561055242
   */
  selectApy(state: State) {
    // APY = (1 + r/n)ⁿ  − 1
    // r = apr
    // n = (example: 365 means - every day; 3153600 means - every second)
    const regularStakingApr = selectRegularStakingApr(state);
    const compoundingPeriodsInYear = 365;

    return new BigNumber(1)
      .plus(new BigNumber(regularStakingApr).dividedBy(compoundingPeriodsInYear))
      .pow(compoundingPeriodsInYear)
      .minus(1)
      .toFixed(10);
  },
};
