import * as utils from '@0x/protocol-utils';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber';
import qs from 'query-string';

import config from '../config';

type TypeGetQuoteProps = {
  buyToken: string;
  sellToken: string;
  sellAmount: number;
  decimals: number;
};

type TypeGetPriceProps = {
  buyToken: string;
  sellToken: string;
  sellAmount: number;
  skipValidation?: boolean;
  decimals: number;
};

type TypeGetPricesProps = {
  sellToken: string;
};

type TypeSignOrderProps = {
  provider: any;
  chainId: number;
  userAddress: string;
  addressPay: string;
  addressReceive: string;
  amountPay: string;
  amountReceive: string;
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
      const { decimals, sellAmount } = props;
      // eslint-disable-next-line no-param-reassign
      props.sellAmount = sellAmount * 10 ** decimals; // todo
      console.log('Service0x getQuote:', props);
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
      const { decimals, sellAmount } = props;
      // eslint-disable-next-line no-param-reassign
      props.sellAmount = sellAmount * 10 ** decimals; // todo
      console.log('Service0x getPrice:', props);
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

  // https://protocol.0x.org/en/latest/basics/orders.html#limit-orders
  signOrder = async ({
    provider,
    chainId,
    userAddress: maker,
    amountPay,
    amountReceive,
    addressPay: makerToken,
    addressReceive: takerToken,
  }: TypeSignOrderProps) => {
    try {
      console.log('Service0x signOrder provider:', {
        provider,
        maker,
        makerToken,
        takerToken,
        amountPay,
        amountReceive,
      });
      const makerAmount = new BigNumber(amountPay);
      const takerAmount = new BigNumber(amountReceive);
      const order = new utils.LimitOrder({
        chainId,
        maker,
        makerToken, // symbolOne address
        takerToken, // symbolTwo address
        makerAmount,
        takerAmount,
        // expiry, // todo
        // salt, // todo
      });
      console.log('Service0x signOrder order:', order);
      const signature = await order.getSignatureWithProviderAsync(
        provider.provider,
        utils.SignatureType.EIP712,
      );
      return { status: 'SUCCESS', data: signature };
    } catch (e) {
      return { status: 'ERROR', data: undefined, error: e };
    }
  };
}
