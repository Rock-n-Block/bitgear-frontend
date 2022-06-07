import config from '../config';

export default {
  symbol: 'GEAR-ETH',
  name: 'Bitgear',
  price: null,
  decimals: 18,
  address: (() => {
    if (config.IS_PRODUCTION) return '0xdd5d1a256b25e1087fc3b098b443e96cfa73237d';
    if (config.TESTING_NET === 'ropsten') return '';
    if (config.TESTING_NET === 'kovan') return '';
    return '0xd460FCF4730C9f910DAE1FB9AE3dF93D8D3FD4AD';
  })(),
  image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6593.png',
};
