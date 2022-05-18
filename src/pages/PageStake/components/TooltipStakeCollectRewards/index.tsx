import { FC } from 'react';

import { infoRound } from '../../../../assets/icons';
import { Button, Tooltip } from '../../../../components';

import styles from './TooltipStakeCollectRewards.module.scss';

const COLLECT_REWARDS_TOOLTIP = `You can collect pending rewards while staking or unstaking from this contract.
You’ll have to pay a little more in transaction fees for this.`;

type TooltipStakeCollectRewardsProps = {};

export const TooltipStakeCollectRewards: FC<TooltipStakeCollectRewardsProps> = () => {
  return (
    <Tooltip
      className={styles.tooltipStakeCollectRewards}
      name="tooltipStakeCollectRewards"
      target={<Button icon={infoRound} variant="iconButton" />}
      content={<p className={styles.tooltipText}>{COLLECT_REWARDS_TOOLTIP}</p>}
      event="click"
    />
  );
};
