const IS_PRODUCTION = true;
const IS_TESTING_ON_ROPSTEN = false;

export default {
  IS_PRODUCTION,
  IS_TESTING_ON_ROPSTEN,
  netType: IS_PRODUCTION ? 'mainnet' : IS_TESTING_ON_ROPSTEN ? 'ropsten' : 'kovan',
  links: {
    twitter: 'https://twitter.com/bitgeario',
    telegram: 'https://t.me/bitgear',
    medium: 'https://medium.com/bitgear.io ',
    github: 'https://github.com/',
    reddit: 'https://www.reddit.com/',
    discord: 'https://discord.gg/',
    email: 'support@mail.com',
    policy: '',
  },
  apis: {
    // 'cryptoCompare': 'https://min-api.cryptocompare.com',
    'cryptoCompare': 'https://crypto-api.mywish.io',
    // 'coinMarketCap': 'https://cmc-api.mywish.io',
    'coinMarketCap': 'https://cmc-api.mywish.io',
    'coinGecko': 'https://api.coingecko.com/api/v3',
    '0x': IS_PRODUCTION
      ? 'https://api.0x.org'
      : IS_TESTING_ON_ROPSTEN
      ? 'https://ropsten.api.0x.org/'
      : 'https://kovan.api.0x.org/',
    'etherscan': IS_PRODUCTION
      ? 'https://api.etherscan.io/api'
      : IS_TESTING_ON_ROPSTEN
      ? 'https://api-ropsten.etherscan.io/api'
      : 'https://api-kovan.etherscan.io/api',
  },
  keys: {
    infura: 'd1bbf6a40e514be6878e06b2d01a7f41',
    etherscan: 'VI2S1A8EBH54NNDH3Q4H2IFYJ4E85YDQEF',
    cryptoCompare: '64003a2defe5d1cd62c11cae1ed06c7248a0a985e63ce30fdd280c3855ae4dc3',
    coinMarketCap: '81020735-ae3c-4f94-ad58-89ffd839d328',
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
      'Ethereum': !IS_TESTING_ON_ROPSTEN
        ? {
            name: 'Kovan testnet',
            // first id should be a number 42. other ids cause error in tradeLimit function.
            id: [42, '0x2a'],
          }
        : {
            name: 'Ropsten testnet',
            // first id should be a number 3. other ids cause error in tradeLimit function.
            id: [3, '0x3'],
          },
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
  // todo remove (allowanceTarget gets in getQuote). because it changes sometimes.
  addresses: {
    // 0x contract
    mainnet: {
      // allowanceTarget: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
    },
    kovan: {
      // allowanceTarget: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
    },
    ropsten: {
      // allowanceTarget: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
    },
  },
};
