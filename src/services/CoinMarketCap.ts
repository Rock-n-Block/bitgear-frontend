import axios from 'axios';
import qs from 'query-string';

import config from '../config';

type TypeGetCoinInfoProps = {
  id?: number;
  symbol?: string;
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

  getAllCoins = async () => {
    try {
      const url = `/v1/cryptocurrency/map?aux=platform,is_active`;
      const result = await this.axios.get(url);
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

  getCoinInfo = async (props: TypeGetCoinInfoProps) => {
    try {
      const url = `/v1/cryptocurrency/info?${qs.stringify(props)}`;
      const result = await this.axios.get(url);
      console.log('CoinMarketCapService getCoinInfo:', result);
      if (result.data.Response === 'Error') return { status: 'ERROR', data: result.data };
      return {
        status: 'SUCCESS',
        data: result.data.data,
      };
      return { status: 'ERROR', data: undefined };
    } catch (e) {
      console.error('CoinMarketCapService getCoinInfo:', e);
      return { status: 'ERROR', data: undefined, error: JSON.parse(JSON.stringify(e)) };
    }
  };

  getTwoCoinsInfo = async ({ symbolOne, symbolTwo }: getTwoCoinsProps) => {
    try {
      if (!symbolOne) return { status: 'ERROR', data: undefined };
      let url;
      if (symbolTwo) {
        url = `/v1/cryptocurrency/quotes/latest?symbol=${symbolOne.toUpperCase()},${symbolTwo.toUpperCase()}`;
      }
      if (!symbolTwo) {
        url = `/v1/cryptocurrency/quotes/latest?symbol=${symbolOne.toUpperCase()}`;
      }
      const result = await this.axios.get(url);
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
      const url = `/v1/cryptocurrency/quotes/latest?symbol=${symbolsList}&skip_invalid=true`;
      const result = await this.axios.get(url);
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

  getAllCoinsInfoByIds = async (ids: number[]) => {
    try {
      const url = `/v1/cryptocurrency/quotes/latest?id=${ids}&skip_invalid=true`;
      const result = await this.axios.get(url);
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

  getAllCoinsHistoryDay = async (symbolsList: string[]) => {
    try {
      const url = `/v1/cryptocurrency/ohlcv/historical?symbol=${symbolsList}&time_period=hourly&count=10&interval=2h&skip_invalid=true`;
      const result = await this.axios.get(url);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data,
      };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: undefined };
    }
  };

  getHistoryDayForPair = async ({ symbolOne, symbolTwo }: getTwoCoinsProps) => {
    try {
      const url = `/v1/cryptocurrency/ohlcv/historical?symbol=${symbolOne}&convert=${symbolTwo}&time_period=hourly&count=24&interval=1h`;
      const result = await this.axios.get(url);
      console.log('CoinMarketCapService getHistoryDayForPair:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data.data.quotes,
      };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: undefined };
    }
  };

  getHistoryWeekForPair = async ({ symbolOne, symbolTwo }: getTwoCoinsProps) => {
    try {
      const url = `/v1/cryptocurrency/ohlcv/historical?symbol=${symbolOne}&convert=${symbolTwo}&time_period=hourly&count=84&interval=2h`;
      const result = await this.axios.get(url);
      console.log('CoinMarketCapService getHistoryWeekForPair:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data.data.quotes,
      };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: undefined };
    }
  };

  getHistoryMonthForPair = async ({ symbolOne, symbolTwo }: getTwoCoinsProps) => {
    try {
      const url = `/v1/cryptocurrency/ohlcv/historical?symbol=${symbolOne}&convert=${symbolTwo}&time_period=hourly&count=118&interval=6h`;
      const result = await this.axios.get(url);
      console.log('CoinMarketCapService getHistoryMonthForPair:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data.data.quotes,
      };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: undefined };
    }
  };
}
