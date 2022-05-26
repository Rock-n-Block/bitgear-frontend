import React, { ReactNode, useMemo, useState } from 'react';
import cn from 'classnames';

import {
  bitGearTokenIcon,
  // ethTokenIcon,
  triangleArrow,
} from '../../../../assets/icons';
import { Button, SkeletonLoader } from '../../../../components';
import { getDollarAmount } from '../../../../utils';
import { numberTransform } from '../../../../utils/numberTransform';
import { TooltipCollectRewardsCompounding } from '../TooltipCollectRewardsCompounding';
import { TooltipCollectRewardsWhatsThis } from '../TooltipCollectRewardsWhatsThis';
import { TooltipValue } from '../TooltipValue';

import styles from './Reward.module.scss';

interface RewardProps {
  noDataPlaceholder?: ReactNode;
  stakeAmount: string | number;
  stakeToken: string;
  earnToken: string;
  earnTokenAddress: string;
  // ethReward: string | number;
  lastCollectedTimestamp: string | number;
  // collectedToDate: string | number;
  earnedToDate: string | number;
  onCollectRewardClick: () => void;
  isUserDataLoading: boolean;
  isPendingTx: boolean;
  className?: string;
}

export const Reward: React.FC<RewardProps> = ({
  noDataPlaceholder,
  stakeAmount,
  stakeToken,
  earnToken,
  earnTokenAddress,
  className,
  // ethReward,
  lastCollectedTimestamp,
  // collectedToDate,
  onCollectRewardClick,
  earnedToDate,
  isUserDataLoading,
  isPendingTx,
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
          [styles.stakeContainer_noDataPlaceholder]: !!noDataPlaceholder,
        },
        className,
      )}
    >
      <div className={styles.titleBlock}>
        <p className={styles.text}>Rewards to collect</p>
        <div className={styles.collapseBtnContainer}>
          {(() => {
            if (!noDataPlaceholder)
              return <p className={styles.text}>{`${stakeAmount} ${stakeToken}`}</p>;
            if (isUserDataLoading)
              return <SkeletonLoader width="200px" height="30px" borderRadius="4px" />;
            return null;
          })()}
          {/* {!noDataPlaceholder && <p className={styles.text}>{`${stakeAmount} ${stakeToken}`}</p>} */}
          <Button
            variant="iconButton"
            icon={triangleArrow}
            onClick={() => setExpanded(!isExpanded)}
            classNameCustom={cn(styles.expandButton, { [styles.isExpanded]: isExpanded })}
          />
        </div>
      </div>
      {noDataPlaceholder || (
        <>
          <div className={styles.ethRewardsBlock}>
            <p className={cn(styles.text, styles.grayText, styles.smallText)}>
              {earnToken} rewards from the pool are distributed every block.
            </p>
            <span className="flexCenter">
              <p className={cn(styles.text, styles.grayText)}>What`s this?</p>
              <div className={styles.tooltipIcon}>
                <TooltipCollectRewardsWhatsThis tokenSymbol="GEAR" />
              </div>
            </span>
          </div>
          {/* <div className={styles.ethRewardAmountBlock}>
            <img src={ethTokenIcon} alt="eth icon" />
            <p>{`${ethReward} ETH`}</p>
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
                        {/* TODO: check if collecting earnToken */}
                        {`($${numberTransform(getDollarAmount(earnedToDate, earnTokenAddress))})`}
                      </span>
                    </p>
                    // eslint-disable-next-line prettier/prettier
                  )}
                  value={`${earnedToDate}($${getDollarAmount(earnedToDate, earnTokenAddress)})`}
                />
              )}
            </div>
            <Button
              classNameCustom={styles.stakeUnstakeButton}
              variant="blue"
              disabled={isPendingTx}
              onClick={submitButtonState.handler}
            >
              {submitButtonState.text}
            </Button>
          </div>
          <div className={cn(styles.compoundGearBlock)}>
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
            {/* <div className={styles.textFlex}>
              <p className={cn(styles.text, styles.grayText)}>Earned to date:</p>
              {isUserDataLoading ? (
                <SkeletonLoader width="120px" height="30px" borderRadius="4px" />
              ) : (
                <p className={styles.text}>
                  {earnedToDate}
                  <span className={cn(styles.grayText)}>{`($${getDollarAmount(
                    earnedToDate,
                    earnToken,
                  )})`}</span>
                </p>
              )}
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};
