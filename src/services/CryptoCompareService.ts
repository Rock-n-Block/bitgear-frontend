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
  constructor() {
    axios.defaults.baseURL = config.apis.cryptoCompare;
  }

  getMarketData = async ({ symbolOne, symbolTwo }: TypeGetPriceProps) => {
    try {
      const url = `/data/pricemultifull?fsyms=${symbolOne.toUpperCase()}&tsyms=${symbolTwo.toUpperCase()}`;
      const result = await axios.get(url);
      console.log('CryptoCompareService getMarketData:', result);
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

  getHistory = async ({
    symbolOne,
    symbolTwo,
    limit,
    aggregate,
    exchange,
  }: TypeGetHistoryProps) => {
    try {
      const query = qs.stringify({
        fsym: symbolOne.toUpperCase(),
        tsym: symbolTwo.toUpperCase(),
        limit,
        aggregate,
        exchange,
      });
      const result = await axios.get(`/data/v2/histoday?${query}`);
      console.log('CryptoCompareService getHistory:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return { status: 'SUCCESS', data: result.data.Data.Data };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: undefined };
    }
  };
}
