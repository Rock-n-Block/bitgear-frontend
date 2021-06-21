export default {
  setTokens: (payload: any) => ({
    type: 'ZX:SET_TOKENS',
    payload,
  }),
  setTokensByAddress: (payload: any) => ({
    type: 'ZX:SET_TOKENS_BY_ADDRESS',
    payload,
  }),
};
