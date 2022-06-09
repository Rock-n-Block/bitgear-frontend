const initialState = {
  open: false,
  text: '',
  header: '',
  delay: null,
  classes: null, // to customize Modal's appearance
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case 'MODAL:TOGGLE':
      return {
        ...state,
        ...payload,
      };
    case 'MODAL:CLOSE':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
