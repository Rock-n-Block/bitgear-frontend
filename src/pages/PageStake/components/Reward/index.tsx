import React, { ReactNode, useState } from 'react';
import cn from 'classnames';

import { bitGearTokenIcon, ethTokenIcon, triangleArrow } from '../../../../assets/icons';
import { Button } from '../../../../components';
import { getDollarAmount } from '../../../../utils';
import { TooltipCollectRewardsCompounding } from '../TooltipCollectRewardsCompounding';
import { TooltipCollectRewardsWhatsThis } from '../TooltipCollectRewardsWhatsThis';

import styles from './Reward.module.scss';

interface RewardProps {
  noDataPlaceholder?: ReactNode;
  stakeAmount: string | number;
  stakeToken: string;
  earnToken: string;
  ethReward: string | number;
  lastCollectedTimestamp: string | number;
  collectedToDate: string | number;
  earnedToDate: string | number;
  onCollectRewardClick: () => void;
  className?: string;
}

export const Reward: React.FC<RewardProps> = ({
  noDataPlaceholder,
  stakeAmount,
  stakeToken,
  earnToken,
  className,
  ethReward,
  lastCollectedTimestamp,
  collectedToDate,
  onCollectRewardClick,
  earnedToDate,
}) => {
  const [isExpanded, setExpanded] = useState(false);

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
          {!noDataPlaceholder && <p className={styles.text}>{`${stakeAmount} ${stakeToken}`}</p>}
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
              ETH rewards from the pool are distributed every block.
            </p>
            <span className="flexCenter">
              <p className={cn(styles.text, styles.grayText)}>What`s this?</p>
              <div className={styles.tooltipIcon}>
                <TooltipCollectRewardsWhatsThis tokenSymbol="GEAR" />
              </div>
            </span>
          </div>
          <div className={styles.ethRewardAmountBlock}>
            <img src={ethTokenIcon} alt="eth icon" />
            <p>{`${ethReward} ETH`}</p>
          </div>
          <div className={styles.stakeUnstakeBlock}>
            <div className={styles.textFlex}>
              <p className={cn(styles.text, styles.grayText)}>Last collected:</p>
              <p className={styles.text}>{lastCollectedTimestamp}</p>
            </div>
            <div className={styles.textFlex}>
              <p className={cn(styles.text, styles.grayText)}>Collected to date:</p>
              <p className={styles.text}>
                {collectedToDate}
                <span className={cn(styles.grayText)}>
                  {/* TODO: check if collecting earnToken */}
                  {`($${getDollarAmount(collectedToDate, earnToken)})`}
                </span>
              </p>
            </div>
            <Button
              onClick={onCollectRewardClick}
              classNameCustom={styles.stakeUnstakeButton}
              variant="blue"
            >
              Collect
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
                  <TooltipCollectRewardsCompounding tokenSymbol="GEAR" />
                </div>
              </span>
            </div>
            <div className={styles.textFlex}>
              <p className={cn(styles.text, styles.grayText)}>Earned to date:</p>
              <p className={styles.text}>
                {earnedToDate}
                <span className={cn(styles.grayText)}>{`($${getDollarAmount(
                  earnedToDate,
                  earnToken,
                )})`}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
