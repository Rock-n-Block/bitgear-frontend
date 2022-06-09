import { StateWithUIState } from '../../types';

export const uiSelectors = {
  getUI: (state: StateWithUIState) => state.ui,
  getProp: (propKey: string) => (state: StateWithUIState) => state.ui[propKey],
};
