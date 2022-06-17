import config from '../config';

export default {
  symbol: 'GEAR-ETH',
  name: 'Bitgear',
  price: null,
  decimals: 18,
  address: (() => {
    if (config.IS_PRODUCTION) return '0xdd5d1a256b25e1087fc3b098b443e96cfa73237d';
    if (config.TESTING_NET === 'ropsten') return '0x8AAd42c2AF3992fee54289c076404F8A3B881C50';
    if (config.TESTING_NET === 'kovan') return '';
    return '0xa43fdccf4d23d5ec7b6f2f946e2dd17a9b6c1e8d';
  })(),
  image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6593.png',
};
