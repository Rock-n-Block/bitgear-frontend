import { StakingState } from './staking';
import { TokensState } from './tokens';
import { UIState } from './ui';
import { UserState } from './user';

// TODO: add another store/slices like '0x', 'modal', 'status', 'table' etc.
export type State = {
  user: UserState;
  ui: UIState;
  staking: StakingState;
  tokens: TokensState;
};
