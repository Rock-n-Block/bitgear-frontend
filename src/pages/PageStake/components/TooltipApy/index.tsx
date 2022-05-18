import { FC } from 'react';
import cn from 'classnames';

import { infoRound } from '../../../../assets/icons';
import { Button, Tooltip } from '../../../../components';

import styles from './TooltipApy.module.scss';

type Token1 = {
  symbol: string;
  apr: string;
};

type Token2 = Token1 & { apy: string };

type TooltipApyProps = {
  token1: Token1;
  token2: Token2;
  dailyEstimatedCompounds: number;
};

export const TooltipApy: FC<TooltipApyProps> = ({ token1, token2, dailyEstimatedCompounds }) => {
  return (
    <Tooltip
      className={styles.tooltipApy}
      name={`tooltipApy${token1.symbol}${token1.apr}${token2.symbol}${token2.apr}${token2.apy}`}
      target={<Button icon={infoRound} variant="iconButton" />}
      // eslint-disable-next-line prettier/prettier
        content={(
        <div className={styles.tooltipText}>
          <div className={styles.line}>
            <div>{token1.symbol} APR</div>
            <div>{token1.apr}%</div>
          </div>

          <div className={styles.line}>
            <div>{token2.symbol} (Fee Sharing) APR</div>
            <div>{token2.apr}%</div>
          </div>

          <div className={styles.line}>
            <div>{token2.symbol} (Fee Sharing) APY</div>
            <div>{token2.apy}%</div>
          </div>

          <div className={styles.line}>
            <div>Daily estimated compounds</div>
            <div>{dailyEstimatedCompounds}</div>
          </div>

          <hr className={styles.divider} />
          <div className={cn(styles.formula, styles.container)}>
            APY = (1 + {token2.symbol} APY) * (1 + {token1.symbol} APR) - 1
          </div>

          <div className={styles.container}>
            Rates shown are estimates, and fluctuate according to many different factors, including
            token prices, trading volume, liquidity, amount staked, and more.
          </div>

          <div className={styles.container}>
            Trading fees collected by the protocol are distributed to {token1.symbol} stakers as
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
