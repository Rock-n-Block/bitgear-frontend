import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber';

import config from '../config';

type TypeGetCoinInfoProps = {
  userAddress: string;
  contractAddresses: string[];
};

export class AlchemyService {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: config.apis.alchemy,
    });
  }

  getBalances = async ({ userAddress, contractAddresses }: TypeGetCoinInfoProps) => {
    try {
      const url = `/`;
      const { chainIds }: any = config;
      const chainId: any = chainIds[config.isMainnetOrTestnet];
      // console.log('AlchemyService getBalances:', chainIds, chainId);
      const options = {
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        id: chainId.Ethereum.id[0],
        params: [userAddress, contractAddresses],
      };
      const result = await this.axios.post(url, options);
      console.log('AlchemyService getBalances:', result);
      if (result.data.Response === 'Error') return { status: 'ERROR', data: result.data };
      const { tokenBalances } = result.data.result;
      const newTokenBalances = this.convertBalances(tokenBalances);
      return { status: 'SUCCESS', data: newTokenBalances };
    } catch (e) {
      console.error('AlchemyService getBalances:', e);
      return { status: 'ERROR', data: undefined, error: JSON.parse(JSON.stringify(e)) };
    }
  };

  convertBalances = (balances: any) => {
    const newBalances: any = {};
    balances.map((balance: any) => {
      const { tokenBalance } = balance;
      const { contractAddress } = balance;
      if (
        ['0x', '0x0000000000000000000000000000000000000000000000000000000000000000', null].includes(
          tokenBalance,
        )
      ) {
        return null;
      }
      const newTokenBalance = new BigNumber(tokenBalance).toString(10);
      newBalances[contractAddress] = newTokenBalance;
      return null;
    });
    return newBalances;
  };
}
