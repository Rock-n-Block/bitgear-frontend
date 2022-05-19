import { FC, ReactNode } from 'react';

import { bitGearTokenIcon, compounderIcon } from '../../../../assets/icons';

import styles from './SectionHead.module.scss';

type SectionHeadProps = {
  title: string;
  isCompounder?: boolean;
  stakeToken: string;
  earnToken: string;
  totalStaked: {
    token: string;
    usd: string;
  };
  performance: ReactNode;
};

export const SectionHead: FC<SectionHeadProps> = ({
  title,
  isCompounder = false,
  stakeToken,
  earnToken,
  totalStaked,
  performance,
}) => {
  return (
    <div className={styles.sectionHead}>
      <div className={styles.sectionHeadLogo}>
        {isCompounder ? (
          <>
            <img src={compounderIcon} alt="compounder icon" />
            <img className={styles.pairedToken} src={bitGearTokenIcon} alt="gear token icon" />
          </>
        ) : (
          <img src={bitGearTokenIcon} alt="gear token icon" />
        )}
      </div>
      <div className={styles.sectionHeadInfo}>
        <div className={styles.sectionHeadInfoTitle}>{title}</div>
        <div className={styles.sectionHeadInfoSubtitle}>
          Stake <span>{stakeToken}</span> <div>|</div> Earn{' '}
          {isCompounder ? earnToken : `${stakeToken} & ${earnToken}`}
        </div>
        <div className={styles.sectionHeadInfoDescription}>
          {earnToken} rewards auto compound into more {stakeToken}!
        </div>
        <div className={styles.sectionHeadInfoAdditional}>
          Total {stakeToken} staked: {totalStaked.token} (${totalStaked.usd})
        </div>
        <div className={styles.sectionHeadInfoPerformance}>{performance}</div>
      </div>
    </div>
  );
};
