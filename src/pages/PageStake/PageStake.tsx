import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import { modalActions } from '../../redux/actions';
import { userSelectors } from '../../redux/selectors';
import { RequestStatus } from '../../types';
import { addTokenToWallet, getDollarAmount, getFormattedValue, Token } from '../../utils';

import { Welcome } from './components/Welcome';
import {
  Banner,
  ClaimModal,
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

  const dispatch = useDispatch();
  const handleGetFreeTokens = useCallback(() => {
    // this is needed to make sure that user address is set due to Components.Modal is not reactive and will not re-render if prop is changed
    setTimeout(() => {
      stakingCompounder.handleHarvest();
    }, 1000);
  }, [stakingCompounder]);
  const handleGetFreeTokensModal = useCallback(() => {
    dispatch(
      modalActions.toggleModal({
        classes: {
          root: styles.getFreeTokensModal,
          modalContainer: styles.getFreeTokensModalContainer,
          closeBtn: styles.getFreeTokensModalCloseBtn,
        },
        open: true,
        text: (
          <ClaimModal amount={stakingCompounder.harvestRewards} onSubmit={handleGetFreeTokens} />
        ),
      }),
    );
  }, [dispatch, handleGetFreeTokens, stakingCompounder.harvestRewards]);

  const handleAddTokenToWallet = useCallback((token: Token) => {
    addTokenToWallet({
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      image: token.image,
    });
  }, []);

  const isConnectedWallet = !!userWalletAddress;

  if (!isConnectedWallet) return <Welcome />;

  return (
    <div className={styles.container}>
      <Banner
        apy={getFormattedValue(stakingCompounder.apy, true)}
        onGetFreeTokens={handleGetFreeTokensModal}
        onAddToWallet={handleAddTokenToWallet}
      />
      <div className={styles.section}>
        <SectionHead
          title="LP Token Staking"
          stakeToken={gearEthLPToken.symbol}
          earnToken={gearToken.symbol}
          totalStaked={{
            token: stakingLp.totalStaked,
            usd: getDollarAmount(stakingLp.totalStaked, gearEthLPToken.address),
          }}
          // eslint-disable-next-line prettier/prettier
          performance={(
            <>
              {getFormattedValue(stakingLp.apr, true)}% APR
              <div className={styles.infoIcon}>
                <TooltipApr
                  tokenSymbol1={gearToken.symbol}
                  tokenSymbol2={gearToken.symbol}
                  isLpToken
                />
              </div>
            </>
            // eslint-disable-next-line prettier/prettier
          )}
          isLoading={stakingLp.publicDataRequestStatus === RequestStatus.REQUEST}
        />
        <div className={styles.sectionBody}>
          <Stake
            onStakeClick={stakingLp.handleStake}
            onUnstakeClick={stakingLp.handleUnstake}
            onMaxClick={() => stakingLp.userData.balance}
            stakeTokenRequestStatus={stakingLp.stakeRequestStatus}
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
            isConnectedWallet={isConnectedWallet}
          />
          <Reward
            // noDataPlaceholder={!userWalletAddress ? <NoConnectWalletPlaceholder /> : null}
            stakeToken={gearToken.symbol}
            earnToken={gearToken.symbol}
            earnTokenAddress={gearToken.address}
            stakeAmount={stakingLp.userData.pendingReward}
            lastCollectedTimestamp={stakingLp.lastRewardTime}
            earnedToDate={stakingLp.userData.earned}
            onCollectRewardClick={stakingLp.handleCollectReward}
            isUserDataLoading={stakingLp.userData.fetchStatus === RequestStatus.REQUEST}
            isPendingTx={stakingLp.collectRewardRequestStatus === RequestStatus.REQUEST}
            isConnectedWallet={isConnectedWallet}
          />
        </div>
      </div>

      <div className={styles.section}>
        <SectionHead
          title={`${gearToken.symbol} Staking`}
          stakeToken={gearToken.symbol}
          earnToken={gearToken.symbol}
          totalStaked={{
            token: stakingRegular.totalStaked,
            usd: getDollarAmount(stakingRegular.totalStaked, gearToken.address),
          }}
          // eslint-disable-next-line prettier/prettier
          performance={(
            <>
              {getFormattedValue(stakingRegular.apr, true)}% APR
              <div className={styles.infoIcon}>
                <TooltipApr tokenSymbol1={gearToken.symbol} tokenSymbol2={gearToken.symbol} />
              </div>
            </>
            // eslint-disable-next-line prettier/prettier
          )}
          isLoading={stakingRegular.publicDataRequestStatus === RequestStatus.REQUEST}
        />
        <div className={styles.sectionBody}>
          <Stake
            onStakeClick={stakingRegular.handleStake}
            onUnstakeClick={stakingRegular.handleUnstake}
            onMaxClick={() => stakingRegular.userData.balance}
            stakeTokenRequestStatus={stakingRegular.stakeRequestStatus}
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
            isConnectedWallet={isConnectedWallet}
          />
          <Reward
            stakeToken={gearToken.symbol}
            earnToken={gearToken.symbol}
            earnTokenAddress={gearToken.address}
            stakeAmount={stakingRegular.userData.pendingReward}
            lastCollectedTimestamp={stakingRegular.lastRewardTime}
            earnedToDate={stakingRegular.userData.earned}
            onCollectRewardClick={stakingRegular.handleCollectReward}
            isUserDataLoading={stakingRegular.userData.fetchStatus === RequestStatus.REQUEST}
            isPendingTx={stakingRegular.collectRewardRequestStatus === RequestStatus.REQUEST}
            isConnectedWallet={isConnectedWallet}
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
              {getFormattedValue(stakingCompounder.apy, true)}% APY
              <div className={styles.infoIcon}>
                <TooltipApy
                  token1={{
                    symbol: gearToken.symbol,
                  }}
                />
              </div>
            </>
            // eslint-disable-next-line prettier/prettier
          )}
          isLoading={stakingRegular.publicDataRequestStatus === RequestStatus.REQUEST}
        />
        <div className={styles.sectionBody}>
          <Stake
            isCompounder
            onStakeClick={stakingCompounder.handleStake}
            onUnstakeClick={stakingCompounder.handleUnstake}
            onMaxClick={() => stakingCompounder.userData.balance}
            stakeTokenRequestStatus={stakingCompounder.stakeRequestStatus}
            stakeToken={gearToken.symbol}
            stakeTokenAddress={gearToken.address}
            maxDecimals={gearToken.decimals}
            stakeTokenAllowance={stakingCompounder.stakeTokenAllowance}
            stakeAmount={stakingCompounder.userData.stakeAmount}
            tokenBalance={stakingCompounder.userData.balance}
            earnToken={gearToken.symbol}
            earnTokenAddress={gearToken.address}
            earnedToDate={stakingCompounder.userData.earned}
            isUserDataLoading={stakingCompounder.userData.fetchStatus === RequestStatus.REQUEST}
            isPendingTx={
              stakingCompounder.stakeRequestStatus === RequestStatus.REQUEST ||
              stakingCompounder.unstakeRequestStatus === RequestStatus.REQUEST
            }
            isConnectedWallet={isConnectedWallet}
          />
        </div>
      </div>
    </div>
  );
};
