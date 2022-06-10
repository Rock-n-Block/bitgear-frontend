import { FC } from 'react';
import cn from 'classnames';

import { bigGear } from '../../../../../assets/images';
import { NoConnectWalletPlaceholder } from '../../NoConnectWalletPlaceholder';

import styles from './Banner.module.scss';

export const Banner: FC = () => {
  return (
    <div className={cn(styles.container)}>
      <div className={styles.bannerLogicContainer}>
        <div>
          <h1 className={styles.h1}>FARM</h1>
          <h2 className={styles.h2}>Start farming platform rewards today.</h2>
        </div>
        <p className={styles.text}>Stake, Farm, LP, Earn. No fees, no locks!</p>
        <div>
          <div className={styles.buttonContainer}>
            <NoConnectWalletPlaceholder />
          </div>
        </div>
      </div>
      <img className={styles.gear} src={bigGear} alt="big gear" />
    </div>
  );
};
