import { StakingState } from './staking';
import { TokensState } from './tokens';
import { UIState } from './ui';
import { UserState } from './user';
import { WalletState } from './wallet';

// TODO: add another store/slices like '0x', 'modal', 'status', 'table' etc.
export type State = {
  user: UserState;
  ui: UIState;
  staking: StakingState;
  tokens: TokensState;
  wallet: WalletState;
};
