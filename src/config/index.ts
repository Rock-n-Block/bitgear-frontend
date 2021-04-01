type TokenLinksType = {
  ethereum?: string;
  binanceSmartChain?: string;
  binanceChain?: string;
};

export default {
  IS_PRODUCTION: true,
  serverDomain(): string {
    return this.IS_PRODUCTION ? 'https://domain.com/api/v1' : 'https://domain.com/api/v1';
  },
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
  tokenLinks(): TokenLinksType {
    return {
      ethereum: this.IS_PRODUCTION ? 'https://etherscan.io' : 'https://kovan.etherscan.io',
      binanceSmartChain: this.IS_PRODUCTION ? 'https://bscscan.com' : 'https://testnet.bscscan.com',
      binanceChain: this.IS_PRODUCTION
        ? 'https://explorer.binance.org'
        : 'https://testnet-explorer.binance.org',
    };
  },
  chainIds: {
    mainnet: {
      'Ethereum': {
        name: 'Mainnet',
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
        id: [42, '0x2a'],
      },
      'Binance-Smart-Chain': {
        name: 'Binance smart chain testnet',
        id: [97, '0x61'],
      },
    },
  },
};
