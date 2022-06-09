// Redux Store
interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
}

// Web3 Providers
interface Window {
  ethereum: any;
}

// Process.env variables
namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    REACT_APP_INFURA_KEY: string;
    REACT_APP_ETHERSCAN_KEY: string;
    REACT_APP_CRYPTOCOMPARE_KEY: string;
    REACT_APP_COINMARKETCAP_KEY: string;
    REACT_APP_ALCHEMY_KEY: string;
    REACT_APP_COVALENT_KEY: string;
  }
}
