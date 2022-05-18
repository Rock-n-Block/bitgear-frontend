import React, { useState } from 'react';
import cn from 'classnames';

import { ethIcon, gearTokenIcon, triangleArrow } from '../../../../assets/icons';
import { Button } from '../../../../components';
import { TooltipCollectRewardsCompounding } from '../TooltipCollectRewardsCompounding';
import { TooltipCollectRewardsWhatsThis } from '../TooltipCollectRewardsWhatsThis';

import styles from './styles.module.scss';

interface RewardProps {
  stakeAmount: string | number;
  tokenName: string;
  ethReward: string | number;
  lastCollectedTimestamp: string | number;
  collectedToDate: string | number;
  earnedToDate: string | number;
  onCollectRewardClick: () => void;
  className?: string;
}

export const Reward: React.FC<RewardProps> = ({
  stakeAmount,
  tokenName,
  className,
  ethReward,
  lastCollectedTimestamp,
  collectedToDate,
  onCollectRewardClick,
  earnedToDate,
}) => {
  const [isExpanded, setExpanded] = useState(false);

  const getDollarAmount = (amount: string | number, token: string) => {
    // TODO: move to utils, create logic
    console.log(token);
    return amount;
  };

  return (
    <div
      className={cn(styles.stakeContainer, { [styles.isContainerExpanded]: isExpanded }, className)}
    >
      <div className={styles.titleBlock}>
        <p className={styles.text}>Rewards to collect</p>
        <div className={styles.collapseBtnContainer}>
          <p className={styles.text}>{`${stakeAmount} ${tokenName}`}</p>
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
        <img src={ethIcon} alt="eth icon" />
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
              {`($${getDollarAmount(collectedToDate, '')})`}
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
            <img className={styles.bitGearIcon} src={gearTokenIcon} alt="gear token icon" />
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
            <span className={cn(styles.grayText)}>{`($${getDollarAmount(earnedToDate, '')})`}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
