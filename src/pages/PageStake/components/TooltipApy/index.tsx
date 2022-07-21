import { FC } from 'react';
import cn from 'classnames';

import { infoRound } from '../../../../assets/icons';
import { Button, Tooltip } from '../../../../components';

import styles from './TooltipApy.module.scss';

type Token1 = {
  symbol: string;
};

type TooltipApyProps = {
  token1: Token1;
};

export const TooltipApy: FC<TooltipApyProps> = ({ token1 }) => {
  return (
    <Tooltip
      className={styles.tooltipApy}
      name={`tooltipApy${token1.symbol}`}
      target={<Button icon={infoRound} variant="iconButton" />}
      // eslint-disable-next-line prettier/prettier
        content={(
        <div className={styles.tooltipText}>
          <div className={cn(styles.formula, styles.container)}>
            APY = (1 + {token1.symbol} APR / n) <sup>n</sup> - 1
          </div>
          <div className={styles.line}>
            <div>n - compounding periods in year (365)</div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.container}>
            The rates shown on this page are only provided for your reference: The actual rates will
            fluctuate according to many different factors, including token prices, trading volume,
            liquidity, amount staked, and more.
          </div>
        </div>
        // eslint-disable-next-line prettier/prettier
        )}
    />
  );
};
