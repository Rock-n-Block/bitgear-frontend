import config from '../config';

export default {
  symbol: 'WETH',
  name: 'Wrapped Ether',
  decimals: 18,
  address: (() => {
    if (config.IS_PRODUCTION) return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    if (config.TESTING_NET === 'ropsten') return '';
    if (config.TESTING_NET === 'kovan') return '';
    return '0xc778417e063141139fce010982780140aa0cd5ab';
  })(),
  image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
};
