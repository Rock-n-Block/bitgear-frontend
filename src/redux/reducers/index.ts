import { combineReducers } from 'redux';

import zx from './0x';
import user from './user';
import wallet from './wallet';

export default combineReducers({
  user,
  wallet,
  zx,
});
