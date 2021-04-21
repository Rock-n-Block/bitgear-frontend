const initialState = {
  open: '',
  text: '',
  header: '',
  delay: null,
};

export default (state = initialState, params: any) => {
  switch (params.type) {
    case 'MODAL:TOGGLE':
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
