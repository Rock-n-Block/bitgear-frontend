export default {
  walletInit: () => ({
    type: 'WALLET:INIT',
  }),
  setWalletType: (payload: string) => ({
    type: 'WALLET:SET_TYPE',
    payload,
  }),
  setChainId: (payload: string) => ({
    type: 'WALLET:SET_CHAIN_ID',
    payload,
  }),
};
