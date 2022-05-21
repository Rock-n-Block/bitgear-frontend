import { FC } from 'react';
import { useSelector } from 'react-redux';
import { noop } from 'lodash';

import ethToken from '../../data/ethToken';
import gearToken from '../../data/gearToken';
import { userSelectors } from '../../redux/selectors';

import {
  Banner,
  NoConnectWalletPlaceholder,
  Reward,
  SectionHead,
  Stake,
  TooltipApr,
  TooltipApy,
} from './components';

import styles from './PageStake.module.scss';

export const PageStake: FC = () => {
  const { address: userWalletAddress } = useSelector(userSelectors.getUser);
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
            noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            onStakeClick={noop}
            onUnstakeClick={noop}
            stakeToken={gearToken.symbol}
            stakeAmount={0}
            tokenBalance={25}
          />
          <Reward
            noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            stakeToken={gearToken.symbol}
            earnToken={gearToken.symbol}
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
            noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            onStakeClick={noop}
            onUnstakeClick={noop}
            stakeToken={gearToken.symbol}
            stakeAmount={0}
            tokenBalance={25}
          />
          <Reward
            noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            stakeToken={gearToken.symbol}
            earnToken={gearToken.symbol}
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
            noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            isCompounder
            onStakeClick={noop}
            onUnstakeClick={noop}
            stakeToken={gearToken.symbol}
            earnToken={gearToken.symbol}
            earnedToDate="0.123456"
            stakeAmount={0}
            tokenBalance={25}
          />
        </div>
      </div>
    </div>
  );
};
