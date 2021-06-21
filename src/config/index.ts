const IS_PRODUCTION = true;
const IS_TESTING_ON_ROPSTEN = false;
const SHOW_CONSOLE_LOGS = false;

export default {
  IS_PRODUCTION,
  IS_TESTING_ON_ROPSTEN,
  SHOW_CONSOLE_LOGS,
  version: IS_PRODUCTION ? 'Mainnet beta' : IS_TESTING_ON_ROPSTEN ? 'Ropsten beta' : 'Kovan beta',
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
    // 'theGraph': 'https://api.thegraph.com/subgraphs/name/gundamdweeb/bifrost',
    'theGraph': 'https://api.thegraph.com/subgraphs/name/dekz/zeroex_exchangeproxy',
    // 'cryptoCompare': 'https://min-api.cryptocompare.com',
    'cryptoCompare': 'https://crypto-api.mywish.io',
    // 'coinMarketCap': 'https://pro-api.coinmarketcap.com',
    'coinMarketCap': 'https://cmc-api.mywish.io',
    'coinGecko': 'https://api.coingecko.com/api/v3',
    'covalent': 'https://api.covalenthq.com/v1',
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
    // cryptoCompare: '64003a2defe5d1cd62c11cae1ed06c7248a0a985e63ce30fdd280c3855ae4dc3', // todo
    cryptoCompare: '', // todo check if works
    coinMarketCap: '', // ok
    alchemy: '9e37toZE9l2XRTjIUsWUD3gAyiRPWYCQ', // ok
    // covalent: 'ckey_d3c7bc2ea7be4f5691de44dfbfa', // todo
    covalent: '',
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
      allowanceTargetLimit: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
    },
    kovan: {
      // allowanceTarget: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
      allowanceTargetLimit: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
    },
    ropsten: {
      // allowanceTarget: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
      allowanceTargetLimit: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
    },
  },
};
