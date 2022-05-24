import React, { ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import cn from 'classnames';

import { triangleArrow } from '../../../../assets/icons';
import { Button, Input, SkeletonLoader, Switch } from '../../../../components';
import useDebounce from '../../../../hooks/useDebounce';
import { RequestStatus } from '../../../../types';
import { getDollarAmount, serialize, validateOnlyNumbers } from '../../../../utils';
import { TooltipStakeCollectRewards } from '../TooltipStakeCollectRewards';

import styles from './Stake.module.scss';

interface StakeProps {
  noDataPlaceholder?: ReactNode;
  isCompounder?: boolean;
  stakeAmount: string | number;
  tokenBalance: string | number;
  stakeToken: string;
  maxDecimals: number;
  stakeTokenAllowance: {
    isAllowanceLoading: boolean;
    allowance: string;
    handleCheckAllowance: () => void;
    handleApprove: (amount: string) => void;
    approveStatus: RequestStatus;
  };
  earnToken?: string;
  earnedToDate?: string | number;
  onStakeClick: (value: string) => void;
  onUnstakeClick: (value: string) => void;
  onMaxClick: () => string | void;
  isUserDataLoading: boolean;
  className?: number;
}

export const Stake: React.FC<StakeProps> = ({
  noDataPlaceholder,
  isCompounder = false,
  stakeAmount,
  tokenBalance,
  stakeToken,
  maxDecimals,
  stakeTokenAllowance,
  earnToken = '',
  earnedToDate = '',
  onStakeClick,
  onUnstakeClick,
  onMaxClick,
  isUserDataLoading,
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

  const handleStake = useCallback(() => {
    onStakeClick(inputValue);
  }, [inputValue, onStakeClick]);

  const handleUnstake = useCallback(() => {
    onUnstakeClick(inputValue);
  }, [inputValue, onUnstakeClick]);

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
  const handleApprove = useCallback(() => {
    stakeTokenAllowance.handleApprove(inputValue || '0');
  }, [inputValue, stakeTokenAllowance]);

  const debouncedCheckAllowance = useDebounce(inputValue, 1000);
  useEffect(() => {
    stakeTokenAllowance.handleCheckAllowance();
    // disable-reason: prevent re-rendering due to this effect should run only if inputValue is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCheckAllowance]);
  const isEnoughAllowance = new BigNumber(stakeTokenAllowance.allowance).isGreaterThanOrEqualTo(
    serialize(inputValue || '0', maxDecimals),
  );
  const isLoadingSubmitButton = useMemo(() => {
    if (stakeTokenAllowance.isAllowanceLoading) return true;
    if (stakeTokenAllowance.approveStatus === RequestStatus.REQUEST) return true;
    return false;
  }, [stakeTokenAllowance.approveStatus, stakeTokenAllowance.isAllowanceLoading]);
  const isDisabledSubmitButton = useMemo(() => {
    if (isLoadingSubmitButton) return true;

    if (!isStakeSelected && new BigNumber(inputValue).gt(stakeAmount)) return true;
    if (isStakeSelected && !isEnoughAllowance) return false;

    const hasInputValue = +inputValue > 0;
    if (!hasInputValue) return true;

    return false;
  }, [inputValue, isEnoughAllowance, isLoadingSubmitButton, isStakeSelected, stakeAmount]);

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
          {(() => {
            if (isUserDataLoading)
              return <SkeletonLoader width="120px" height="30px" borderRadius="4px" />;
            if (!noDataPlaceholder)
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
              {isUserDataLoading ? (
                <SkeletonLoader width="100px" height="30px" borderRadius="4px" />
              ) : (
                <p className={styles.text}>{tokenBalance}</p>
              )}
            </div>

            <div className={styles.textFlex}>
              <p className={cn(styles.text, styles.grayText)}>Your Stake (Compounding):</p>
              {isUserDataLoading ? (
                <SkeletonLoader width="150px" height="30px" borderRadius="4px" />
              ) : (
                <p className={styles.text}>
                  {stakeAmount}
                  <span className={cn(styles.grayText)}>{`($${getDollarAmount(
                    stakeAmount,
                    stakeToken,
                  )})`}</span>
                </p>
              )}
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

            {(() => {
              if (isLoadingSubmitButton)
                return (
                  <Button
                    classNameCustom={styles.stakeUnstakeButton}
                    variant="blue"
                    disabled={isDisabledSubmitButton}
                  >
                    Loading...
                  </Button>
                );

              if (isEnoughAllowance || !isStakeSelected) {
                return (
                  <Button
                    onClick={isStakeSelected ? handleStake : handleUnstake}
                    classNameCustom={styles.stakeUnstakeButton}
                    variant="blue"
                    disabled={isDisabledSubmitButton}
                  >
                    {isStakeSelected ? 'Stake' : 'Unstake'}
                  </Button>
                );
              }
              return (
                <Button
                  onClick={handleApprove}
                  classNameCustom={styles.stakeUnstakeButton}
                  variant="blue"
                  disabled={isDisabledSubmitButton}
                >
                  Approve
                </Button>
              );
            })()}
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
