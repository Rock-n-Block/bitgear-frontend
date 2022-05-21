import { State, UserState } from '../../types';

export const userSelectors = {
  getUser: (state: State): UserState => state.user,
};
