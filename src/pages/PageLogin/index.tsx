import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import CoinbaseWalletLogo from '../../assets/images/logo/coinbase-logo.svg';
import FortmaticLogo from '../../assets/images/logo/fortmatic-logo.svg';
import WalletConnectLogo from '../../assets/images/logo/wallet-connect-logo.svg';
import { userActions, walletActions } from '../../redux/actions';
import { useWalletConnectorContext } from '../../services/WalletConnect';

import s from './style.module.scss';

export const PageLogin: React.FC = () => {
  const { web3Provider } = useWalletConnectorContext();

  const { address: userAddress } = useSelector(({ user }: any) => user);
  const dispatch = useDispatch();
  const setUserData = (props: any) => dispatch(userActions.setUserData(props));
  const walletInit = () => dispatch(walletActions.walletInit());

  const handleWalletConnectLogin = async () => {
    try {
      const addresses = await web3Provider.connect();
      console.log('handleWalletConnectLogin addresses:', addresses);
      const balance = await web3Provider.getBalance(addresses[0]);
      console.log('handleWalletConnectLogin balance:', balance);
      setUserData({ address: addresses[0], balance });
    } catch (e) {
      console.error('handleWalletConnectLogin:', e);
      walletInit();
    }
  };

  React.useEffect(() => {
    if (!web3Provider) return;
    console.log('PageLogin useEffect web3Provider:', web3Provider);
  }, [web3Provider]);

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
      </div>
    </div>
  );
};
