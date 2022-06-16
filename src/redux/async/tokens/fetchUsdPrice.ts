// import { Web3Provider } from '../../../types';
import { CoinMarketCapService } from '../../../services/CoinMarketCap';
// import { contractsHelper } from '../../../utils';
import { tokensActions } from '../../actions';
import store from '../../store';

type FetchUsdPrice = {
  symbol: string;
  tokenAddress: string;
};

export const fetchUsdPrice = async ({ symbol, tokenAddress }: FetchUsdPrice) => {
  try {
    const CoinMarketCap = new CoinMarketCapService();
    const response = await CoinMarketCap.getAllCoinsInfo([symbol], {
      convert: 'USD',
    });

    if (response.status === 'SUCCESS') {
      store.dispatch(
        tokensActions.setUsdPrices({
          [tokenAddress]: response.data[symbol.toUpperCase()].quote.USD.price,
        }),
      );
    }
  } catch (err) {
    console.log('Redux/tokens/fetchUsdPrice', err);
  }
};
