import { FC } from 'react';

import { infoRound } from '../../../../assets/icons';
import { Button, Tooltip } from '../../../../components';

import styles from './TooltipCollectRewardsWhatsThis.module.scss';

type TooltipCollectRewardsWhatsThisProps = {
  tokenSymbol: string;
};

export const TooltipCollectRewardsWhatsThis: FC<TooltipCollectRewardsWhatsThisProps> = ({
  tokenSymbol,
}) => {
  return (
    <Tooltip
      className={styles.tooltipCollectRewardsWhatsThis}
      name="tooltipCollectRewardsWhatsThis"
      target={<Button icon={infoRound} variant="iconButton" />}
      // eslint-disable-next-line prettier/prettier
      content={(
        <p className={styles.tooltipText}>
          Trading fees collected by the protocol are distributed to {tokenSymbol} stakers as
          rewards. Reward rates are adjusted roughly every 24 hours, based on the past 24 hours’
          trading activity.
        </p>
        // eslint-disable-next-line prettier/prettier
      )}
    />
  );
};
