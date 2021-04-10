import axios from 'axios';

import config from '../config';

type TypeGetPrice = {
  symbolOne?: string;
  symbolTwo?: string;
};

export class CryptoCompareService {
  constructor() {
    axios.defaults.baseURL = config.apis.cryptoCompare;
  }

  getPrice = async ({ symbolOne, symbolTwo }: TypeGetPrice) => {
    const url = `/data/pricemultifull?fsyms=${symbolOne}&tsyms=${symbolTwo}`;
    const result = await axios.get(url);
    if (result.data.Response === 'Error') {
      return { status: 'ERROR', data: undefined };
    }
    return { status: 'SUCCESS', data: result.data };
  };
}
