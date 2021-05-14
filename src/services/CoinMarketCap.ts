import axios from 'axios';

import config from '../config';

type getTwoCoinsProps = {
  symbolOne: string;
  symbolTwo: string;
};

export class CoinMarketCapService {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.apis.coinMarketCap,
    });
  }

  getTwoCoinsInfo = async ({ symbolOne, symbolTwo }: getTwoCoinsProps) => {
    try {
      let url;
      if (symbolTwo) {
        url = `/v1/cryptocurrency/quotes/latest?symbol=${symbolOne.toUpperCase()},${symbolTwo.toUpperCase()}`;
      }
      if (!symbolTwo) {
        url = `/v1/cryptocurrency/quotes/latest?symbol=${symbolOne.toUpperCase()}`;
      }
      const result = await this.axios.get(url);
      // console.log('CoinMarketCapService getAllCoins:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data.data,
      };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: undefined };
    }
  };
}
