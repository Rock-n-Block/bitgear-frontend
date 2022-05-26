import React from 'react';
import cn from 'classnames';

import { arrowSquareOutIcon, plusCircleIcon } from '../../../../assets/icons';
import { bigGear } from '../../../../assets/images';
import { Button } from '../../../../components';
import gearToken from '../../../../data/gearToken';
import { useShallowSelector } from '../../../../hooks';
import { userSelectors } from '../../../../redux/selectors';
import { addTokenToWallet, constructSwapUrl } from '../../../../utils';

import styles from './Banner.module.scss';

interface BannerProps {
  apy: string | number;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({ apy, className }) => {
  const handleAddToken = () => {
    addTokenToWallet({
      address: gearToken.address,
      symbol: gearToken.symbol,
      decimals: gearToken.decimals,
      image: gearToken.image,
    });
  };
  const { network } = useShallowSelector(userSelectors.getUser);

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.bannerLogicContainer}>
        <div>
          <h2 className={styles.h2}>Staking</h2>
          <h1 className={styles.h1}>{Number.isNaN(apy) ? '' : apy}%</h1>
        </div>
        <p>Earn crypto just by staking, trading and listing. Bitgear Rewarding.</p>
        <div className={styles.buttonContainer}>
          <Button variant="outlined" icon={arrowSquareOutIcon} uppercase={false}>
            <a
              href={constructSwapUrl(gearToken.address, network)}
              target="_blank"
              rel="noreferrer noopener"
            >
              Buy {gearToken.symbol}
            </a>
          </Button>
          {window.ethereum && (
            <Button variant="blue" icon={plusCircleIcon} uppercase={false} onClick={handleAddToken}>
              Add to Wallet
            </Button>
          )}
        </div>
      </div>
      <img className={styles.gear} src={bigGear} alt="big gear" />
    </div>
  );
};
