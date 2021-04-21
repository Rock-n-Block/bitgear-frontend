const initialState = {
  tokens: [],
};

export default (state = initialState, params: any) => {
  switch (params.type) {
    case 'ZX:SET_TOKENS':
      // eslint-disable-next-line no-case-declarations
      const newState = JSON.parse(
        JSON.stringify({
          ...state,
          ...params.payload,
        }),
      );
      return newState;
    default:
      return state;
  }
};
