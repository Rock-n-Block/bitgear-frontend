import axios from 'axios';
import qs from 'query-string';

import config from '../config';

type TypeGetQuoteProps = {
  buyToken: string;
  sellToken: string;
  buyAmount: string;
};

type TypeGetPriceProps = {
  buyToken: string;
  sellToken: string;
  sellAmount: string;
  skipValidation?: boolean;
};

type TypeGetPricesProps = {
  sellToken: string;
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
      // eslint-disable-next-line no-param-reassign
      props.buyAmount = `${+props.buyAmount * 10e17}`; // todo
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

  getPrice = async (props: TypeGetPriceProps) => {
    try {
      // eslint-disable-next-line no-param-reassign
      props.sellAmount = `${+props.sellAmount * 10e17}`; // todo
      const url = `/swap/v1/price?${qs.stringify(props)}`;
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

  getPrices = async (props: TypeGetPricesProps) => {
    try {
      const url = `/swap/v1/prices?${qs.stringify(props)}`;
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

  getOrders = async () => {
    // link below works properly
    // https://api.0x.org/sra/v4/orders?page=1&perPage=1000&makerToken=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
  };
}
