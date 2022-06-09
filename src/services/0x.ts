import * as utils from '@0x/protocol-utils';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber';
import qs from 'query-string';

import config from '../config';
import tokensRopsten from '../data/tokensRopsten';

type TypeGetQuoteProps = {
  buyToken: string;
  sellToken: string;
  sellAmount: string;
  decimals: number;
  includePriceComparisons?: boolean;
  excludedSources?: string;
  includedSources?: string;
};

type TypeGetPriceProps = {
  buyToken: string;
  sellToken: string;
  sellAmount: string;
  skipValidation?: boolean;
  decimals: number;
  includePriceComparisons?: boolean;
  excludedSources?: string;
  includedSources?: string;
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
  decimalsPay: number;
  decimalsReceive: number;
  amountPay: string;
  amountReceive: string;
  expiration: number;
};

type TypeSendOrderProps = {
  chainId: number;
  expiry: string;
  feeRecipient: string;
  maker: string;
  makerAmount: string;
  makerToken: string;
  pool: string;
  salt: string;
  sender: string;
  taker: string;
  takerAmount: string;
  takerToken: string;
  takerTokenFeeAmount: string;
  verifyingContract: string;
};

type TypeGetOrdersProps = {
  trader: string;
};

export class Service0x {
  private axios: any;

  private axiosMainnet: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.apis['0x'],
    });
    this.axiosMainnet = axios.create({
      baseURL: 'https://api.0x.org',
    });
  }

  getTokens = async () => {
    try {
      if (!config.IS_PRODUCTION && config.TESTING_NET === 'ropsten')
        return {
          status: 'SUCCESS',
          data: tokensRopsten,
        };
      const url = `/swap/v1/tokens`;
      const result = await this.axios.get(url);
      return {
        status: 'SUCCESS',
        data: result.data.records,
      };
    } catch (e: any) {
      return { status: 'ERROR', data: undefined, error: e.response.data };
    }
  };

  getQuote = async (props: TypeGetQuoteProps) => {
    try {
      const newProps = { ...props };
      const { decimals, sellAmount } = newProps;
      // eslint-disable-next-line no-param-reassign
      newProps.sellAmount = new BigNumber(sellAmount)
        .multipliedBy(new BigNumber(10).pow(decimals))
        .toFixed(0);
      const url = `/swap/v1/quote?${qs.stringify(newProps)}`;
      const result = await this.axios.get(url);
      return {
        status: 'SUCCESS',
        data: result.data,
      };
    } catch (e: any) {
      return { status: 'ERROR', data: undefined, error: e.response.data };
    }
  };

  getPrice = async (props: TypeGetPriceProps) => {
    try {
      const newProps = { ...props };
      const { decimals, sellAmount } = newProps;
      newProps.sellAmount = new BigNumber(sellAmount)
        .multipliedBy(new BigNumber(10).pow(decimals))
        .toFixed(0);
      const url = `/swap/v1/price?${qs.stringify(newProps)}`;
      let result;
      if (!config.IS_PRODUCTION && config.TESTING_NET === 'ropsten') {
        result = await this.axiosMainnet.get(url);
      } else {
        result = await this.axios.get(url);
      }
      return {
        status: 'SUCCESS',
        data: result.data,
      };
    } catch (e: any) {
      return { status: 'ERROR', data: undefined, error: e.response.data };
    }
  };

  getPrices = async (props: TypeGetPricesProps) => {
    try {
      const url = `/swap/v1/prices?${qs.stringify(props)}`;
      let result;
      if (!config.IS_PRODUCTION && config.TESTING_NET === 'ropsten') {
        result = await this.axiosMainnet.get(url);
      } else {
        result = await this.axios.get(url);
      }
      return {
        status: 'SUCCESS',
        data: result.data,
      };
    } catch (e: any) {
      return { status: 'ERROR', data: undefined, error: e.response.data };
    }
  };

  getOrders = async (props: TypeGetOrdersProps) => {
    try {
      const url = `/sra/v4/orders?${qs.stringify(props)}`;
      const result = await this.axios.get(url);
      return {
        status: 'SUCCESS',
        data: result.data,
      };
    } catch (e: any) {
      return { status: 'ERROR', data: undefined, error: e.response.data };
    }
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
    decimalsPay,
    decimalsReceive,
    addressPay: makerToken,
    addressReceive: takerToken,
    expiration: expires,
  }: TypeSignOrderProps) => {
    try {
      console.log('Service0x signOrder provider:', {
        provider,
        chainId,
        maker,
        makerToken,
        takerToken,
        amountPay,
        amountReceive,
        expires,
      });
      const makerAmount = new BigNumber(amountPay).multipliedBy(new BigNumber(10).pow(decimalsPay));
      const takerAmount = new BigNumber(amountReceive).multipliedBy(
        new BigNumber(10).pow(decimalsReceive),
      );
      const expiry = new BigNumber(expires);
      const salt = new BigNumber(Math.random() * 100000000000000000); // todo
      const order: any = new utils.LimitOrder({
        chainId,
        maker,
        makerToken, // symbolOne address
        takerToken, // symbolTwo address
        makerAmount,
        takerAmount,
        expiry,
        salt,
      });
      console.log('Service0x signOrder order:', order);
      const signature = await order.getSignatureWithProviderAsync(
        provider.provider,
        utils.SignatureType.EIP712,
      );
      order.signature = signature;
      order.expiry = order.expiry.toString();
      order.salt = order.salt.toString();
      order.makerAmount = order.makerAmount.toString();
      order.takerAmount = order.takerAmount.toString();
      order.takerTokenFeeAmount = order.takerTokenFeeAmount.toString();
      return { status: 'SUCCESS', data: order };
    } catch (e: any) {
      return { status: 'ERROR', data: undefined, error: e.response.data };
    }
  };

  sendOrder = async (props: TypeSendOrderProps) => {
    try {
      const url = `/sra/v4/order`;
      const result = await this.axios.post(url, props);
      return {
        status: 'SUCCESS',
        data: result.data,
      };
    } catch (e: any) {
      return { status: 'ERROR', data: undefined, error: e.response.data };
    }
  };
}
