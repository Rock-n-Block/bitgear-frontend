import { FC } from 'react';

import { infoRound } from '../../../../assets/icons';
import { Button, Tooltip } from '../../../../components';

import styles from './TooltipCollectRewardsCompounding.module.scss';

type TooltipCollectRewardsCompoundingProps = {
  tokenSymbol: string;
};

export const TooltipCollectRewardsCompounding: FC<TooltipCollectRewardsCompoundingProps> = ({
  tokenSymbol,
}) => {
  return (
    <Tooltip
      className={styles.tooltipCollectRewardsCompounding}
      name="tooltipCollectRewardsCompounding"
      target={<Button icon={infoRound} variant="iconButton" />}
      // eslint-disable-next-line prettier/prettier
      content={(
        <p className={styles.tooltipText}>
          When you stake {tokenSymbol}, you also earn extra {tokenSymbol} as a bonus reward.
        </p>
        // eslint-disable-next-line prettier/prettier
      )}
      event="click"
    />
  );
};
