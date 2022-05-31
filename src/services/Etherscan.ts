import axios from 'axios';
import qs from 'query-string';

import config from '../config';

export class EtherscanService {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.apis.etherscan,
    });
  }

  getAbi = async (address: string) => {
    try {
      const props = {
        module: 'contract',
        action: 'getabi',
        apikey: process.env.REACT_APP_ETHERSCAN_KEY,
        address,
      };
      const url = `?${qs.stringify(props)}`;
      const result = await this.axios.get(url);
      // console.log('EtherscanService getAbi:', result);
      if (result.data.status === '0')
        return {
          status: 'ERROR',
          data: result.data.message,
        };
      return {
        status: 'SUCCESS',
        data: JSON.parse(result.data.result),
      };
    } catch (e: any) {
      // console.error(e);
      return { status: 'ERROR', data: undefined, error: e.response.data };
    }
  };

  getGasPrice = async () => {
    try {
      const props = {
        module: 'gastracker',
        action: 'gasoracle',
        apikey: process.env.REACT_APP_ETHERSCAN_KEY,
      };
      const url = `?${qs.stringify(props)}`;
      const result = await this.axios.get(url);
      console.log('EtherscanService getGasPrice:', result);
      if (result.data.status === '0')
        return {
          status: 'ERROR',
          data: result.data.message,
        };
      return {
        status: 'SUCCESS',
        data: +result.data.result.ProposeGasPrice,
      };
    } catch (e: any) {
      // console.error(e);
      if (e.response) {
        return { status: 'ERROR', data: undefined, error: e.response.data };
      }
      return { status: 'ERROR', data: undefined, error: '' };
    }
  };
}
