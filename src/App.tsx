import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import imageTokenPay from './assets/images/token.png';
import { useWalletConnectorContext } from './contexts/WalletConnect';
import tokensListData from './data/coinlist.json';
import erc20Abi from './data/erc20Abi.json';
import { statusActions, userActions, zxActions } from './redux/actions';
import { Service0x } from './services/0x';
import { CoinGeckoService } from './services/CoinGecko';
import { CryptoCompareService } from './services/CryptoCompareService';
import { race } from './utils/promises';
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
const CoinGecko = new CoinGeckoService();
const CryptoCompare = new CryptoCompareService();

export const App: React.FC = () => {
  const { web3Provider } = useWalletConnectorContext();

  const dispatch = useDispatch();
  const setTokens = React.useCallback((props: any) => dispatch(zxActions.setTokens(props)), [
    dispatch,
  ]);
  const setUserData = React.useCallback((props: any) => dispatch(userActions.setUserData(props)), [
    dispatch,
  ]);
  const setStatus = React.useCallback((props: any) => dispatch(statusActions.setStatus(props)), [
    dispatch,
  ]);
  const { address: userAddress = '' } = useSelector(({ user }: any) => user);

  const [tokens0x, setTokens0x] = React.useState<any[]>([]);
  const [tokensCryptoCompare, setTokensCryptoCompare] = React.useState<any[]>([]);
  // const [tokensCoinGecko, setTokensCoinGecko] = React.useState<any[]>([]);

  const getTokensFromCryptoCompare = async () => {
    try {
      const result = await CryptoCompare.getAllCoins();
      console.log('App getTokensFromCryptoCompare:', result.data);
      if (result.status === 'SUCCESS') {
        const newTokens = result.data;
        setTokensCryptoCompare(newTokens);
      }
      const newTokens = (tokensListData as any).Data;
      // console.log('App getTokensFromCryptoCompare:', newTokens);
      setTokensCryptoCompare(newTokens);
    } catch (e) {
      console.error(e);
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

  const changeTokensInfo = React.useCallback(
    async (data) => {
      const newData = data;
      // console.log('App changeTokensInfo:', data);
      // eslint-disable-next-line no-plusplus
      for (let it = 0; it < data.length; it++) {
        const token = data[it];
        const { symbol, address, decimals } = token;
        const isImage = tokensCryptoCompare[symbol] && tokensCryptoCompare[symbol].ImageUrl;
        if (isImage) {
          newData[
            it
          ].image = `https://www.cryptocompare.com/media${tokensCryptoCompare[symbol].ImageUrl}`;
        } else {
          // newData[it].image = imageTokenPay;
          // continue;
          try {
            // eslint-disable-next-line no-await-in-loop
            const resultGetCoinInfo = await race(CoinGecko.getCoinInfo({ symbol }), 10000);
            if (resultGetCoinInfo.status === 'SUCCESS') {
              const image = resultGetCoinInfo.data.image.small;
              newData[it].image = image;
            }
          } catch (e) {
            console.error(e);
            newData[it].image = imageTokenPay;
          }
        }
        newData[it].address = address;
        newData[it].decimals = decimals;
        // eslint-disable-next-line no-continue
        continue;
      }
      return newData;
    },
    [tokensCryptoCompare],
  );

  const getTokens = React.useCallback(async () => {
    try {
      const resultGetTokens = await Zx.getTokens();
      const newTokens = resultGetTokens.data;
      console.log('App getTokens:', newTokens);
      // eslint-disable-next-line no-confusing-arrow
      newTokens.sort((a: any, b: any) => (a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0));
      newTokens.unshift(tokenGear);
      const tokens = await changeTokensInfo(newTokens);
      setTokens({ tokens });
      setTokens0x(tokens);
    } catch (e) {
      console.error('App getTokens:', e);
    }
  }, [setTokens, changeTokensInfo]);

  const getTokensBalances = React.useCallback(async () => {
    try {
      setStatus({ loadingBalances: 'loading' });
      const balances = {};
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < tokens0x.length; i++) {
        const token = tokens0x[i];
        const { symbol, address }: { symbol: string; address: string } = token;
        let balance = 0;
        if (symbol === 'ETH') {
          // eslint-disable-next-line no-await-in-loop
          balance = await web3Provider.getBalance(userAddress);
        } else {
          // eslint-disable-next-line no-await-in-loop
          balance = await web3Provider.balanceOf({
            address: userAddress,
            contractAddress: address,
            contractAbi: erc20Abi,
          });
        }
        (balances as any)[symbol] = balance;
      }
      console.log('App getTokensBalances balances:', balances);
      setUserData({ balances });
      setStatus({ loadingBalances: 'done' });
    } catch (e) {
      console.error('App getTokensBalances:', e);
      setStatus({ loadingBalances: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens0x, setTokens, setUserData, userAddress, web3Provider]);

  React.useEffect(() => {
    // getTokensFromCoinGecko();
    getTokensFromCryptoCompare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!tokensCryptoCompare || tokensCryptoCompare?.length === 0) return;
    getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensCryptoCompare]);

  React.useEffect(() => {
    if (!tokens0x || tokens0x?.length === 0) return;
    if (!userAddress) return;
    getTokensBalances();
    const interval = setInterval(() => getTokensBalances(), 10000);
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens0x, userAddress]);

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
