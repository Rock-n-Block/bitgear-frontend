import axios from 'axios';

import config from '../config';

type TypeGetCoinInfoProps = {
  symbol: string;
};

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

  getCoinInfo = async ({ symbol }: TypeGetCoinInfoProps) => {
    try {
      const newSymbol = symbol.toUpperCase();
      const url = `/v1/cryptocurrency/info?symbol=${newSymbol}`;
      const result = await this.axios.get(url);
      // console.log('CoinMarketCapService getCoinInfo:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data.data[newSymbol],
      };
    } catch (e) {
      console.error('CoinMarketCapService getCoinInfo:', e);
      return { status: 'ERROR', data: undefined };
    }
  };

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
      // console.log('CoinMarketCapService getTwoCoinsCoins:', result);
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

  getAllCoinsInfo = async (symbolsList: string[]) => {
    try {
      const url = `/v1/cryptocurrency/quotes/latest?symbol=${symbolsList}`;
      const result = await this.axios.get(url);
      // console.log('CoinMarketCapService getTwoCoinsCoins:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data.data,
      };
    } catch (e) {
      console.error('CoinMarketCapService getTwoCoinsInfo:', e);
      return { status: 'ERROR', data: undefined };
    }
  };
}
