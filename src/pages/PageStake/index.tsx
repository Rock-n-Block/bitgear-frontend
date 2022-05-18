import { FC } from 'react';
import { noop } from 'lodash';

import ethToken from '../../data/ethToken';
import gearToken from '../../data/gearToken';

import { Banner, Reward, SectionHead, Stake, TooltipApr, TooltipApy } from './components';

import styles from './PageStake.module.scss';

export const PageStake: FC = () => {
  return (
    <div className={styles.container}>
      <Banner apy={160.41} />
      <div className={styles.section}>
        <SectionHead
          title="LP Token Staking"
          stakeToken={gearToken.symbol}
          earnToken={ethToken.symbol}
          totalStaked={{
            token: '164,869,690',
            usd: '265,876,000',
          }}
          // eslint-disable-next-line prettier/prettier
          performance={(
            <>
              166,01% APR
              <div className={styles.infoIcon}>
                <TooltipApr
                  tokenSymbol1={gearToken.symbol}
                  tokenSymbol2="ETH"
                  tokenApr1="21,92"
                  tokenApr2="46,01"
                />
              </div>
            </>
            // eslint-disable-next-line prettier/prettier
          )}
        />
        <div className={styles.sectionBody}>
          <Stake
            onStakeClick={noop}
            onUnstakeClick={noop}
            tokenName={gearToken.symbol}
            stakeAmount={0}
            tokenBalance={25}
          />
          <Reward
            tokenName={gearToken.symbol}
            stakeAmount={0}
            ethReward={75}
            lastCollectedTimestamp={1652703791}
            collectedToDate={40}
            earnedToDate={30}
            onCollectRewardClick={noop}
          />
        </div>
      </div>

      <div className={styles.section}>
        <SectionHead
          title={`${gearToken.symbol} Staking`}
          stakeToken={gearToken.symbol}
          earnToken={ethToken.symbol}
          totalStaked={{
            token: '164,869,690',
            usd: '265,876,000',
          }}
          // eslint-disable-next-line prettier/prettier
          performance={(
            <>
              166,01% APR
              <div className={styles.infoIcon}>
                <TooltipApr
                  tokenSymbol1={gearToken.symbol}
                  tokenSymbol2="ETH"
                  tokenApr1="21,92"
                  tokenApr2="46,01"
                />
              </div>
            </>
            // eslint-disable-next-line prettier/prettier
          )}
        />
        <div className={styles.sectionBody}>
          <Stake
            onStakeClick={noop}
            onUnstakeClick={noop}
            tokenName={gearToken.symbol}
            stakeAmount={0}
            tokenBalance={25}
          />
          <Reward
            tokenName={gearToken.symbol}
            stakeAmount={0}
            ethReward={75}
            lastCollectedTimestamp={1652703791}
            collectedToDate={40}
            earnedToDate={30}
            onCollectRewardClick={noop}
          />
        </div>
      </div>

      <div className={styles.section}>
        <SectionHead
          title={`${gearToken.symbol} Compounder`}
          isCompounder
          stakeToken={gearToken.symbol}
          earnToken={gearToken.symbol}
          totalStaked={{
            token: '164,869,690',
            usd: '265,876,000',
          }}
          // eslint-disable-next-line prettier/prettier
          performance={(
            <>
              166,01% APY
              <div className={styles.infoIcon}>
                <TooltipApy
                  token1={{
                    symbol: gearToken.symbol,
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
            </>
            // eslint-disable-next-line prettier/prettier
          )}
        />
        <div className={styles.sectionBody}>
          <Stake
            onStakeClick={noop}
            onUnstakeClick={noop}
            tokenName={gearToken.symbol}
            stakeAmount={0}
            tokenBalance={25}
          />
          <Reward
            tokenName={gearToken.symbol}
            stakeAmount={0}
            ethReward={75}
            lastCollectedTimestamp={1652703791}
            collectedToDate={40}
            earnedToDate={30}
            onCollectRewardClick={noop}
          />
        </div>
      </div>
    </div>
  );
};
