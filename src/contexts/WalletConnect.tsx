import {
  createContext,
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { modalActions, userActions, walletActions } from '../redux/actions';
import { walletSelectors } from '../redux/selectors';
import MetamaskProvider from '../services/Metamask';
import Web3Provider from '../services/Web3Provider';
import { UserState } from '../types';
import { getFromStorage, setToStorage } from '../utils/localStorage';

type WalletConnectorContext = {
  web3Provider: Web3Provider | MetamaskProvider;
};

const walletConnectorContext = createContext<WalletConnectorContext>({
  web3Provider: new Web3Provider(),
});

type TypeModalParams = {
  open: boolean;
  text?: string | ReactElement;
  header?: string | ReactElement;
  delay?: number;
};

const Connector: FC = ({ children }) => {
  const [web3Provider, setWeb3Provider] = useState<WalletConnectorContext['web3Provider']>(
    new Web3Provider(),
  );

  const walletType = getFromStorage('walletType');
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const { counter: initCounter, type } = useSelector(walletSelectors.selectWallet);
  const dispatch = useDispatch();
  const setUserData = useCallback(
    (props: Partial<UserState>) => dispatch(userActions.setUserData(props)),
    [dispatch],
  );
  const toggleModal = useCallback(
    (props: TypeModalParams) => dispatch(modalActions.toggleModal(props)),
    [dispatch],
  );
  const setChainId = useCallback(
    (props: string) => dispatch(walletActions.setChainId(props)),
    [dispatch],
  );

  const login = useCallback(
    async (web3: Web3Provider | MetamaskProvider) => {
      try {
        if (!web3) return;
        const [connectedWalletAddress] = await web3.connect();
        console.log('login address:', connectedWalletAddress);
        const balance = await web3.getBalance(connectedWalletAddress);
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
          console.log('login balance:', balance);
          setUserData({ address: connectedWalletAddress, balance });
        }
      } catch (e) {
        console.error('login:', e);
        setToStorage('walletType', '');
        window.location.reload();
      }
    },
    [setUserData, toggleModal, setChainId],
  );

  const init = useCallback(() => {
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

  useEffect(() => {
    init();
  }, [initCounter, type, init]);

  return (
    <walletConnectorContext.Provider value={{ web3Provider }}>
      {children}
    </walletConnectorContext.Provider>
  );
};

export default Connector;

export function useWalletConnectorContext(): WalletConnectorContext {
  return useContext(walletConnectorContext);
}
