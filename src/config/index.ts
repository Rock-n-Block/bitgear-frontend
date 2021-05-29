const IS_PRODUCTION = true;
const IS_TESTING_ON_ROPSTEN = false;

export default {
  IS_PRODUCTION,
  IS_TESTING_ON_ROPSTEN,
  isMainnetOrTestnet: IS_PRODUCTION ? 'mainnet' : 'testnet',
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
    // 'coinMarketCap': 'https://pro-api.coinmarketcap.com',
    'coinMarketCap': 'https://cmc-api.mywish.io',
    'coinGecko': 'https://api.coingecko.com/api/v3',
    'alchemy': IS_PRODUCTION
      ? 'https://eth.alchemyapi.io/v2/'
      : IS_TESTING_ON_ROPSTEN
      ? 'https://eth-ropsten.alchemyapi.io/v2/'
      : 'https://eth-kovan.alchemyapi.io/v2/',
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
    infura: '1964ef9a752c4405b7631cb49ab373fa', // ok
    // ok. if limit for getGasPrice reaches, web3.getGasPrice works
    etherscan: 'ANN5EICH9J3Y2VFXHEQV898DBPS9KT71BD',
    cryptoCompare: '', // ok
    coinMarketCap: '', // ok
    alchemy: '9e37toZE9l2XRTjIUsWUD3gAyiRPWYCQ', // ok
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
      allowanceTargetLimit: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
    },
    kovan: {
      // allowanceTarget: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
      allowanceTargetLimit: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
    },
    ropsten: {
      // allowanceTarget: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
      allowanceTargetLimit: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
    },
  },
};
