import { FC } from 'react';

import { infoRound } from '../../../../assets/icons';
import { Button, Tooltip } from '../../../../components';

import styles from './TooltipCollectRewardsCompounding.module.scss';

type TooltipCollectRewardsCompoundingProps = {
  stakeTokenSymbol: string;
  earnTokenSymbol: string;
};

export const TooltipCollectRewardsCompounding: FC<TooltipCollectRewardsCompoundingProps> = ({
  stakeTokenSymbol,
  earnTokenSymbol,
}) => {
  return (
    <Tooltip
      className={styles.tooltipCollectRewardsCompounding}
      name="tooltipCollectRewardsCompounding"
      target={<Button icon={infoRound} variant="iconButton" />}
      // eslint-disable-next-line prettier/prettier
      content={(
        <p className={styles.tooltipText}>
          When you stake {stakeTokenSymbol}, you also earn extra {earnTokenSymbol} as a bonus
          reward.
        </p>
        // eslint-disable-next-line prettier/prettier
      )}
      // event="click"
    />
  );
};
