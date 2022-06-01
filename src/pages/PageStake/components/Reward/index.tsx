import { FC, useMemo, useState } from 'react';
import cn from 'classnames';

import {
  // bitGearTokenIcon,
  triangleArrow,
} from '../../../../assets/icons';
import { Button, SkeletonLoader } from '../../../../components';
import { getDollarAmount } from '../../../../utils';
import { numberTransform } from '../../../../utils/numberTransform';
import { NoConnectWalletPlaceholder } from '../NoConnectWalletPlaceholder';
// import { TooltipCollectRewardsCompounding } from '../TooltipCollectRewardsCompounding';
import { TooltipValue } from '../TooltipValue';

import styles from './Reward.module.scss';

interface RewardProps {
  stakeAmount: string | number;
  stakeToken: string;
  earnToken: string;
  earnTokenAddress: string;
  lastCollectedTimestamp: string | number;
  earnedToDate: string | number;
  onCollectRewardClick: () => void;
  isUserDataLoading: boolean;
  isPendingTx: boolean;
  isConnectedWallet: boolean;
  className?: string;
}

export const Reward: FC<RewardProps> = ({
  stakeAmount,
  stakeToken,
  earnToken,
  earnTokenAddress,
  className,
  lastCollectedTimestamp,
  onCollectRewardClick,
  earnedToDate,
  isUserDataLoading,
  isPendingTx,
  isConnectedWallet,
}) => {
  const [isExpanded, setExpanded] = useState(false);

  const submitButtonState = useMemo(() => {
    if (isPendingTx) {
      return {
        text: 'Loading...',
      };
    }
    return {
      text: 'Collect',
      handler: onCollectRewardClick,
    };
  }, [isPendingTx, onCollectRewardClick]);

  return (
    <div
      className={cn(
        styles.stakeContainer,
        {
          [styles.isContainerExpanded]: isExpanded,
          [styles.stakeContainer_notConnectedWallet]: !isConnectedWallet,
        },
        className,
      )}
    >
      <div className={styles.titleBlock}>
        <p className={styles.text}>Rewards to collect</p>
        <div className={styles.collapseBtnContainer}>
          {(() => {
            if (isUserDataLoading)
              return <SkeletonLoader width="200px" height="30px" borderRadius="4px" />;
            if (isConnectedWallet)
              return <p className={styles.text}>{`${stakeAmount} ${stakeToken}`}</p>;
            return null;
          })()}
          <Button
            variant="iconButton"
            icon={triangleArrow}
            onClick={() => setExpanded(!isExpanded)}
            classNameCustom={cn(styles.expandButton, { [styles.isExpanded]: isExpanded })}
          />
        </div>
      </div>

      <div className={styles.ethRewardsBlock}>
        <p className={cn(styles.text, styles.grayText, styles.smallText)}>
          {earnToken} rewards from the pool are calculated every second.
        </p>
        {/* <span className="flexCenter">
          <p className={cn(styles.text, styles.grayText)}>What`s this?</p>
          <div className={styles.tooltipIcon}>
            <TooltipCollectRewardsWhatsThis tokenSymbol="GEAR" />
          </div>
        </span> */}
      </div>
      {/* <div className={styles.ethRewardAmountBlock}>
        <img src={bitGearTokenIcon} alt="eth icon" />
        <p className={styles.text}>{`${0} ETH`}</p>
      </div> */}
      <div className={styles.stakeUnstakeBlock}>
        <div className={styles.textFlex}>
          <p className={cn(styles.text, styles.grayText)}>Last collected:</p>
          {isUserDataLoading ? (
            <SkeletonLoader width="200px" height="30px" borderRadius="4px" />
          ) : (
            <p className={styles.text}>{lastCollectedTimestamp}</p>
          )}
        </div>
        {isConnectedWallet && (
          <div className={styles.textFlex}>
            <p className={cn(styles.text, styles.grayText)}>Earned to date:</p>
            {isUserDataLoading ? (
              <SkeletonLoader width="120px" height="30px" borderRadius="4px" />
            ) : (
              <TooltipValue
                // eslint-disable-next-line prettier/prettier
              target={(
                  <p className={styles.text}>
                    {numberTransform(earnedToDate)}
                    <span className={cn(styles.grayText)}>
                      {`($${numberTransform(getDollarAmount(earnedToDate, earnTokenAddress))})`}
                    </span>
                  </p>
                  // eslint-disable-next-line prettier/prettier
              )}
                value={`${earnedToDate}($${getDollarAmount(earnedToDate, earnTokenAddress)})`}
              />
            )}
          </div>
        )}

        {isConnectedWallet ? (
          <Button
            classNameCustom={styles.stakeUnstakeButton}
            variant="blue"
            disabled={isPendingTx}
            onClick={submitButtonState.handler}
          >
            {submitButtonState.text}
          </Button>
        ) : (
          <div className={styles.noConnectWalletBlock}>
            <NoConnectWalletPlaceholder />
          </div>
        )}
      </div>
      {/* <div className={cn(styles.compoundGearBlock)}>
        <p className={cn(styles.text, styles.grayText, styles.smallText)}>
          GEARS rewards are automatically compounded - no need to collect!
        </p>
        <div className={styles.textFlex}>
          <span className="flexCenter">
            <img className={styles.bitGearIcon} src={bitGearTokenIcon} alt="gear token icon" />
            <p className={styles.text}>BITGEAR</p>
          </span>
          <span className="flexCenter">
            <p className={cn(styles.text, styles.grayText)}>Compounding</p>
            <div className={styles.tooltipIcon}>
              <TooltipCollectRewardsCompounding
                stakeTokenSymbol={stakeToken}
                earnTokenSymbol={earnToken}
              />
            </div>
          </span>
        </div>
      </div> */}
    </div>
  );
};
