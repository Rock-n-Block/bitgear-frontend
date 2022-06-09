import Web3 from 'web3';

import config, { mapChainIdToRpc } from '../config';
import { userSelectors } from '../redux/selectors';
import store from '../redux/store';

export const getWeb3 = () => {
  const { chainIds, IS_PRODUCTION } = config;
  const { network } = userSelectors.getUser(store.getState());
  const chainIdsByType = chainIds[IS_PRODUCTION ? 'mainnet' : 'testnet'];
  const rpcUrl = mapChainIdToRpc[chainIdsByType[network].id[0] as number];
  const web3 = new Web3(rpcUrl);
  return web3;
};
