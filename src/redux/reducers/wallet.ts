import { WalletState } from '../../types';

const initialState: WalletState = {
  counter: 0,
  type: '',
  chainId: null,
};

export default (state = initialState, params: any): WalletState => {
  switch (params.type) {
    case 'WALLET:INIT': {
      const newState = JSON.parse(
        JSON.stringify({
          ...state,
          ...{ counter: state.counter + 1 },
        }),
      );
      return newState;
    }
    case 'WALLET:SET_TYPE':
      return {
        ...state,
        ...{ type: params.payload },
      };
    case 'WALLET:SET_CHAIN_ID':
      return {
        ...state,
        ...{ chainId: params.payload },
      };
    default:
      return state;
  }
};
