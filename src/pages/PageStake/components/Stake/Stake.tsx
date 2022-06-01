import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import cn from 'classnames';

import { triangleArrow } from '../../../../assets/icons';
import { Button, Input, SkeletonLoader } from '../../../../components';
import useDebounce from '../../../../hooks/useDebounce';
import { RequestStatus } from '../../../../types';
import { getDollarAmount, serialize, validateOnlyNumbers } from '../../../../utils';
import { numberTransform } from '../../../../utils/numberTransform';
import { NoConnectWalletPlaceholder } from '../NoConnectWalletPlaceholder';
import { TooltipValue } from '../TooltipValue';

import styles from './Stake.module.scss';

interface StakeProps {
  isCompounder?: boolean;
  stakeAmount: string | number;
  tokenBalance: string | number;
  stakeToken: string;
  stakeTokenAddress: string;
  maxDecimals: number;
  stakeTokenAllowance: {
    isAllowanceLoading: boolean;
    allowance: string;
    handleCheckAllowance: () => void;
    handleApprove: (amount: string) => void;
    approveStatus: RequestStatus;
  };
  earnToken?: string;
  earnTokenAddress?: string;
  earnedToDate?: string | number;
  onStakeClick: (value: string) => void;
  onUnstakeClick: (value: string) => void;
  onMaxClick: () => string | void;
  isUserDataLoading: boolean;
  isPendingTx: boolean;
  isConnectedWallet: boolean;
  className?: number;
}

export const Stake: FC<StakeProps> = ({
  isCompounder = false,
  stakeAmount,
  tokenBalance,
  stakeToken,
  stakeTokenAddress,
  maxDecimals,
  stakeTokenAllowance,
  earnToken = '',
  earnTokenAddress = '',
  earnedToDate = '',
  onStakeClick,
  onUnstakeClick,
  onMaxClick,
  isUserDataLoading,
  isPendingTx,
  isConnectedWallet,
  className,
}) => {
  const [isExpanded, setExpanded] = useState(false);
  const [isStakeSelected, setStakeSelected] = useState(true);
  const [inputValue, setInputValue] = useState('');

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
    if (isPendingTx) return true;
    return false;
  }, [isPendingTx, stakeTokenAllowance.approveStatus, stakeTokenAllowance.isAllowanceLoading]);
  const isDisabledSubmitButton = useMemo(() => {
    if (isLoadingSubmitButton) return true;

    if (!isStakeSelected && new BigNumber(inputValue).gt(stakeAmount)) return true;
    if (isStakeSelected && !isEnoughAllowance) return false;

    const hasInputValue = +inputValue > 0;
    if (!hasInputValue) return true;

    return false;
  }, [inputValue, isEnoughAllowance, isLoadingSubmitButton, isStakeSelected, stakeAmount]);

  const submitButtonState = useMemo(() => {
    if (isLoadingSubmitButton) {
      return {
        text: 'Loading...',
      };
    }
    if (isEnoughAllowance && isStakeSelected) {
      return {
        text: 'Stake',
        handler: handleStake,
      };
    }
    if (!isStakeSelected) {
      return {
        text: 'Unstake',
        handler: handleUnstake,
      };
    }
    if (!isEnoughAllowance && isStakeSelected) {
      return {
        text: 'Approve',
        handler: handleApprove,
      };
    }
    return {
      text: '',
    };
  }, [
    handleApprove,
    handleStake,
    handleUnstake,
    isEnoughAllowance,
    isLoadingSubmitButton,
    isStakeSelected,
  ]);

  const prettyToken = (token: string) => `${token.includes('-') ? 'LP ' : ''}${token}`;

  return (
    <div
      className={cn(
        styles.stakeContainer,
        {
          [styles.isContainerExpanded]: isExpanded,
          [styles.stakeContainer_compounder]: isCompounder,
          [styles.stakeContainer_notConnectedWallet]: !isConnectedWallet,
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
            if (isConnectedWallet)
              return (
                <TooltipValue
                  target={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <p className={styles.text}>{`${numberTransform(stakeAmount)} ${prettyToken(
                      stakeToken,
                    )}`}</p>
                  }
                  value={stakeAmount}
                />
              );
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
        <Button
          uppercase={false}
          variant="outlined"
          onClick={isConnectedWallet ? handleMax : undefined}
          disabled={!isConnectedWallet}
        >
          Max
        </Button>
      </div>
      <div className={styles.stakeUnstakeBlock}>
        {isConnectedWallet && (
          <>
            <div className={styles.textFlex}>
              <p className={cn(styles.text, styles.grayText)}>{`${prettyToken(
                stakeToken,
              )} in wallet:`}</p>
              {isUserDataLoading ? (
                <SkeletonLoader width="100px" height="30px" borderRadius="4px" />
              ) : (
                <TooltipValue
                  target={<p className={styles.text}>{numberTransform(tokenBalance)}</p>}
                  value={tokenBalance}
                />
              )}
            </div>
            <div className={styles.textFlex}>
              <p className={cn(styles.text, styles.grayText)}>
                Your Stake{isCompounder && ' (Compounding)'}:
              </p>
              {isUserDataLoading ? (
                <SkeletonLoader width="150px" height="30px" borderRadius="4px" />
              ) : (
                <TooltipValue
                  // eslint-disable-next-line prettier/prettier
                  target={(
                    <p className={styles.text}>
                      {numberTransform(stakeAmount)}
                      <span className={cn(styles.grayText)}>{`($${numberTransform(
                        getDollarAmount(stakeAmount, stakeTokenAddress),
                      )})`}</span>
                    </p>
                    // eslint-disable-next-line prettier/prettier
                  )}
                  value={`${stakeAmount}($${getDollarAmount(stakeAmount, stakeTokenAddress)})`}
                />
              )}
            </div>

            {isCompounder && (
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
          </>
        )}

        {isConnectedWallet ? (
          <Button
            classNameCustom={styles.stakeUnstakeButton}
            variant="blue"
            disabled={isDisabledSubmitButton}
            onClick={submitButtonState?.handler}
          >
            {submitButtonState?.text}
          </Button>
        ) : (
          <NoConnectWalletPlaceholder />
        )}
      </div>
      {isCompounder && (
        <div className={cn(styles.collectEthRewardsBlock, styles.textFlex)}>
          <span className={styles.compounderText}>
            <div>{earnToken} rewards are automatically compounded.</div>
          </span>
        </div>
      )}
    </div>
  );
};
