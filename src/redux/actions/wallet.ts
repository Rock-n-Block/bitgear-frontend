import { walletActionTypes } from '../actionTypes';

export default {
  walletInit: () => ({
    type: walletActionTypes.INIT,
  }),
  setWalletType: (payload: string) => ({
    type: walletActionTypes.SET_TYPE,
    payload,
  }),
  setChainId: (payload: string) => ({
    type: walletActionTypes.SET_CHAIN_ID,
    payload,
  }),
};
