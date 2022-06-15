import config from '../config';

export default {
  symbol: 'GEAR',
  name: 'Bitgear',
  price: null,
  decimals: 18,
  address: (() => {
    if (config.IS_PRODUCTION) return '0x1b980e05943dE3dB3a459C72325338d327B6F5a9';
    if (config.TESTING_NET === 'ropsten') return '0xAb5a856e5793d96544D342ceEd7Cb89177986441';
    if (config.TESTING_NET === 'kovan') return '0x67a6a6cd58bb9617227dcf40bb35fc7f0839a658';
    return '0x080d1263989c08430b85f864c100ee63d67d499d';
  })(),
  image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6593.png',
};
