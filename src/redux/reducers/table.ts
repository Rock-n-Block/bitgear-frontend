const initialState = {
  data: [],
};

export default (state = initialState, params: any) => {
  switch (params.type) {
    case 'TABLE:SET_DATA':
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
