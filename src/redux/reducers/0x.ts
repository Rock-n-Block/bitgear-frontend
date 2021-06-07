const initialState = {
  tokens: [],
  tokensByAddress: null,
};

export default (state = initialState, params: any) => {
  switch (params.type) {
    case 'ZX:SET_TOKENS':
      // eslint-disable-next-line no-case-declarations
      return JSON.parse(
        JSON.stringify({
          ...state,
          ...params.payload,
        }),
      );
    case 'ZX:SET_TOKENS_BY_ADDRESS':
      // eslint-disable-next-line no-case-declarations
      return JSON.parse(
        JSON.stringify({
          ...state,
          ...params.payload,
        }),
      );
    default:
      return state;
  }
};
