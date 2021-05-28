const initialState = {
  loadingBalances: 'false',
  messageYouPay: null,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case 'STATUS:SET_STATUS':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
