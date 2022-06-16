import { FC, useMemo, useState } from 'react';
import cn from 'classnames';

import { bitGearTokenIcon, triangleArrow } from '../../../../assets/icons';
import { Button, SkeletonLoader } from '../../../../components';
import { getDollarAmount, getFormattedValue } from '../../../../utils';
import { numberTransform } from '../../../../utils/numberTransform';
import { NoConnectWalletPlaceholder } from '../NoConnectWalletPlaceholder';
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

type CollapseHeaderTextProps = {
  isLoading: boolean;
  isConnectedWallet: boolean;
  text: string;
};

const CollapseHeaderText: FC<CollapseHeaderTextProps> = ({
  isLoading,
  isConnectedWallet,
  text,
}) => {
  if (isLoading) return <SkeletonLoader width="200px" height="30px" borderRadius="4px" />;
  if (isConnectedWallet) return <p className={styles.text}>{text}</p>;
  return null;
};

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

  const formattedEarnedToDateAsUsd = getFormattedValue(
    getDollarAmount(earnedToDate, earnTokenAddress),
  );

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
          <CollapseHeaderText
            isLoading={isUserDataLoading}
            isConnectedWallet={isConnectedWallet}
            text={`${stakeAmount} ${stakeToken}`}
          />
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
      </div>
      {isConnectedWallet && (
        <div className={styles.ethRewardAmountBlock}>
          <img src={bitGearTokenIcon} alt="token icon" />

          <p className={styles.text}>
            {stakeAmount} {stakeToken}
          </p>
        </div>
      )}

      <div className={styles.stakeUnstakeBlock}>
        <div className={styles.textFlex}>
          <p className={cn(styles.text, styles.grayText)}>Last collected:</p>
          {isUserDataLoading ? (
            <SkeletonLoader width="200px" height="30px" borderRadius="4px" />
          ) : (
            <p className={styles.text}>{lastCollectedTimestamp}</p>
          )}
        </div>

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
      <div className={cn(styles.compoundGearBlock)}>
        <div className={styles.textFlex}>
          <span className="flexCenter">
            <img className={styles.bitGearIcon} src={bitGearTokenIcon} alt="gear token icon" />
            <p className={styles.text}>BITGEAR</p>
          </span>
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
                      {`($${formattedEarnedToDateAsUsd})`}
                    </span>
                  </p>
                  // eslint-disable-next-line prettier/prettier
              )}
                value={`${earnedToDate} ($${formattedEarnedToDateAsUsd})`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
