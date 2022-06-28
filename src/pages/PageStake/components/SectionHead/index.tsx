import { FC, ReactNode } from 'react';
import cn from 'classnames';

import { bitGearTokenIcon, compounderBlueVariantIcon } from '../../../../assets/icons';
import { ReactComponent as EthIconSvg } from '../../../../assets/icons/tokens/eth.svg';
import { SkeletonLoader } from '../../../../components';
import { getFormattedValue, numberTransform } from '../../../../utils';
import { TooltipValue } from '../TooltipValue';

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
  isLoading: boolean;
};

export const SectionHead: FC<SectionHeadProps> = ({
  title,
  isCompounder = false,
  stakeToken,
  earnToken,
  totalStaked,
  performance,
  isLoading,
}) => {
  const isStakeLpToken = stakeToken.includes('-');
  return (
    <div className={styles.sectionHead}>
      <div
        className={cn(styles.sectionHeadLogo, {
          [styles.sectionHeadLogoLp]: isStakeLpToken,
        })}
      >
        {isCompounder ? (
          <>
            <img src={compounderBlueVariantIcon} alt="compounder icon" />
            <img
              className={cn(styles.pairedToken, styles.pairedTokenStake)}
              src={bitGearTokenIcon}
              alt="gear token icon"
            />
          </>
        ) : isStakeLpToken ? (
          <>
            <img src={bitGearTokenIcon} alt="gear token icon" />
            <EthIconSvg className={cn(styles.pairedToken)} />
          </>
        ) : (
          <img src={bitGearTokenIcon} alt="gear token icon" />
        )}
      </div>
      <div className={styles.sectionHeadInfo}>
        <div className={styles.sectionHeadInfoTitle}>{title}</div>
        {isStakeLpToken ? (
          <div className={styles.sectionHeadInfoSubtitle}>
            Stake <span>LP tokens</span> to double your reward
          </div>
        ) : isCompounder ? (
          <>
            <div className={styles.sectionHeadInfoSubtitle}>
              Stake <span>{stakeToken}</span> <div>|</div> Earn {earnToken}
            </div>
            <div className={styles.sectionHeadInfoDescription}>
              {earnToken} rewards auto compound into more {stakeToken}!
            </div>
          </>
        ) : (
          <>
            <div className={styles.sectionHeadInfoSubtitle}>
              Stake <span>{stakeToken}</span> to earn more and more {earnToken}
            </div>
          </>
        )}
        <TooltipValue
          // eslint-disable-next-line prettier/prettier
          target={(
            <div className={styles.sectionHeadInfoAdditional}>
              {`Total ${isStakeLpToken ? `LP ${stakeToken.split('-')[0]}` : stakeToken} staked: `}
              {isLoading ? (
                <SkeletonLoader width="150px" height="18px" borderRadius="4px" />
              ) : (
                <>
                  {numberTransform(totalStaked.token)} (${getFormattedValue(totalStaked.usd)})
                </>
              )}
            </div>
            // eslint-disable-next-line prettier/prettier
          )}
          // eslint-disable-next-line prettier/prettier
          value={(
            <div className={styles.sectionHeadInfoAdditional}>
              Total {stakeToken} staked: {totalStaked.token} ($
              {getFormattedValue(totalStaked.usd)})
            </div>
            // eslint-disable-next-line prettier/prettier
          )}
        />
        <div className={styles.sectionHeadInfoPerformance}>{performance}</div>
      </div>
    </div>
  );
};
