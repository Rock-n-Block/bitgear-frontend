export type StakingState = {
  liquidityPools: {
    public: {
      totalStaked: string;
      lastRewardTime: string;
    };
    user: {
      stakedAmount: string;
      pendingReward: string;
      earned: string;
    };
  };
  compounder: {
    public: {}; // publicData
    user: {}; // userData
  };
  regular: {
    public: {
      totalStaked: string;
      lastRewardTime: string;
    };
    user: {
      stakedAmount: string;
      pendingReward: string;
      earned: string;
    };
  };
  balances: Record<string, string>;
};
