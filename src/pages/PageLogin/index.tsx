import qs from 'querystring';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import MetamaskLogo from '../../assets/images/logo/metamask-logo.svg';
import WalletConnectLogo from '../../assets/images/logo/wallet-connect-logo.svg';
import { walletActions } from '../../redux/actions';
import { setToStorage } from '../../utils/localStorage';

import s from './style.module.scss';

export const PageLogin: React.FC = () => {
  const history = useHistory();
  const { search } = useLocation();
  const query = qs.parse(search);
  console.log('PageLogin query:', query);

  const { address: userAddress } = useSelector(({ user }: any) => user);
  const dispatch = useDispatch();
  const setWalletType = (props: string) => dispatch(walletActions.setWalletType(props));

  const handleMetamaskLogin = async () => {
    setToStorage('walletType', 'metamask');
    setWalletType('metamask');
    if (query.back) history.push(`${query.back}`);
    if (query['?back']) history.push(`${query['?back']}`);
  };

  const handleWalletConnectLogin = async () => {
    setToStorage('walletType', 'walletConnect');
    setWalletType('walletConnect');
    if (query.back) history.push(`${query.back}`);
    if (query['?back']) history.push(`${query['?back']}`);
  };

  React.useEffect(() => {
    console.log('PageLogin useEffect userAddress:', userAddress);
  }, [userAddress]);

  return (
    <div className={s.wrapper}>
      <div className="shadowTop" />
      <div className={s.container}>
        <section className={s.containerTitle}>
          <h1>
            Connect your <strong>wallet</strong>
          </h1>
          <span>Connect with one of available wallet providers or create a new wallet.</span>
        </section>
        <div className={s.login_methods}>
          {/* <div */}
          {/*  role="button" */}
          {/*  tabIndex={0} */}
          {/*  className={s.login_methods_item} // TODO change for FORMATIC */}
          {/*  onClick={handleWalletConnectLogin} */}
          {/*  onKeyDown={() => {}} */}
          {/* > */}
          {/*  <img src={FormaticLogo} alt="Formatic logo" /> */}
          {/*  <span>Formatic</span> */}
          {/* </div> */}
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
          {/* <div */}
          {/*  role="button" */}
          {/*  tabIndex={0} */}
          {/*  className={s.login_methods_item} */}
          {/*  onClick={handleMetamaskLogin} // TODO change for Coinbase */}
          {/*  onKeyDown={() => {}} */}
          {/* > */}
          {/*  <img src={CoinbaseLogo} alt="Coinbase logo" /> */}
          {/*  <span>Coinbase wallet</span> */}
          {/* </div> */}
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
    </div>
  );
};
