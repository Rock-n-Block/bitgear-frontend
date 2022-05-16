import React, { ChangeEvent, useMemo, useState } from 'react';
import cn from 'classnames';

import { infoRound, triangleArrow } from '../../../../assets/icons';
import { Button, Input, Switch } from '../../../../components';
import { validateOnlyNumbers } from '../../../../utils';

import styles from './styles.module.scss';

interface StakeProps {
  stakeAmount: string | number;
  tokenBalance: string | number;
  tokenName: string;
  onStakeClick: () => void;
  onUnstakeClick: () => void;
  className?: number;
}

export const Stake: React.FC<StakeProps> = ({
  stakeAmount,
  tokenBalance,
  tokenName,
  onStakeClick,
  onUnstakeClick,
  className,
}) => {
  const [isExpanded, setExpanded] = useState(false);
  const [isStakeSelected, setStakeSelected] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [shouldCollectEthRewards, setCollectEthRewards] = useState(false);

  const handleInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (validateOnlyNumbers(value)) {
      setInputValue(value);
    }
  };

  const stakedDollarAmount = useMemo(() => {
    // TODO: do some logic;
    return stakeAmount;
  }, [stakeAmount]);
  return (
    <div
      className={cn(styles.stakeContainer, { [styles.isContainerExpanded]: isExpanded }, className)}
    >
      <div className={styles.titleBlock}>
        <p className={styles.text}>Your stake</p>
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
        <Button uppercase={false} variant="outlined">
          Max
        </Button>
      </div>
      <div className={styles.stakeUnstakeBlock}>
        <div className={styles.textFlex}>
          <p className={cn(styles.text, styles.grayText)}>{`${tokenName} in wallet:`}</p>
          <p className={styles.text}>{tokenBalance}</p>
        </div>
        <div className={styles.textFlex}>
          <p className={cn(styles.text, styles.grayText)}>Your Stake (Compounding):</p>
          <p className={styles.text}>
            {stakeAmount}
            <span className={cn(styles.grayText)}>{`($${stakedDollarAmount})`}</span>
          </p>
        </div>
        <Button
          onClick={isStakeSelected ? onStakeClick : onUnstakeClick}
          classNameCustom={styles.stakeUnstakeButton}
          variant="blue"
        >
          {isStakeSelected ? 'Stake' : 'Unstake'}
        </Button>
      </div>
      <div className={cn(styles.collectEthRewardsBlock, styles.textFlex)}>
        <span className="flexCenter">
          <p className={cn(styles.text, styles.grayText)}>Collect 0 ETH rewards?</p>
          <Button classNameCustom={styles.tooltipIcon} icon={infoRound} variant="iconButton" />
        </span>
        <Switch
          checked={shouldCollectEthRewards}
          onChange={() => setCollectEthRewards(!shouldCollectEthRewards)}
        />
      </div>
    </div>
  );
};
