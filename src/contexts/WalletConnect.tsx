import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { userActions, walletActions } from '../redux/actions';
import MetamaskProvider from '../services/Metamask';
import Web3Provider from '../services/Web3Provider';

const walletConnectorContext = createContext<any>({
  web3Provider: {},
});

const Connector: React.FC = ({ children }) => {
  const [web3Provider, setWeb3Provider] = React.useState<any>(null);

  const { counter, type } = useSelector(({ wallet }: any) => wallet);
  const dispatch = useDispatch();
  const setUserData = React.useCallback((props: any) => dispatch(userActions.setUserData(props)), [
    dispatch,
  ]);
  const walletInit = React.useCallback(() => dispatch(walletActions.walletInit()), [dispatch]);

  const login = React.useCallback(async () => {
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
  }, [web3Provider, setUserData, walletInit]);

  React.useEffect(() => {
    if (!web3Provider) return;
    console.log('PageLogin useEffect web3Provider:', web3Provider);
    login();
  }, [web3Provider, login]);

  React.useEffect(() => {
    let web3;
    if (type === 'walletConnect') {
      web3 = new Web3Provider();
    } else if (type === 'metamask') {
      web3 = new MetamaskProvider();
    }
    setWeb3Provider(web3);
  }, [counter, type]);

  return (
    <walletConnectorContext.Provider value={{ web3Provider, MetamaskProvider }}>
      {children}
    </walletConnectorContext.Provider>
  );
};

export default Connector;

export function useWalletConnectorContext() {
  return useContext(walletConnectorContext);
}
