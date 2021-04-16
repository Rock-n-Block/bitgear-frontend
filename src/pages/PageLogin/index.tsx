import React from 'react';
import { Link } from 'react-router-dom';

import CoinbaseWalletLogo from '../../assets/images/logo/coinbase-logo.svg';
import FortmaticLogo from '../../assets/images/logo/fortmatic-logo.svg';
import WalletConnectLogo from '../../assets/images/logo/wallet-connect-logo.svg';

import s from './style.module.scss';

export const PageLogin: React.FC = () => {
  return (
    <div className={s.container}>
      <section className={s.containerTitle}>
        <h1>Connect your wallet</h1>
        <span>Connect with one of available wallet providers or create a new wallet.</span>
      </section>
      <div className={s.login_methods}>
        <Link className={s.login_methods_item} to="/account">
          <img src={FortmaticLogo} alt="Fortmatic logo" />
          <span>Fortmatic</span>
        </Link>
        <Link className={s.login_methods_item} to="/account">
          <img src={WalletConnectLogo} alt="WalletConnect logo" />
          <span>WalletConnect</span>
        </Link>
        <Link className={s.login_methods_item} to="/account">
          <img src={CoinbaseWalletLogo} alt="Coinbase Wallet logo" />
          <span>Coinbase Wallet</span>
        </Link>
      </div>
    </div>
  );
};
