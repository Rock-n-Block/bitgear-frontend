export type StakingState = {
  liquidityPools: {
    public: {
      totalStaked: string;
      lastRewardTime: string;
      rewardPerSecond: string;
    };
    user: {
      stakedAmount: string;
      pendingReward: string;
      earned: string;
    };
  };
  compounder: {
    public: {
      pricePerShare: string;
      totalShares: string;
      harvestRewards: string;
    };
    user: {
      stakedShares: string;
      earned: string;
    };
  };
  regular: {
    public: {
      totalStaked: string;
      lastRewardTime: string;
      rewardPerSecond: string;
    };
    user: {
      stakedAmount: string;
      pendingReward: string;
      earned: string;
    };
  };
  balances: Record<string, string>;
};
