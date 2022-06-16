import { combineReducers } from 'redux';

import zx from './0x';
import modal from './modal';
import staking from './staking';
import status from './status';
import table from './table';
import tokens from './tokens';
import ui from './ui';
import user from './user';
import wallet from './wallet';

export default combineReducers({
  user,
  wallet,
  zx,
  modal,
  status,
  table,
  ui,
  staking,
  tokens,
});
