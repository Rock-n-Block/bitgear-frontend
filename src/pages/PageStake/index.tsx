import React from 'react';
import { noop } from 'lodash';

import { Banner, Reward, Stake } from './components';

import styles from './styles.module.scss';

export const PageStake: React.FC = () => {
  return (
    <div className={styles.container}>
      <Banner apy={160.41} />
      <Stake
        onStakeClick={noop}
        onUnstakeClick={noop}
        tokenName="GEAR"
        stakeAmount={0}
        tokenBalance={25}
      />
      <Reward
        tokenName="GEAR"
        stakeAmount={0}
        ethReward={75}
        lastCollectedTimestamp={1652703791}
        collectedToDate={40}
        earnedToDate={30}
        onCollectRewardClick={noop}
      />
    </div>
  );
};
