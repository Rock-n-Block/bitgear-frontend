import { FC } from 'react';
import { v4 as uuid } from 'uuid';

import { infoRound } from '../../../../assets/icons';
import { Button, Tooltip } from '../../../../components';

import styles from './TooltipApr.module.scss';

type TooltipAprProps = {
  tokenSymbol1: string;
  tokenSymbol2: string;
  isLpToken?: boolean;
};

export const TooltipApr: FC<TooltipAprProps> = ({
  tokenSymbol1,
  tokenSymbol2,
  isLpToken = false,
}) => {
  return (
    <Tooltip
      className={styles.tooltipApr}
      name={uuid()}
      target={<Button icon={infoRound} variant="iconButton" />}
      // eslint-disable-next-line prettier/prettier
        content={(
        <div className={styles.tooltipText}>
          <div className={styles.container}>
            This calculation includes both {isLpToken ? 'LP' : tokenSymbol1} reward and{' '}
            {tokenSymbol2} earned through staking {tokenSymbol1}.
          </div>

          <hr className={styles.divider} />

          <div className={styles.container}>
            The rates shown on this page are only provided for your reference: The actual rates will
            fluctuate according to many different factors, including token prices, trading volume,
            liquidity, amount staked, and more.
          </div>

          <div className={styles.container}>
            {isLpToken ? 'LP' : tokenSymbol2} rewards come from swaps that occur in the pool and are
            distributed among the {isLpToken ? 'LP' : tokenSymbol2}s in proportion to their shares
            of the pool’s total liquidity.
          </div>

          <div className={styles.container}>
            Get additional profit in {tokenSymbol2} for staking {isLpToken ? 'LP' : tokenSymbol1}s
          </div>
        </div>
        // eslint-disable-next-line prettier/prettier
        )}
      event="click"
    />
  );
};
