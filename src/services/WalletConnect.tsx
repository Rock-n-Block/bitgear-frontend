import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

import MetamaskProvider from './Metamask';
import Web3Provider from './Web3Provider';

const walletConnectorContext = createContext<any>({
  web3Provider: {},
});

const Connector: React.FC = ({ children }) => {
  const [provider, setProvider] = React.useState<any>(null);

  const { counter, type } = useSelector(({ wallet }: any) => wallet);

  React.useEffect(() => {
    let web3;
    if (type === 'walletConnect') {
      web3 = new Web3Provider();
    } else if (type === 'metamask') {
      web3 = new MetamaskProvider();
    }
    setProvider(web3);
  }, [counter, type]);

  return (
    <walletConnectorContext.Provider value={{ web3Provider: provider, MetamaskProvider }}>
      {children}
    </walletConnectorContext.Provider>
  );
};

export default Connector;

export function useWalletConnectorContext() {
  return useContext(walletConnectorContext);
}
