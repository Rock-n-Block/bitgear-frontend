const IS_PRODUCTION = false;

export default {
  IS_PRODUCTION,
  links: {
    twitter: 'https://twitter.com/',
    telegram: 'https://t.me/',
    medium: 'https://medium.com/',
    github: 'https://github.com/',
    reddit: 'https://www.reddit.com/',
    discord: 'https://discord.gg/',
    email: 'support@mail.com',
    policy: '',
  },
  apis: {
    'cryptoCompare': 'https://min-api.cryptocompare.com',
    '0x': IS_PRODUCTION ? 'https://api.0x.org' : 'https://kovan.api.0x.org/',
    'etherscan': IS_PRODUCTION
      ? 'https://api.etherscan.io/api'
      : 'https://api-kovan.etherscan.io/api',
  },
  keys: {
    infura: 'd1bbf6a40e514be6878e06b2d01a7f41',
    etherscan: 'VI2S1A8EBH54NNDH3Q4H2IFYJ4E85YDQEF',
    cryptoCompare: '64003a2defe5d1cd62c11cae1ed06c7248a0a985e63ce30fdd280c3855ae4dc3',
  },
  chainIds: {
    mainnet: {
      'Ethereum': {
        name: 'Mainnet',
        // first id should be a number 1. other ids cause error in tradeLimit function.
        id: [1, '0x1', '0x01'],
      },
      'Binance-Smart-Chain': {
        name: 'Binance smart chain',
        id: [56, '0x38'],
      },
    },
    testnet: {
      'Ethereum': {
        name: 'Kovan testnet',
        // first id should be a number 42. other ids cause error in tradeLimit function.
        id: [42, '0x2a'],
      },
      // 'Ethereum': {
      //   name: 'Ropsten testnet',
      //   // first id should be a number 3. other ids cause error in tradeLimit function.
      //   id: [3, '0x3'],
      // },
      // 'Ethereum': {
      //   name: 'Rinkeby testnet',
      //   // first id should be a number 4. other ids cause error in tradeLimit function.
      //   id: [4, '0x4'],
      // },
      'Binance-Smart-Chain': {
        name: 'Binance smart chain testnet',
        id: [97, '0x61'],
      },
    },
  },
};
