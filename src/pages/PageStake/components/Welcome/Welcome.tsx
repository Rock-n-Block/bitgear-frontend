import { FC } from 'react';
import cn from 'classnames';

import { bitGearTokenIcon, compounderBlueVariantIcon } from '../../../../assets/icons';
import { ReactComponent as EthIconSvg } from '../../../../assets/icons/tokens/eth.svg';

import { Banner, WelcomeFooter } from './components';

import styles from './Welcome.module.scss';

const mock = [
  {
    icons: [
      bitGearTokenIcon,
      <EthIconSvg className={cn(styles.infoContainerIcon, styles.pairedToken)} />,
    ],
    header: 'LP Staking',
    body: `LP Staking is our top tier rewards program.

    By providing liquidity you earn the most platform fees and rewards by a large margin. Highest possible rewards and most platform fees are reserved for LP Stakers. `,
    type: 'LP',
  },
  {
    icon: bitGearTokenIcon,
    header: 'Compounder',
    body: `Compounding means we do the work for you.
    Automatically re-stake your idle assets for maximum efficiency and APR on your eligible crypto holdings.`,
    type: 'compounder',
  },
  {
    icon: bitGearTokenIcon,
    header: 'Staking',
    body: `Staking gives you the power to earn rewards on your crypto holdings.
    Stake your assets now to earn platform fees and staking rewards with just a few clicks.
    You can unstake anytime with no penalties!`,
    type: 'regular',
  },
];

export const Welcome: FC = () => {
  return (
    <>
      <div className={styles.container}>
        <Banner />

        <div className={styles.section}>
          {mock.map(({ type, header, body, icons = [], icon }) => {
            return (
              <div key={header} className={styles.infoContainer}>
                {type === 'LP' && (
                  <div className={styles.infoContainerIcons}>
                    {typeof icons[0] === 'string' ? (
                      <img className={styles.infoContainerIcon} src={icons[0]} alt="token 1" />
                    ) : (
                      icons[0]
                    )}
                    {typeof icons[1] === 'string' ? (
                      <img className={styles.infoContainerIcon} src={icons[1]} alt="token 2" />
                    ) : (
                      icons[1]
                    )}
                  </div>
                )}
                {type === 'compounder' && (
                  <div className={styles.infoContainerIcons}>
                    <img
                      className={styles.infoContainerIcon}
                      src={compounderBlueVariantIcon}
                      alt="compounder icon"
                    />
                    <img
                      className={cn(styles.infoContainerIcon, styles.compounderToken)}
                      src={icon}
                      alt="token"
                    />
                  </div>
                )}
                {type === 'regular' && (
                  <div className={styles.infoContainerIcons}>
                    <img className={styles.infoContainerIcon} src={icon} alt="token icon" />
                  </div>
                )}
                <div className={styles.infoContainerHeader}>{header}</div>
                <div className={styles.infoContainerBody}>{body}</div>
              </div>
            );
          })}
        </div>
      </div>
      <WelcomeFooter />
    </>
  );
};
