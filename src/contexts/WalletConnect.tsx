import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { modalActions, userActions, walletActions } from '../redux/actions';
import MetamaskProvider from '../services/Metamask';
import Web3Provider from '../services/Web3Provider';
import { getFromStorage, setToStorage } from '../utils/localStorage';

const walletConnectorContext = createContext<any>({
  web3Provider: {},
});

type TypeModalParams = {
  open: boolean;
  text?: string | React.ReactElement;
  header?: string | React.ReactElement;
  delay?: number;
};

const Connector: React.FC = ({ children }) => {
  const [web3Provider, setWeb3Provider] = React.useState<any>(null);

  const walletType = getFromStorage('walletType');
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const { counter: initCounter, type } = useSelector(({ wallet }: any) => wallet);
  const dispatch = useDispatch();
  const setUserData = React.useCallback((props: any) => dispatch(userActions.setUserData(props)), [
    dispatch,
  ]);
  const toggleModal = React.useCallback(
    (props: TypeModalParams) => dispatch(modalActions.toggleModal(props)),
    [dispatch],
  );
  const setChainId = React.useCallback(
    (props: string) => dispatch(walletActions.setChainId(props)),
    [dispatch],
  );
  // const walletInit = React.useCallback(() => dispatch(walletActions.walletInit()), [dispatch]);

  const login = React.useCallback(
    async (web3: any) => {
      try {
        if (!web3) return;
        const addresses = await web3.connect();
        console.log('login addresses:', addresses);
        const balance = await web3.getBalance(addresses[0]);
        const resultCheckNetwork = await web3.checkNetwork();
        if (resultCheckNetwork.status === 'ERROR') {
          toggleModal({
            open: true,
            text: (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <div>{resultCheckNetwork.message}</div>
              </div>
            ),
          });
        } else {
          console.log('login chainId:', resultCheckNetwork.data);
          setChainId(resultCheckNetwork.data);
        }
        console.log('login balance:', balance);
        setUserData({ address: addresses[0], balance });
      } catch (e) {
        console.error('login:', e);
        setToStorage('walletType', '');
        // init();
        window.location.reload();
      }
    },
    [setUserData, toggleModal, setChainId],
  );

  const init: any = React.useCallback(() => {
    try {
      let web3;
      if (walletType === 'walletConnect') {
        web3 = new Web3Provider();
      } else if (walletType === 'metamask') {
        web3 = new MetamaskProvider();
      }
      if (!web3) return;

      if (walletType !== 'walletConnect') {
        web3.provider.on('accountsChanged', (accounts: string[]) => {
          console.log('Web3Provider accountsChanged:', accounts);
          init();
        });

        web3.provider.on('chainChanged', (chainId: number) => {
          console.log('Web3Provider chainChanged:', chainId);
          init();
        });

        web3.provider.on('disconnect', (code: number, reason: string) => {
          console.log('Web3Provider disconnect:', code, reason);
        });
      }

      login(web3);
      setWeb3Provider(web3);
    } catch (e) {
      console.error('init:', e);
    }
  }, [walletType, login]);

  React.useEffect(() => {
    init();
  }, [initCounter, type, init]);

  return (
    <walletConnectorContext.Provider value={{ web3Provider }}>
      {children}
    </walletConnectorContext.Provider>
  );
};

export default Connector;

export function useWalletConnectorContext() {
  return useContext(walletConnectorContext);
}
