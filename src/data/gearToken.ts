import config from '../config';

export default {
  symbol: 'GEAR',
  name: 'Bitgear',
  price: null,
  decimals: 18,
  address: config.IS_PRODUCTION
    ? '0x1b980e05943dE3dB3a459C72325338d327B6F5a9'
    : config.IS_TESTING_ON_ROPSTEN
    ? '0xd46bccb05e6a41d97f166c0082c6729f1c6118bd'
    : '0x67a6a6cd58bb9617227dcf40bb35fc7f0839a658',
  image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6593.png',
};
