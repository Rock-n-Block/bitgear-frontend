import axios from 'axios';

import config from '../config';

type TypeGetCoinInfoProps = {
  symbol: string;
};

export class CoinGeckoService {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.apis.coinGecko,
    });
  }

  getAllCoins = async () => {
    try {
      const url = `/coins/list`;
      const result = await this.axios.get(url);
      // console.log('CoinGeckoService getAllCoins:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data,
      };
    } catch (e) {
      console.error('CoinGeckoService getAllCoins:', e);
      return { status: 'ERROR', data: undefined };
    }
  };

  getCoinInfo = async ({ symbol }: TypeGetCoinInfoProps) => {
    try {
      const resultGetAllCoins = await this.getAllCoins();
      let coinId;
      if (resultGetAllCoins.status === 'SUCCESS') {
        const coin = resultGetAllCoins.data.filter(
          (item: any) => item.symbol.toLowerCase() === symbol.toLowerCase(),
        )[0];
        coinId = coin.id;
      }
      const url = `/coins/${coinId}`;
      const result = await this.axios.get(url);
      // console.log('CoinGeckoService getCoinInfo:', result);
      if (result.data.Response === 'Error') {
        return { status: 'ERROR', data: undefined };
      }
      return {
        status: 'SUCCESS',
        data: result.data,
      };
    } catch (e) {
      console.error('CoinGeckoService getCoinInfo:', e);
      return { status: 'ERROR', data: undefined };
    }
  };
}
