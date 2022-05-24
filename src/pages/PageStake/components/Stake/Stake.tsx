import React, { ChangeEvent, ReactNode, useCallback, useState } from 'react';
import cn from 'classnames';

import { triangleArrow } from '../../../../assets/icons';
import { Button, Input, Switch } from '../../../../components';
import { getDollarAmount, validateOnlyNumbers } from '../../../../utils';
import { TooltipStakeCollectRewards } from '../TooltipStakeCollectRewards';

import styles from './Stake.module.scss';

interface StakeProps {
  noDataPlaceholder?: ReactNode;
  isCompounder?: boolean;
  stakeAmount: string | number;
  tokenBalance: string | number;
  stakeToken: string;
  maxDecimals: number;
  earnToken?: string;
  earnedToDate?: string | number;
  onMaxClick: () => string | void;
  className?: number;
}

export const Stake: React.FC<StakeProps> = ({
  noDataPlaceholder,
  isCompounder = false,
  stakeAmount,
  tokenBalance,
  stakeToken,
  maxDecimals,
  earnToken = '',
  earnedToDate = '',
  onStakeClick,
  onUnstakeClick,
  onMaxClick,
  className,
}) => {
  const [isExpanded, setExpanded] = useState(false);
  const [isStakeSelected, setStakeSelected] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [shouldCollectEthRewards, setCollectEthRewards] = useState(false);

  const validateAndChangeInputValue = useCallback(
    (value: string) => {
      if (validateOnlyNumbers(value, maxDecimals)) {
        setInputValue(value);
      }
    },
    [maxDecimals],
  );
  const handleInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    validateAndChangeInputValue(value);
  };

  const handleMax = useCallback(async () => {
    let maxValue: string | void;
    if (isStakeSelected) {
      maxValue = await onMaxClick();
    } else {
      maxValue = String(stakeAmount);
    }

    if (maxValue !== undefined) {
      validateAndChangeInputValue(maxValue);
    }
  }, [isStakeSelected, onMaxClick, stakeAmount, validateAndChangeInputValue]);
  return (
    <div
      className={cn(
        styles.stakeContainer,
        {
          [styles.isContainerExpanded]: isExpanded,
          [styles.stakeContainer_compounder]: isCompounder,
          [styles.stakeContainer_noDataPlaceholder]: !!noDataPlaceholder,
        },
        className,
      )}
    >
      <div className={styles.titleBlock}>
        <p className={styles.text}>Your stake</p>
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
          <div className={styles.stakeUnstakeSelectorBlock}>
            <Button
              classNameCustom={cn({ [styles.isSelected]: isStakeSelected })}
              onClick={() => setStakeSelected(true)}
              variant="text"
            >
              Stake
            </Button>
            <Button
              classNameCustom={cn({ [styles.isSelected]: !isStakeSelected })}
              onClick={() => setStakeSelected(false)}
              variant="text"
            >
              Unstake
            </Button>
          </div>
          <div className={styles.inputBlock}>
            <Input value={inputValue} onChange={handleInputValueChange} />
            <Button uppercase={false} variant="outlined" onClick={handleMax}>
              Max
            </Button>
          </div>
          <div className={styles.stakeUnstakeBlock}>
            <div className={styles.textFlex}>
              <p className={cn(styles.text, styles.grayText)}>{`${stakeToken} in wallet:`}</p>
              <p className={styles.text}>{tokenBalance}</p>
            </div>

            <div className={styles.textFlex}>
              <p className={cn(styles.text, styles.grayText)}>Your Stake (Compounding):</p>
              <p className={styles.text}>
                {stakeAmount}
                <span className={cn(styles.grayText)}>{`($${stakedDollarAmount})`}</span>
              </p>
            </div>

            {isCompounder && (
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
            )}

            <Button
              onClick={isStakeSelected ? onStakeClick : onUnstakeClick}
              classNameCustom={styles.stakeUnstakeButton}
              variant="blue"
            >
              {isStakeSelected ? 'Stake' : 'Unstake'}
            </Button>
          </div>
          <div className={cn(styles.collectEthRewardsBlock, styles.textFlex)}>
            {isCompounder ? (
              <span className={styles.compounderText}>
                <div>
                  WETH you earn is automatically converted to BITGEAR, which is received over time.
                </div>
                <div>BITGEAR rewards are automatically compounded - no need to collect!</div>
              </span>
            ) : (
              <>
                <span className="flexCenter">
                  <p className={cn(styles.text, styles.grayText)}>Collect 0 ETH rewards?</p>
                  <div className={styles.tooltipIcon}>
                    <TooltipStakeCollectRewards />
                  </div>
                </span>
                <Switch
                  checked={shouldCollectEthRewards}
                  onChange={() => setCollectEthRewards(!shouldCollectEthRewards)}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
