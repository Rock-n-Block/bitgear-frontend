import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import BigNumber from 'bignumber.js/bignumber';

import imageTokenPay from './assets/images/token.png';
import { useWalletConnectorContext } from './contexts/WalletConnect';
import tokensListData from './data/coinlist.json';
import tokenGear from './data/gearToken';
import { statusActions, userActions, zxActions } from './redux/actions';
import { userSelectors } from './redux/selectors';
import { Service0x } from './services/0x';
import { AlchemyService } from './services/Alchemy';
import { CoinMarketCapService } from './services/CoinMarketCap';
import { CryptoCompareService } from './services/CryptoCompareService';
import * as Components from './components';
import config from './config';
import * as Pages from './pages';

const GET_TOKENS = gql`
  query Token($first: Int, $skip: Int) {
    tokens(first: $first, skip: $skip) {
      id
      symbol
      decimals
    }
  }
`;

const Zx = new Service0x();
const CryptoCompare = new CryptoCompareService();
const CoinMarketCap = new CoinMarketCapService();
const Alchemy = new AlchemyService();

const AppComponent: FC = () => {
  const { web3Provider } = useWalletConnectorContext();

  const { fetchMore: fetchMoreGetTokensFromGraphQuery } = useQuery(GET_TOKENS, {
    variables: { first: 1000, skip: 0 },
  });

  const dispatch = useDispatch();
  const setTokens = React.useCallback(
    (props: any) => dispatch(zxActions.setTokens(props)),
    [dispatch],
  );
  const setUserData = React.useCallback(
    (props: any) => dispatch(userActions.setUserData(props)),
    [dispatch],
  );
  const setStatus = React.useCallback(
    (props: any) => dispatch(statusActions.setStatus(props)),
    [dispatch],
  );
  const { address: userAddress = '' } = useSelector(userSelectors.getUser);

  const [tokenAddresses, setTokenAddresses] = React.useState<string[]>([]);
  const [tokens0x, setTokens0x] = React.useState<any[]>([]);
  const [tokensCryptoCompare, setTokensCryptoCompare] = React.useState<any[]>([]);
  const [tokensCryptoCompareFormatted, setTokensCryptoCompareFormatted] = React.useState<any[]>([]);
  const [tokensFromGraphFormatted, setTokensFromGraphFormatted] = React.useState<any[]>([]);
  const [tokensCMCByAddress, setTokensCMCByAddress] = React.useState<any>();
  const [symbolsCoinMarketCap, setSymbolsCoinMarketCap] = React.useState<any[]>([]);
  const [addressesCoinMarketCap, setAddressesCoinMarketCap] = React.useState<any[]>([]);

  const location = useLocation();

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

        const newImage = image ? `https://www.cryptocompare.com${image}` : null;
        newTokensFormatted.push({ symbol, name, address, decimals, image: newImage });
      }
      console.log('App getTokensFromCryptoCompare newTokensFormatted:', newTokensFormatted);
      setTokensCryptoCompare(newTokens);
      setTokensCryptoCompareFormatted(newTokensFormatted);
    } catch (e) {
      console.error('App getTokensFromCryptoCompare:', e);
    }
  };

  const getTokensFromGraph = async () => {
    try {
      let newTokensFromGraph: any[] = [];
      for (let i = 0; i <= 5; i += 1) {
        const resultFetchMoreGetTokens = await fetchMoreGetTokensFromGraphQuery({
          variables: { first: 1000, skip: 1000 * i },
        });
        if (resultFetchMoreGetTokens.data) {
          newTokensFromGraph = newTokensFromGraph.concat(resultFetchMoreGetTokens.data.tokens);
        }
      }
      const newTokensFromGraphFormatted = [];
      for (let i = 0; i < newTokensFromGraph.length; i += 1) {
        // todo: add name field from all tokens from graph
        const { symbol, decimals, id: address } = newTokensFromGraph[i];
        newTokensFromGraphFormatted.push({
          name: symbol,
          symbol,
          address,
          decimals,
        });
      }
      console.log('App getTokensFromGraph:', newTokensFromGraphFormatted);
      setTokensFromGraphFormatted(newTokensFromGraphFormatted);
    } catch (e) {
      console.error('App getTokensFromGraph:', e);
    }
  };

  const getTokensFromCoinMarketCap = async () => {
    try {
      const result = await CoinMarketCap.getAllCoins();
      let newTokens;
      if (result.status === 'SUCCESS') {
        newTokens = result.data;
      }
      const newTokensByAddress: any = {};
      const newSymbolsCMC = [];
      const newAddressesCMC = [];
      for (let i = 0; i < newTokens.length; i += 1) {
        const token = newTokens[i];
        const { id: idCMC, name, symbol, platform } = token;
        let address;
        if (symbol !== 'ETH') {
          if (!platform) continue;
          if (platform.symbol !== 'ETH') continue;
          address = platform.token_address.toLowerCase();
        } else {
          address = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
        }
        newTokensByAddress[address] = {
          idCMC,
          name,
          symbol,
          address,
        };
        newSymbolsCMC.push(symbol.toUpperCase());
        newAddressesCMC.push(address.toLowerCase());
      }
      setTokensCMCByAddress(newTokensByAddress);
      setSymbolsCoinMarketCap(newSymbolsCMC);
      setAddressesCoinMarketCap(newAddressesCMC);
    } catch (e) {
      console.error('App getTokensFromCoinMarketCap:', e);
    }
  };

  const changeTokensInfo = React.useCallback(
    async (data) => {
      const newData = [...data];
      const symbolsWithNoImage = data
        .filter((token: any) => {
          if (token.image) return false;
          if (token.symbol.match(/[^A-Za-z0-9]+/gi)) return false;
          if (!symbolsCoinMarketCap.includes(token.symbol.toUpperCase())) return false;
          return true;
        })
        .map((token: any) => {
          if (tokensCMCByAddress && tokensCMCByAddress[token.address.toLowerCase()])
            return tokensCMCByAddress[token.address.toLowerCase()].idCMC;
          return null;
        })
        .filter((item: any) => item);
      console.log('App changeTokensInfo symbolsWithNoImage:', symbolsWithNoImage);
      const interval = 1000;
      const count = symbolsWithNoImage.length / interval;
      // get tokens info
      let tokensInfo: any = {};
      for (let ir = 0; ir <= count; ir += 1) {
        const resultGetCoinInfo = await CoinMarketCap.getCoinInfo({
          id: symbolsWithNoImage.slice(interval * ir, interval * ir + interval).join(','),
        });
        console.log('App changeTokensInfo resultGetCoinInfo:', ir, resultGetCoinInfo);
        if (resultGetCoinInfo.status === 'SUCCESS') {
          tokensInfo = Object.assign(tokensInfo, resultGetCoinInfo.data);
        }
      }
      console.log('App changeTokensInfo tokensInfo:', tokensInfo);
      // set images to array
      for (let i = 0; i < data.length; i += 1) {
        const token = data[i];
        const { idCMC, image } = token;
        const tokensInfoToken = tokensInfo[idCMC];
        if (!image) {
          if (tokensInfoToken) {
            newData[i].image = tokensInfoToken.logo;
            newData[i].name = tokensInfoToken.name;
          } else {
            newData[i].image = imageTokenPay;
          }
        }
      }
      return newData;
    },
    [symbolsCoinMarketCap, tokensCMCByAddress],
  );

  const getTokens = React.useCallback(async () => {
    try {
      const resultGetTokens0x = await Zx.getTokens();
      const newTokens0x = resultGetTokens0x.data;
      // eslint-disable-next-line no-confusing-arrow
      newTokens0x.sort((a: any, b: any) => (a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0));
      console.log('App getTokens tokenGear:', tokenGear);
      const tokensAll = newTokens0x
        .concat(tokensCryptoCompareFormatted)
        .concat(tokensFromGraphFormatted);
      console.log('App getTokens tokensAll:', tokensAll);
      let tokensAllSorted = [...tokensAll]
        // eslint-disable-next-line no-confusing-arrow
        .sort((a: any, b: any) => {
          return a.symbol !== b.symbol ? (a.symbol < b.symbol ? -1 : 1) : 0;
        });
      console.log('App getTokens tokensAllSorted:', tokensAllSorted);
      tokensAllSorted = tokensAllSorted.filter((token: any, index: number) => {
        if (!addressesCoinMarketCap.includes(token.address.toLowerCase())) return false;
        if (index < tokensAllSorted.length) {
          if (
            tokensAllSorted[index].address.toLowerCase() ===
            tokensAllSorted[index + 1]?.address.toLowerCase()
          )
            return false;
        }
        return true;
      });
      tokensAllSorted = tokensAllSorted.map((token: any) => {
        const { address } = token;
        const newToken = token;
        newToken.idCMC =
          tokensCMCByAddress &&
          tokensCMCByAddress[address.toLowerCase()] &&
          tokensCMCByAddress[address.toLowerCase()].idCMC;
        return newToken;
      });
      console.log('App getTokens tokensAllSorted:', tokensAllSorted);
      const newTokensAllSorted = [...tokensAllSorted];
      const tokensAllFormatted = await changeTokensInfo(newTokensAllSorted);
      const newTokensByAddress: any = {};
      const newTokensBySymbol: any = {};
      const newTokenAddresses = tokensAllFormatted.map((token: any) => {
        const { address, symbol } = token;
        newTokensByAddress[address] = token;
        newTokensBySymbol[symbol] = token;
        return address;
      });
      setTokenAddresses(newTokenAddresses);
      setTokens({
        tokens: tokensAllFormatted,
        tokensByAddress: newTokensByAddress,
        tokensBySymbol: newTokensBySymbol,
      });
      setTokens0x(newTokens0x);
    } catch (e) {
      console.error('App getTokens:', e);
    }
  }, [
    tokensCMCByAddress,
    setTokens,
    changeTokensInfo,
    tokensCryptoCompareFormatted,
    tokensFromGraphFormatted,
    addressesCoinMarketCap,
  ]);

  const getTokensBalancesFromAlchemy = React.useCallback(async () => {
    try {
      setStatus({ loadingBalances: 'loading' });
      const resultGetBalances = await Alchemy.getBalances({
        userAddress: userAddress as string,
        contractAddresses: tokenAddresses,
      });
      console.log('App getTokenBalancesFromAlchemy resultGetBalances:', resultGetBalances);
      if (resultGetBalances.status === 'SUCCESS') {
        const newBalances = resultGetBalances.data;
        console.log('App getTokenBalancesFromAlchemy newBalances:', newBalances);
        try {
          const resultGetBalance = await web3Provider.getBalance(userAddress as string);
          if (resultGetBalance) {
            const newResultGetBalance = new BigNumber(resultGetBalance)
              .multipliedBy(new BigNumber(10).pow(18))
              .toString(10);
            newBalances['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'] = newResultGetBalance;
          }
        } catch (e) {
          console.error(e);
        }
        setUserData({ balances: newBalances });
      }
      setStatus({ loadingBalances: 'done' });
    } catch (e) {
      console.error('App getTokensBalancesFromAlchemy:', e);
      setStatus({ loadingBalances: 'error' });
    }
  }, [userAddress, tokenAddresses, setUserData, setStatus, web3Provider]);

  React.useEffect(() => {
    getTokensFromCryptoCompare();
    getTokensFromGraph();
    getTokensFromCoinMarketCap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!tokensCryptoCompare || tokensCryptoCompare?.length === 0) return;
    if (!tokensCryptoCompareFormatted || tokensCryptoCompareFormatted?.length === 0) return;
    if (!tokensFromGraphFormatted || tokensFromGraphFormatted?.length === 0) return;
    getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensCryptoCompare, tokensCryptoCompareFormatted, tokensFromGraphFormatted]);

  React.useEffect(() => {
    if (!tokens0x || tokens0x?.length === 0) return;
    if (!tokenAddresses || tokenAddresses?.length === 0) return;
    if (!userAddress) return;
    getTokensBalancesFromAlchemy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens0x, userAddress, tokenAddresses]);

  return (
    <div className="App">
      <Components.Header />
      <main className="container-App">
        <div className="app-version">
          <div className="app-version-text">{config.version}</div>
        </div>
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
          <Route path="/farm">
            <Pages.PageStake />
          </Route>
          <Route path="/settings">
            <Pages.PageSettings />
          </Route>
          <Route path="/login">
            <Pages.PageLogin />
          </Route>
          <Route path="/account">{userAddress ? <Pages.PageAccount /> : <Pages.PageLogin />}</Route>
          <Route path="*">
            <Pages.Page404 />
          </Route>
        </Switch>
      </main>
      {location.pathname === '/farm' && !userAddress ? null : <Components.Footer />}
      <Components.Modal />
    </div>
  );
};

export const App: FC = () => {
  return (
    <Router>
      <AppComponent />
    </Router>
  );
};
