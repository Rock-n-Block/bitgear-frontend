import { FC } from 'react';
import { noop } from 'lodash';

import { Banner, Reward, Stake, TooltipApr, TooltipApy } from './components';

import styles from './styles.module.scss';

export const PageStake: FC = () => {
  return (
    <div className={styles.container}>
      <Banner apy={160.41} />
      <div>
        APR
        <TooltipApr tokenSymbol1="GEAR" tokenSymbol2="ETH" tokenApr1="21,92" tokenApr2="46,01" />
        Stake container
        <Stake
          onStakeClick={noop}
          onUnstakeClick={noop}
          tokenName="GEAR"
          stakeAmount={0}
          tokenBalance={25}
        />
      </div>

      <div>
        GEAR Compounder APY
        <TooltipApy
          token1={{
            symbol: 'GEAR',
            apr: '21,60',
          }}
          token2={{
            symbol: 'WETH',
            apr: '40,79',
            apy: '50,37',
          }}
          dailyEstimatedCompounds={446}
        />
      </div>

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
