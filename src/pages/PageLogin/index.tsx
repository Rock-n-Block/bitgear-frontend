import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import CoinbaseWalletLogo from '../../assets/images/logo/coinbase-logo.svg';
import FortmaticLogo from '../../assets/images/logo/fortmatic-logo.svg';
import MetamaskLogo from '../../assets/images/logo/metamask-logo.svg';
import WalletConnectLogo from '../../assets/images/logo/wallet-connect-logo.svg';
import { walletActions } from '../../redux/actions';

import s from './style.module.scss';

export const PageLogin: React.FC = () => {
  const { address: userAddress } = useSelector(({ user }: any) => user);
  const dispatch = useDispatch();
  const setWalletType = (props: string) => dispatch(walletActions.setWalletType(props));

  const handleMetamaskLogin = async () => {
    setWalletType('metamask');
  };

  const handleWalletConnectLogin = async () => {
    setWalletType('walletConnect');
  };

  React.useEffect(() => {
    console.log('PageLogin useEffect userAddress:', userAddress);
  }, [userAddress]);

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
        <div
          role="button"
          tabIndex={0}
          className={s.login_methods_item}
          onClick={handleWalletConnectLogin}
          onKeyDown={() => {}}
        >
          <img src={WalletConnectLogo} alt="WalletConnect logo" />
          <span>WalletConnect</span>
        </div>
        <Link className={s.login_methods_item} to="/account">
          <img src={CoinbaseWalletLogo} alt="Coinbase Wallet logo" />
          <span>Coinbase Wallet</span>
        </Link>
        <div
          role="button"
          tabIndex={0}
          className={s.login_methods_item}
          onClick={handleMetamaskLogin}
          onKeyDown={() => {}}
        >
          <img src={MetamaskLogo} alt="Metamask logo" />
          <span>Metamask Wallet</span>
        </div>
      </div>
    </div>
  );
};
