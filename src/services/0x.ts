import axios from 'axios';
import qs from 'query-string';

import config from '../config';

type TypeGetQuoteProps = {
  buyToken: string;
  sellToken: string;
  buyAmount: string;
};

export class Service0x {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.apis['0x'],
    });
  }

  getTokens = async () => {
    try {
      const url = `/swap/v1/tokens`;
      const result = await this.axios.get(url);
      // console.log('Service0x getTokens:', result);
      return {
        status: 'SUCCESS',
        data: result.data,
      };
    } catch (e) {
      // console.error(e);
      return { status: 'ERROR', data: undefined, error: e.response.data };
    }
  };

  getQuote = async (props: TypeGetQuoteProps) => {
    try {
      const url = `/swap/v1/quote?${qs.stringify(props)}`;
      const result = await this.axios.get(url);
      // console.log('Service0x getQuote:', result);
      return {
        status: 'SUCCESS',
        data: result.data,
      };
    } catch (e) {
      // console.error(e);
      return { status: 'ERROR', data: undefined, error: e.response.data };
    }
  };
}
