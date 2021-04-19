import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

import Web3Provider from './Web3Provider';

const walletConnectorContext = createContext<any>({
  web3Provider: {},
});

const Connector: React.FC = ({ children }) => {
  const [provider, setProvider] = React.useState<any>(null);

  const { counter } = useSelector(({ wallet }: any) => wallet);

  React.useEffect(() => {
    const web3 = new Web3Provider();
    setProvider(web3);
  }, [counter]);

  return (
    <walletConnectorContext.Provider value={{ web3Provider: provider }}>
      {children}
    </walletConnectorContext.Provider>
  );
};

export default Connector;

export function useWalletConnectorContext() {
  return useContext(walletConnectorContext);
}
