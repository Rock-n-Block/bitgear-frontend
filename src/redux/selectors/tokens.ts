import { State, TokensState } from '../../types';

const selectTokens = (state: State): TokensState => state.tokens;
const selectUsdPrice = (tokenAddress: string) => (state: State) =>
  selectTokens(state).usdPrices[tokenAddress.toLowerCase()] || '';

export const tokensSelectors = {
  selectTokens,
  selectUsdPrice,
};
