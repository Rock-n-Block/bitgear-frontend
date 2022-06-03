import { State, WalletState } from '../../types';

const selectWallet = (state: State): WalletState => state.wallet;

export const walletSelectors = {
  selectWallet,
};
