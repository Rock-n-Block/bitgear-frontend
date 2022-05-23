import { Chains, UserState } from '../../types';

const initialState: UserState = {
  address: null,
  network: Chains.eth,
  balance: 0,
  balances: {},
  allowances: {},
};

export default (state = initialState, params: any) => {
  switch (params.type) {
    case 'USER:SET_DATA':
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
