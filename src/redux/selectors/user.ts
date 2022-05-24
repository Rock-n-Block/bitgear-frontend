import { State, UserState } from '../../types';

const getUser = (state: State): UserState => state.user;
const selectAllowance =
  (tokenAddress: string, spenderAddress: string) =>
  (state: State): string => {
    const spenderAddresses = getUser(state).allowances[tokenAddress.toLowerCase()];
    if (spenderAddresses) return spenderAddresses[spenderAddress.toLowerCase()] || '';
    return spenderAddresses || '';
  };

export const userSelectors = {
  getUser,
  selectAllowance,
};
