import { Chains, SupportedTestnets, TChainIds } from '../types';

export type NetType = 'mainnet' | SupportedTestnets;
type ConfigAddressesContractNames =
  | 'allowanceTarget'
  | 'allowanceTargetLimit'
  | 'tradeFeeRecipient';
type ConfigMapContractToAddress = Record<ConfigAddressesContractNames, string>;

const IS_PRODUCTION = false;
const TESTING_NET = 'rinkeby' as SupportedTestnets;
const SHOW_CONSOLE_LOGS = true;

export default {
  IS_PRODUCTION,
  TESTING_NET,
  SHOW_CONSOLE_LOGS,
  version: (() => {
    if (IS_PRODUCTION) return 'Mainnet beta';
    if (TESTING_NET === 'ropsten') return 'Ropsten beta';
    if (TESTING_NET === 'kovan') return 'Kovan beta';
    return 'Rinkeby beta';
  })(),
  isMainnetOrTestnet: IS_PRODUCTION ? 'mainnet' : 'testnet',
  netType: (() => {
    if (IS_PRODUCTION) return 'mainnet';
    if (TESTING_NET === 'ropsten') return 'ropsten';
    if (TESTING_NET === 'kovan') return 'kovan';
    return 'rinkeby';
  })() as NetType,
  links: {
    twitter: 'https://twitter.com/bitgeario',
    telegram: 'https://t.me/bitgear',
    medium: 'https://medium.com/bitgear',
    github: 'https://github.com/',
    reddit: 'https://www.reddit.com/',
    discord: 'https://discord.gg/',
    email: 'support@mail.com',
    policy: '',
    contact: 'hello@bitgear.io',
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
    'alchemy': (() => {
      if (IS_PRODUCTION) return 'https://eth-mainnet.alchemyapi.io/v2/';
      if (TESTING_NET === 'ropsten') return 'https://eth-ropsten.alchemyapi.io/v2/';
      if (TESTING_NET === 'kovan') return 'https://eth-kovan.alchemyapi.io/v2/';
      return 'https://eth-rinkeby.alchemyapi.io/v2/';
    })(),
    '0x': (() => {
      if (IS_PRODUCTION) return 'https://api.0x.org';
      if (TESTING_NET === 'ropsten') return 'https://ropsten.api.0x.org/';
      if (TESTING_NET === 'kovan') return 'https://kovan.api.0x.org/';
      return 'https://rinkeby.api.0x.org';
    })(),
    'etherscan': (() => {
      if (IS_PRODUCTION) return 'https://api.etherscan.io/api';
      if (TESTING_NET === 'ropsten') return 'https://api-ropsten.etherscan.io/api';
      if (TESTING_NET === 'kovan') return 'https://api-kovan.etherscan.io/api';
      return 'https://api-rinkeby.etherscan.io/api';
    })(),
  },
  chainIds: {
    mainnet: {
      [Chains.eth]: {
        name: 'Mainnet',
        // first id should be a number 1. other ids cause error in tradeLimit function.
        id: [1, '0x1', '0x01'],
      },
      [Chains.bsc]: {
        name: 'Binance smart chain',
        id: [56, '0x38'],
      },
    },
    testnet: {
      [Chains.eth]: (() => {
        if (TESTING_NET === 'kovan')
          return {
            name: 'Kovan testnet',
            // first id should be a number 42. other ids cause error in tradeLimit function.
            id: [42, '0x2a'],
          };
        if (TESTING_NET === 'ropsten')
          return {
            name: 'Ropsten testnet',
            // first id should be a number 3. other ids cause error in tradeLimit function.
            id: [3, '0x3'],
          };
        return {
          name: 'Rinkeby testnet',
          // first id should be a number 4. other ids cause error in tradeLimit function.
          id: [4, '0x4'],
        };
      })(),
      [Chains.bsc]: {
        name: 'Binance smart chain testnet',
        id: [97, '0x61'],
      },
    },
  } as TChainIds,
  // todo remove (allowanceTarget gets in getQuote). because it changes sometimes.
  addresses: {
    // 0x contract
    mainnet: {
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
      allowanceTargetLimit: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      tradeFeeRecipient: '0x0dE943AA3BB47e407c2747A8CE6Ae026272C3549', // target where fees from Trades are sent
    },
    kovan: {
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
      allowanceTargetLimit: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      tradeFeeRecipient: '0x0dE943AA3BB47e407c2747A8CE6Ae026272C3549', // target where fees from Trades are sent
    },
    ropsten: {
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
      allowanceTargetLimit: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      tradeFeeRecipient: '0x0dE943AA3BB47e407c2747A8CE6Ae026272C3549', // target where fees from Trades are sent
    },
    rinkeby: {
      allowanceTarget: '0xf740b67da229f2f10bcbd38a7979992fcc71b8eb',
      allowanceTargetLimit: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
      tradeFeeRecipient: '0x0dE943AA3BB47e407c2747A8CE6Ae026272C3549', // target where fees from Trades are sent
    },
  } as Record<NetType, ConfigMapContractToAddress>,
  staking: {
    regularPid: 0, // CoinStaking contract === Pancake's Master contract
    lpPid: 1, // CoinStaking contract LP
  },
  tradeFees: {
    // GEARS if balance of user is greater than this, then apply another fees
    minTokenAmountToApplyLowerFees: 100000,

    /* Applied if: minTokenAmountToApplyLowerFees isn't reached */
    regularFee: 0.0015, // 0.15%

    /* Applied if: minTokenAmountToApplyLowerFees is reached */
    reducedFee: 0.003, // 0.3%

    /**
     * Applied if:
     * 1) minTokenAmountToApplyLowerFees isn't reached
     * 2) if address to sent MUST BE different from user wallet address
     */
    deviatingAddressRegularFee: 0.005, // 0.5%

    /**
     * Applied if:
     * 1) minTokenAmountToApplyLowerFees is reached
     * 2) if address to sent MUST BE different from user wallet address
     */
    deviatingAddressReducedFee: 0.0025, // 0.25%
  },
};

export const mapChainIdToRpc: Record<number, string> = {
  1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
  3: `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
  4: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
  42: `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
  56: 'https://bsc-dataseed.binance.org/',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  // TODO: fill another chain ids
};

export * from './contracts';
