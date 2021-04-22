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
    etherscan: 'VI2S1A8EBH54NNDH3Q4H2IFYJ4E85YDQEF',
  },
};
