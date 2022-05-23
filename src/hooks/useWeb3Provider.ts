import { useMemo } from 'react';
import Web3 from 'web3';

import { useWalletConnectorContext } from '../contexts/WalletConnect';
import { getWeb3 } from '../utils';

type UseWeb3ProviderReturnType = { web3Provider: Web3 };

export const useWeb3Provider = (): UseWeb3ProviderReturnType => {
  const { web3Provider: web3ProviderFromContext } = useWalletConnectorContext();
  const web3Provider = useMemo(() => {
    if (web3ProviderFromContext) return web3ProviderFromContext.web3Provider();
    return getWeb3();
  }, [web3ProviderFromContext]);
  return { web3Provider };
};
