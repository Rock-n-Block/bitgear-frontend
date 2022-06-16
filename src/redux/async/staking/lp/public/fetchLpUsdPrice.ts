import BigNumber from 'bignumber.js/bignumber';

import gearToken from '../../../../../data/gearToken';
import { Web3Provider } from '../../../../../types';
import { contractsHelper } from '../../../../../utils';
import { tokensActions } from '../../../../actions';
import { tokensSelectors } from '../../../../selectors';
import store from '../../../../store';
import { fetchUsdPrice } from '../../../tokens';

type FetchLpUsdPrice = Web3Provider & { lpTokenAddress: string };

/**
 * @see https://www.bscgateway.com/how-to-manually-check-lp-value-bscscan
 * TODO: somehow get rid of this hardcode (fetching only GEAR's symbol, address & usd price)
 */
export const fetchLpUsdPrice = async ({ provider, lpTokenAddress }: FetchLpUsdPrice) => {
  try {
    await fetchUsdPrice({
      symbol: gearToken.symbol,
      tokenAddress: gearToken.address,
    });

    const lpTokenContract = contractsHelper.getLpContract(provider, lpTokenAddress);

    const [totalSupply, token0Address] = await Promise.all([
      lpTokenContract.methods.totalSupply().call(),
      lpTokenContract.methods.token0().call(),
    ]);

    const token0Contract = contractsHelper.getErc20Contract(provider, token0Address);
    const token0BalanceInPair = await token0Contract.methods.balanceOf(lpTokenAddress).call();

    const state = store.getState();
    const gearTokenUsdPrice = tokensSelectors.selectUsdPrice(gearToken.address)(state);

    const lpTokenUsdPrice = new BigNumber(1)
      .dividedBy(totalSupply)
      .multipliedBy(token0BalanceInPair)
      .multipliedBy(gearTokenUsdPrice)
      .toFixed();

    store.dispatch(
      tokensActions.setUsdPrices({
        [lpTokenAddress]: lpTokenUsdPrice,
      }),
    );
  } catch (err) {
    console.log('Redux/Staking/LP/fetchLpUsdPrice', err);
  }
};
