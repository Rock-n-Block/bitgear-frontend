import axios from 'axios';

import config from '../config';

export class CovalentService {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.apis.covalent,
    });
  }

  getTokens = async () => {
    try {
      const url = `/1/networks/uniswap_v2/assets/`;
      const result = await this.axios.get(url);
      console.log('CovalentService getTokens:', result);
      if (result.data.Response === 'Error') return { status: 'ERROR', data: result.data };
      return { status: 'SUCCESS', data: result.data };
    } catch (e) {
      console.error('CovalentService getTokens:', e);
      return { status: 'ERROR', data: undefined, error: JSON.parse(JSON.stringify(e)) };
    }
  };
}
