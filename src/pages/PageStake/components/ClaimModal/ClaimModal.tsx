import { FC, useMemo } from 'react';

import { bitGearTokenIcon } from '../../../../assets/icons';
import { Button } from '../../../../components';
import { useShallowSelector } from '../../../../hooks';
import { stakingActionTypes } from '../../../../redux/actionTypes';
import { uiSelectors } from '../../../../redux/selectors';
import { RequestStatus } from '../../../../types';
import { numberTransform } from '../../../../utils';
import { TooltipValue } from '../TooltipValue';

import styles from './ClaimModal.module.scss';

type ClaimModalProps = {
  amount: string;
  onSubmit: () => void;
};

export const ClaimModal: FC<ClaimModalProps> = ({ amount, onSubmit }) => {
  const harvestRequestStatus = useShallowSelector(
    uiSelectors.getProp(stakingActionTypes.COMPOUNDER_HARVEST),
  );
  const isGetFreeTokensLoading = useMemo(() => {
    return harvestRequestStatus === RequestStatus.REQUEST;
  }, [harvestRequestStatus]);

  return (
    <div>
      <div className={styles.contentRow}>
        <img src={bitGearTokenIcon} alt="gear token icon" />
      </div>

      <div>
        <div className={styles.infoText}>Available For Receiving</div>
      </div>
      <div className={styles.amountRow}>
        <TooltipValue
          target={<div className={styles.amount}>{numberTransform(amount)}</div>}
          value={amount}
        />
      </div>
      <div className={styles.contentRow}>
        <Button
          classNameCustom={styles.submitBtn}
          variant="blue"
          uppercase={false}
          disabled={isGetFreeTokensLoading}
          onClick={isGetFreeTokensLoading ? undefined : onSubmit}
        >
          {isGetFreeTokensLoading ? 'Loading...' : 'Claim'}
        </Button>
      </div>
    </div>
  );
};
