import { FC } from 'react';

import { infoRound } from '../../../../assets/icons';
import { Button, Tooltip } from '../../../../components';

import styles from './TooltipApr.module.scss';

type TooltipAprProps = {
  tokenSymbol1: string;
  tokenSymbol2: string;
  tokenApr1: string;
  tokenApr2: string;
};

export const TooltipApr: FC<TooltipAprProps> = ({
  tokenSymbol1,
  tokenSymbol2,
  tokenApr1,
  tokenApr2,
}) => {
  return (
    <Tooltip
      className={styles.tooltipApr}
      name={`tooltipApr${tokenSymbol1}${tokenSymbol2}${tokenApr1}${tokenApr2}`}
      target={<Button icon={infoRound} variant="iconButton" />}
      // eslint-disable-next-line prettier/prettier
        content={(
        <div className={styles.tooltipText}>
          <div className={styles.container}>
            This calculation includes both {tokenSymbol1} and {tokenSymbol2} earned through staking{' '}
            {tokenSymbol1}.
          </div>

          <hr className={styles.divider} />

          <div className={styles.line}>
            <div>Current {tokenSymbol1} APR</div>
            <div>{tokenApr1}%</div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.line}>
            <div>Current {tokenSymbol2} APR</div>
            <div>{tokenApr2}%</div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.container}>
            The rates shown on this page are only provided for your reference: The actual rates will
            fluctuate according to many different factors, including token prices, trading volume,
            liquidity, amount staked, and more.
          </div>

          <div className={styles.container}>
            Trading fees collected by the protocol are distributed to {tokenSymbol1} stakers as
            rewards. Reward rates are adjusted roughly every 24 hours, based on the past 24 hours’
            trading activity.
          </div>
        </div>
        // eslint-disable-next-line prettier/prettier
        )}
      event="click"
    />
  );
};
