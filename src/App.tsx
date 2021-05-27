import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

// import BigNumber from 'bignumber.js/bignumber';
import imageTokenPay from './assets/images/token.png';
// import { useWalletConnectorContext } from './contexts/WalletConnect';
import tokensListData from './data/coinlist.json';
// import erc20Abi from './data/erc20Abi.json';
import excludedSymbols from './data/excludedSymbols';
import { statusActions, userActions, zxActions } from './redux/actions';
import { Service0x } from './services/0x';
import { AlchemyService } from './services/Alchemy';
// import { CoinGeckoService } from './services/CoinGecko';
import { CoinMarketCapService } from './services/CoinMarketCap';
import { CryptoCompareService } from './services/CryptoCompareService';
// import { EtherscanService } from './services/Etherscan';
import * as Components from './components';
import config from './config';
import * as Pages from './pages';

const tokenGear = {
  symbol: 'GEAR',
  name: 'Bitgear',
  price: null,
  decimals: 18,
  address: config.IS_PRODUCTION
    ? '0x1b980e05943dE3dB3a459C72325338d327B6F5a9'
    : config.IS_TESTING_ON_ROPSTEN
    ? '0xd46bccb05e6a41d97f166c0082c6729f1c6118bd'
    : '0x67a6a6cd58bb9617227dcf40bb35fc7f0839a658',
};

const Zx = new Service0x();
// const CoinGecko = new CoinGeckoService();
const CryptoCompare = new CryptoCompareService();
const CoinMarketCap = new CoinMarketCapService();
// const Etherscan = new EtherscanService();
const Alchemy = new AlchemyService();

export const App: React.FC = () => {
  // const { web3Provider } = useWalletConnectorContext();

  const dispatch = useDispatch();
  const setTokens = React.useCallback((props: any) => dispatch(zxActions.setTokens(props)), [
    dispatch,
  ]);
  const setTokensByAddress = React.useCallback(
    (props: any) => dispatch(zxActions.setTokensByAddress(props)),
    [dispatch],
  );
  const setUserData = React.useCallback((props: any) => dispatch(userActions.setUserData(props)), [
    dispatch,
  ]);
  const setStatus = React.useCallback((props: any) => dispatch(statusActions.setStatus(props)), [
    dispatch,
  ]);
  const { address: userAddress = '' } = useSelector(({ user }: any) => user);

  const [tokenAddresses, setTokenAddresses] = React.useState<string[]>([]);
  const [tokens0x, setTokens0x] = React.useState<any[]>([]);
  const [tokensCryptoCompare, setTokensCryptoCompare] = React.useState<any[]>([]);
  const [tokensCryptoCompareFormatted, setTokensCryptoCompareFormatted] = React.useState<any[]>([]);
  // const [tokensCoinGecko, setTokensCoinGecko] = React.useState<any[]>([]);

  const getTokensFromCryptoCompare = async () => {
    try {
      const resultGetAllCoins = await CryptoCompare.getAllCoins();
      console.log('App getTokensFromCryptoCompare:', resultGetAllCoins);
      let newTokens = [];
      if (resultGetAllCoins.status === 'SUCCESS') {
        newTokens = resultGetAllCoins.data;
        setTokensCryptoCompare(newTokens);
      }
      newTokens = (tokensListData as any).Data;
      const newTokensFormatted = [];
      const newTokensArray = Object.entries(newTokens);
      for (let i = 0; i < newTokensArray.length; i += 1) {
        const [, data]: any = newTokensArray[i];
        // eslint-disable-next-line no-continue
        if (!data.SmartContractAddress || !data.DecimalPoints) continue;
        // eslint-disable-next-line no-continue
        if (data.SmartContractAddress.length !== 42) continue;
        const {
          DecimalPoints: decimals,
          SmartContractAddress: address,
          Name: name,
          Symbol: symbol,
          ImageUrl: image,
        } = data;
        const newImage = image ? `https://www.cryptocompare.com${image}` : imageTokenPay;
        newTokensFormatted.push({ symbol, name, address, decimals, image: newImage });
      }
      console.log('App getTokensFromCryptoCompare newTokensFormatted:', newTokensFormatted);
      setTokensCryptoCompare(newTokens);
      setTokensCryptoCompareFormatted(newTokensFormatted);
    } catch (e) {
      console.error('App getTokensFromCryptoCompare:', e);
    }
  };

  // const getTokensFromCoinGecko = async () => {
  //   try {
  //     const result = await CoinGecko.getAllCoins();
  //     console.log('App getTokensFromCoinGecko:', result.data);
  //     if (result.status === 'SUCCESS') {
  //       const newTokens = result.data;
  //       setTokensCoinGecko(newTokens);
  //     }
  //     console.log('App getTokensFromCoinGecko:', tokensCoinGecko);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const repeatGetCoinInfoWhenError = async ({ symbol }: { symbol: string }) => {
  //   try {
  //     const resultGetCoinInfo = await CoinMarketCap.getCoinInfo({ symbol });
  //     console.log('App repeatGetCoinInfoWhenError:', resultGetCoinInfo);
  //     // if (resultGetCoinInfo.status === 'ERROR') {
  //     //   const excludedSymbols = resultGetCoinInfo.data;
  //     // }
  //   } catch (e) {
  //     console.error('App repeatGetCoinInfoWhenError:', e);
  //   }
  // };

  const changeTokensInfo = React.useCallback(async (data) => {
    const newData = data;
    const symbolsWithNoImage = data
      .filter((token: any) => {
        if (!token.image) return false;
        if (token.symbol.match(/[^A-Za-z0-9]+/gi)) return false;
        if (excludedSymbols.includes(token.symbol)) return false;
        return true;
      })
      .map((item: any) => item.symbol);
    console.log('App changeTokensInfo symbolsWithNoImage:', symbolsWithNoImage);
    const resultGetCoinInfo = await CoinMarketCap.getCoinInfo({
      symbol: symbolsWithNoImage.join(','),
    });
    console.log('App changeTokensInfo resultGetCoinInfo:', resultGetCoinInfo);
    if (resultGetCoinInfo.status === 'SUCCESS') {
      const tokensInfo = resultGetCoinInfo.data;
      console.log('App changeTokensInfo tokensInfo:', tokensInfo);
      for (let i = 0; i < data.length; i += 1) {
        const token = data[i];
        const { image, symbol } = token;
        const tokensInfoToken = tokensInfo[symbol];
        if (!image && tokensInfoToken) newData[i].image = tokensInfoToken.logo;
      }
    }
    const newNewData = newData;
    for (let i = 0; i < data.length; i += 1) {
      const token = newNewData[i];
      const { image } = token;
      if (!image) {
        newNewData[i].image = imageTokenPay;
      }
    }
    return newNewData;
  }, []);

  const getTokens = React.useCallback(async () => {
    try {
      const resultGetTokens0x = await Zx.getTokens();
      let newTokens0x = resultGetTokens0x.data;
      // eslint-disable-next-line no-confusing-arrow
      newTokens0x.sort((a: any, b: any) => (a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0));
      console.log('App getTokens tokenGear:', tokenGear);
      newTokens0x = [tokenGear].concat(newTokens0x);
      const tokensAll = newTokens0x.concat(tokensCryptoCompareFormatted);
      const tokensAllSorted = tokensAll
        // .filter((token) => {
        // if (token.symbol.match(/[^A-Za-z0-9]+/gi)) return false;
        // if (excludedSymbols.includes(token.symbol)) return false;
        // return true;
        // })
        // eslint-disable-next-line no-confusing-arrow
        .sort((a: any, b: any) => {
          return a.symbol !== b.symbol ? (a.symbol < b.symbol ? -1 : 1) : 0;
        });
      console.log('App getTokens:', tokensAllSorted);
      const newTokensByAddress: any = {};
      const newTokenAddresses = tokensAllSorted.map((token: any) => {
        const { address } = token;
        newTokensByAddress[address] = token;
        return address;
      });
      setTokenAddresses(newTokenAddresses);
      setTokensByAddress({ tokensByAddress: newTokensByAddress });
      const tokensAllFormatted = await changeTokensInfo(tokensAllSorted);
      setTokens({ tokens: tokensAllFormatted });
      setTokens0x(newTokens0x);
    } catch (e) {
      console.error('App getTokens:', e);
    }
  }, [setTokens, changeTokensInfo, tokensCryptoCompareFormatted, setTokensByAddress]);

  const getTokensBalancesFromAlchemy = React.useCallback(async () => {
    try {
      setStatus({ loadingBalances: 'loading' });
      const resultGetBalances = await Alchemy.getBalances({
        userAddress,
        contractAddresses: tokenAddresses,
      });
      console.log('App getTokenBalancesFromAlchemy resultGetBalances:', resultGetBalances);
      if (resultGetBalances.status === 'SUCCESS') {
        const newBalances = resultGetBalances.data;
        console.log('App getTokenBalancesFromAlchemy newBalances:', newBalances);
        setUserData({ balances: newBalances });
      }
      setStatus({ loadingBalances: 'done' });
    } catch (e) {
      console.error('App getTokensBalancesFromAlchemy:', e);
      setStatus({ loadingBalances: 'error' });
    }
  }, [userAddress, tokenAddresses, setUserData, setStatus]);

  // const getTokensBalances = React.useCallback(async () => {
  //   try {
  //     return; // todo
  //     setStatus({ loadingBalances: 'loading' });
  //     const balances = {};
  //     // eslint-disable-next-line no-plusplus
  //     for (let i = 0; i < tokens0x.length; i++) {
  //       const token = tokens0x[i];
  //       const { symbol, address }: { symbol: string; address: string } = token;
  //       let balance = 0;
  //       if (symbol === 'ETH') {
  //         // eslint-disable-next-line no-await-in-loop
  //         balance = await web3Provider.getBalance(userAddress);
  //       } else {
  //         try {
  //           // eslint-disable-next-line no-await-in-loop
  //           balance = await web3Provider.balanceOf({
  //             address: userAddress,
  //             contractAddress: address,
  //             contractAbi: erc20Abi,
  //           });
  //         } catch (e) {
  //           try {
  //             // console.error(`App getTokensBalances (${symbol}):`, e);
  //             // eslint-disable-next-line no-await-in-loop
  //             const resultGetAbi = await Etherscan.getAbi(address); // todo after adding excludedCoins it can be removed
  //             // console.log('App getTokensBalances resultGetAbi:', resultGetAbi);
  //             if (resultGetAbi.status === 'SUCCESS') {
  //               // eslint-disable-next-line no-await-in-loop
  //               balance = await web3Provider.balanceOf({
  //                 address: userAddress,
  //                 contractAddress: address,
  //                 contractAbi: resultGetAbi.data,
  //               });
  //             } else {
  //               balance = 0;
  //             }
  //           } catch {
  //             balance = 0;
  //           }
  //         }
  //       }
  //       (balances as any)[symbol] = new BigNumber(balance).toString(10);
  //     }
  //     // console.log('App getTokensBalances balances:', balances);
  //     setUserData({ balances });
  //     setStatus({ loadingBalances: 'done' });
  //   } catch (e) {
  //     console.error('App getTokensBalances:', e);
  //     setStatus({ loadingBalances: 'error' });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tokens0x, setTokens, setUserData, userAddress, web3Provider]);

  React.useEffect(() => {
    // getTokensFromCoinGecko();
    getTokensFromCryptoCompare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!tokensCryptoCompare || tokensCryptoCompare?.length === 0) return;
    if (!tokensCryptoCompareFormatted || tokensCryptoCompareFormatted?.length === 0) return;
    getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensCryptoCompare, tokensCryptoCompareFormatted]);

  // React.useEffect(() => {
  //   if (!tokens0x || tokens0x?.length === 0) return;
  //   if (!userAddress) return;
  //   getTokensBalances();
  //   const interval = setInterval(() => getTokensBalances(), 10000);
  //   // eslint-disable-next-line consistent-return
  //   return () => clearInterval(interval);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tokens0x, userAddress]);

  React.useEffect(() => {
    if (!tokens0x || tokens0x?.length === 0) return;
    if (!tokenAddresses || tokenAddresses?.length === 0) return;
    if (!userAddress) return;
    getTokensBalancesFromAlchemy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens0x, userAddress, tokenAddresses]);

  return (
    <Router>
      <div className="App">
        <Components.Header />
        <main className="container-App">
          <Switch>
            <Route path="/" exact>
              <Pages.PageMain />
            </Route>
            <Route path="/explore">
              <Pages.PageExplore />
            </Route>
            <Route path="/lists" exact>
              <Redirect to="/explore" />
            </Route>
            <Route path="/lists/recently-added">
              <Pages.PageListsRecentlyAdded />
            </Route>
            <Route path="/lists/top-gainers">
              <Pages.PageListsTopGainers />
            </Route>
            <Route path="/markets">
              <Pages.PageMarkets />
            </Route>
            <Route path="/settings">
              <Pages.PageSettings />
            </Route>
            <Route path="/login">
              <Pages.PageLogin />
            </Route>
            <Route path="/account">
              {userAddress ? <Pages.PageAccount /> : <Pages.PageLogin />}
            </Route>
            <Route path="*">
              <Pages.Page404 />
            </Route>
          </Switch>
        </main>
        <Components.Footer />
        <Components.Modal />
      </div>
    </Router>
  );
};
