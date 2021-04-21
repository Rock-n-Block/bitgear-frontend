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
  },
};
