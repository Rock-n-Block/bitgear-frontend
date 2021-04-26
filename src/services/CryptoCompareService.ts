import axios from 'axios';
import qs from 'query-string';

import config from '../config';

type TypeGetPriceProps = {
  symbolOne: string;
  symbolTwo: string;
};

type TypeGetHistoryProps = {
  symbolOne: string;
  symbolTwo: string;
  limit?: number;
  aggregate?: number;
  exchange?: string;
};

export class CryptoCompareService {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.apis.cryptoCompare,
      headers: { authorization: config.keys.cryptoCompare },
    });
  }

  getAllCoins = async () => {
    try {
      const url = `/data/all/coinlist&api_key=${config.keys.cryptoCompare}`;
      const result = await this.axios.get(url);
      // console.log('CryptoCompareService getAllCoins:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data.Data,
      };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: undefined };
    }
  };

  getMarketData = async ({ symbolOne, symbolTwo }: TypeGetPriceProps) => {
    try {
      const url = `/data/pricemultifull?fsyms=${symbolOne.toUpperCase()}&tsyms=${symbolTwo.toUpperCase()}&api_key=${
        config.keys.cryptoCompare
      }`;
      const result = await this.axios.get(url);
      // console.log('CryptoCompareService getMarketData:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data.RAW[symbolOne.toUpperCase()][symbolTwo.toUpperCase()],
      };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: undefined };
    }
  };

  getExchangeOfPair = async ({ symbolOne, symbolTwo }: TypeGetPriceProps) => {
    try {
      const url = `/data/v2/pair/mapping/fsym?fsym=${symbolOne.toUpperCase()}&api_key=${
        config.keys.cryptoCompare
      }`;
      const result = await this.axios.get(url);
      if (result.data.Response === 'Error') {
        console.error('CryptoCompareService getPairMapping:', result);
        return { status: 'ERROR', data: undefined };
      }
      const mapping = result.data.Data.current;
      let exchanges = mapping.filter((item: any) => item.tsym === symbolTwo);
      exchanges = exchanges.map((item: any) => item.exchange);
      console.log('CryptoCompareService getPairMapping:', exchanges);
      return {
        status: 'SUCCESS',
        data: exchanges,
      };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: undefined };
    }
  };

  getHistory = async ({
    symbolOne,
    symbolTwo,
    limit,
    aggregate,
    exchange,
  }: TypeGetHistoryProps) => {
    try {
      let e = exchange;
      const exchanges = await this.getExchangeOfPair({ symbolOne, symbolTwo });
      if (exchanges.status === 'SUCCESS') {
        [e] = exchanges.data;
      }
      const query = qs.stringify({
        fsym: symbolOne.toUpperCase(),
        tsym: symbolTwo.toUpperCase(),
        limit,
        aggregate,
        e,
        api_key: config.keys.cryptoCompare,
      });
      const result = await this.axios.get(`/data/v2/histoday?${query}`);
      if (result.data.Response === 'Error') {
        console.log('CryptoCompareService getHistory:', result);
        return { status: 'ERROR', data: undefined };
      }
      return { status: 'SUCCESS', data: result.data.Data.Data };
    } catch (error) {
      console.error('CryptoCompareService getHistory:', error);
      return { status: 'ERROR', data: undefined };
    }
  };
}
