import { FC } from 'react';
import { useSelector } from 'react-redux';

import ethToken from '../../data/ethToken';
import gearEthLPToken from '../../data/gearEthLPToken';
import gearToken from '../../data/gearToken';
import {
  usePollCompounder,
  usePollLp,
  usePollRegular,
  useStakingCompounder,
  useStakingLp,
  useStakingRegular,
} from '../../hooks';
import { userSelectors } from '../../redux/selectors';
import { RequestStatus } from '../../types';
import { getDollarAmount } from '../../utils';
import { prettyPrice } from '../../utils/prettifiers';

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

  usePollRegular();
  const stakingRegular = useStakingRegular();

  usePollLp();
  const stakingLp = useStakingLp();

  usePollCompounder();
  const stakingCompounder = useStakingCompounder();

  return (
    <div className={styles.container}>
      <Banner apy={prettyPrice(stakingCompounder.apy)} />
      <div className={styles.section}>
        <SectionHead
          title="LP Token Staking"
          stakeToken={gearEthLPToken.symbol}
          earnToken={ethToken.symbol}
          totalStaked={{
            token: stakingLp.totalStaked,
            usd: getDollarAmount(stakingLp.totalStaked, gearEthLPToken.address),
          }}
          // eslint-disable-next-line prettier/prettier
          performance={(
            <>
              {stakingLp.apr}% APR
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
          isLoading={stakingLp.publicDataRequestStatus === RequestStatus.REQUEST}
        />
        <div className={styles.sectionBody}>
          <Stake
            noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            onStakeClick={stakingLp.handleStake}
            onUnstakeClick={stakingLp.handleUnstake}
            onMaxClick={() => stakingLp.userData.balance}
            stakeToken={gearEthLPToken.symbol}
            stakeTokenAddress={gearEthLPToken.address}
            maxDecimals={gearEthLPToken.decimals}
            stakeTokenAllowance={stakingLp.stakeTokenAllowance}
            stakeAmount={stakingLp.userData.stakeAmount}
            tokenBalance={stakingLp.userData.balance}
            isUserDataLoading={stakingLp.userData.fetchStatus === RequestStatus.REQUEST}
            isPendingTx={
              stakingLp.stakeRequestStatus === RequestStatus.REQUEST ||
              stakingLp.unstakeRequestStatus === RequestStatus.REQUEST
            }
          />
          <Reward
            noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            stakeToken={gearToken.symbol}
            earnToken={gearToken.symbol}
            earnTokenAddress={gearToken.address}
            stakeAmount={stakingLp.userData.pendingReward}
            lastCollectedTimestamp={stakingLp.lastRewardTime}
            earnedToDate={stakingLp.userData.earned}
            onCollectRewardClick={stakingLp.handleCollectReward}
            isUserDataLoading={stakingLp.userData.fetchStatus === RequestStatus.REQUEST}
            isPendingTx={stakingLp.collectRewardRequestStatus === RequestStatus.REQUEST}
          />
        </div>
      </div>

      <div className={styles.section}>
        <SectionHead
          title={`${gearToken.symbol} Staking`}
          stakeToken={gearToken.symbol}
          earnToken={ethToken.symbol}
          totalStaked={{
            token: stakingRegular.totalStaked,
            usd: getDollarAmount(stakingRegular.totalStaked, gearToken.address),
          }}
          // eslint-disable-next-line prettier/prettier
          performance={(
            <>
              {stakingRegular.apr}% APR
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
          isLoading={stakingRegular.publicDataRequestStatus === RequestStatus.REQUEST}
        />
        <div className={styles.sectionBody}>
          <Stake
            noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            onStakeClick={stakingRegular.handleStake}
            onUnstakeClick={stakingRegular.handleUnstake}
            onMaxClick={() => stakingRegular.userData.balance}
            stakeToken={gearToken.symbol}
            stakeTokenAddress={gearToken.address}
            maxDecimals={gearToken.decimals}
            stakeTokenAllowance={stakingRegular.stakeTokenAllowance}
            stakeAmount={stakingRegular.userData.stakeAmount}
            tokenBalance={stakingRegular.userData.balance}
            isUserDataLoading={stakingRegular.userData.fetchStatus === RequestStatus.REQUEST}
            isPendingTx={
              stakingRegular.stakeRequestStatus === RequestStatus.REQUEST ||
              stakingRegular.unstakeRequestStatus === RequestStatus.REQUEST
            }
          />
          <Reward
            noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            stakeToken={gearToken.symbol}
            earnToken={gearToken.symbol}
            earnTokenAddress={gearToken.address}
            stakeAmount={stakingRegular.userData.pendingReward}
            lastCollectedTimestamp={stakingRegular.lastRewardTime}
            earnedToDate={stakingRegular.userData.earned}
            onCollectRewardClick={stakingRegular.handleCollectReward}
            isUserDataLoading={stakingRegular.userData.fetchStatus === RequestStatus.REQUEST}
            isPendingTx={stakingRegular.collectRewardRequestStatus === RequestStatus.REQUEST}
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
            token: stakingCompounder.totalStaked,
            usd: getDollarAmount(stakingCompounder.totalStaked, gearToken.address),
          }}
          // eslint-disable-next-line prettier/prettier
          performance={(
            <>
              {Number.isNaN(stakingCompounder.apy) ? '' : stakingCompounder.apy}% APY
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
          isLoading={stakingRegular.publicDataRequestStatus === RequestStatus.REQUEST}
        />
        <div className={styles.sectionBody}>
          <Stake
            noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            isCompounder
            onStakeClick={stakingCompounder.handleStake}
            onUnstakeClick={stakingCompounder.handleUnstake}
            onMaxClick={() => stakingCompounder.userData.balance}
            stakeToken={gearToken.symbol}
            stakeTokenAddress={gearToken.address}
            maxDecimals={gearToken.decimals}
            stakeTokenAllowance={stakingCompounder.stakeTokenAllowance}
            stakeAmount={stakingCompounder.userData.stakeAmount}
            tokenBalance={stakingCompounder.userData.balance}
            earnTokenAddress={gearToken.address}
            earnedToDate={stakingCompounder.userData.earned}
            isUserDataLoading={stakingCompounder.userData.fetchStatus === RequestStatus.REQUEST}
            isPendingTx={
              stakingCompounder.stakeRequestStatus === RequestStatus.REQUEST ||
              stakingCompounder.unstakeRequestStatus === RequestStatus.REQUEST
            }
          />
        </div>
      </div>
    </div>
  );
};
