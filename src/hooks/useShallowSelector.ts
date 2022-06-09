import { Selector, shallowEqual, useSelector } from 'react-redux';

/**
 * @see https://react-redux.js.org/api/hooks#equality-comparisons-and-updates
 */
export const useShallowSelector = <State, Type = State>(selector: Selector<State, Type>): Type =>
  useSelector<State, Type>(selector, shallowEqual);
