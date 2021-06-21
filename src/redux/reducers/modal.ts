const initialState = {
  open: '',
  text: '',
  header: '',
  delay: null,
};

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
    case 'MODAL:TOGGLE':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
