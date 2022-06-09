// TODO: StakingState
export type StakingState = {
  liquidityPools: {
    public: {}; // publicData
    user: {}; // userData
  };
  compounder: {
    public: {}; // publicData
    user: {}; // userData
  };
  regular: {
    public: {
      totalStaked: string;
      lastRewardTime: string;
    }; // publicData
    user: {
      stakedAmount: string;
      pendingReward: string;
    }; // userData
  };
  balances: Record<string, string>;
};
