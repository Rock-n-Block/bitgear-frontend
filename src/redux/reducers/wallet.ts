const initialState = {
  counter: 0,
};

export default (state = initialState, params: any) => {
  switch (params.type) {
    case 'WALLET:INIT':
      // eslint-disable-next-line no-case-declarations
      const newState = JSON.parse(
        JSON.stringify({
          ...state,
          ...{ counter: state.counter + 1 },
        }),
      );
      return newState;
    default:
      return state;
  }
};
