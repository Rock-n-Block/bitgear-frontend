import React from 'react';
import cn from 'classnames';

import { arrowSquareOutIcon, plusCircleIcon } from '../../../../assets/icons';
import { bigGear } from '../../../../assets/images';
import { Button } from '../../../../components';
import config from '../../../../config';
import gearEthLPToken from '../../../../data/gearEthLPToken';
import gearToken from '../../../../data/gearToken';
import wethToken from '../../../../data/wethToken';
import { useShallowSelector } from '../../../../hooks';
import { userSelectors } from '../../../../redux/selectors';
import { constructAddLiquidityUrl, constructSwapUrl, Token } from '../../../../utils';

import styles from './Banner.module.scss';

interface BannerProps {
  apy: string | number;
  onGetFreeTokens: () => void;
  onAddToWallet: (token: Token) => void;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  apy,
  onGetFreeTokens,
  onAddToWallet,
  className,
}) => {
  const { network } = useShallowSelector(userSelectors.getUser);

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.bannerLogicContainer}>
        <div>
          <h2 className={styles.h2}>Staking</h2>
          <h1 className={styles.h1}>{Number.isNaN(apy) ? '' : apy}%</h1>
        </div>
        <p>Earn crypto just by staking, trading and listing. Bitgear Rewarding.</p>
        <div>
          <div className={styles.buttonContainer}>
            <a
              className={styles.buttonContainerItem}
              href={constructSwapUrl(gearToken.address, network)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Button
                classNameCustom={styles.buttonContainerItem}
                variant="outlined"
                icon={arrowSquareOutIcon}
                uppercase={false}
              >
                Buy {gearToken.symbol}
              </Button>
            </a>

            <a
              className={styles.buttonContainerItem}
              href={constructAddLiquidityUrl(gearToken.address, wethToken.address, network, {
                chain: config.netType,
              })}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Button
                classNameCustom={styles.buttonContainerItem}
                variant="outlined"
                icon={arrowSquareOutIcon}
                uppercase={false}
              >
                Get LP Token
              </Button>
            </a>
          </div>

          <div className={styles.buttonContainer}>
            <Button
              classNameCustom={styles.buttonContainerItem}
              variant="blue"
              uppercase={false}
              onClick={onGetFreeTokens}
            >
              Get free tokens
            </Button>
            {window.ethereum && (
              <Button
                classNameCustom={styles.buttonContainerItem}
                variant="blue"
                icon={plusCircleIcon}
                uppercase={false}
                onClick={() => onAddToWallet(gearToken)}
              >
                Add {gearToken.symbol} to Wallet
              </Button>
            )}
          </div>

          <div className={styles.buttonContainer}>
            {window.ethereum && (
              <Button
                classNameCustom={styles.buttonContainerItem}
                variant="outlined"
                uppercase={false}
                onClick={() => onAddToWallet(gearEthLPToken)}
              >
                Add LP {gearEthLPToken.symbol} to Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
      <img className={styles.gear} src={bigGear} alt="big gear" />
    </div>
  );
};
