import React from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import imageTokenPay from './assets/images/token.png';
import tokensListData from './data/coinlist.json';
import { zxActions } from './redux/actions';
import { Service0x } from './services/0x';
// import { CryptoCompareService } from './services/CryptoCompareService';
import * as Components from './components';
import * as Pages from './pages';

// const tokensList: any = {
//   DAI: {
//     Name: 'Dai',
//     CoinName: 'Dai',
//     ImageUrl: 'Dai',
//   },
// };

const tokenGear = {
  symbol: 'GEAR',
  name: 'Bitgear',
  price: null,
  decimals: 18,
  address: '0x1b980e05943dE3dB3a459C72325338d327B6F5a9', // not for kovan
};

const Zx = new Service0x();
// const CryptoCompare = new CryptoCompareService();

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const setTokens = React.useCallback((props: any) => dispatch(zxActions.setTokens(props)), [
    dispatch,
  ]);

  const [tokensCryptoCompare, setTokensCryptoCompare] = React.useState<any[]>([]);

  const getTokensFromCryptoCompare = async () => {
    try {
      // const result = await CryptoCompare.getAllCoins();
      // console.log('App getTokensFromCryptoCompare:', result.data);
      // if (result.status === 'SUCCESS') {
      //   const newTokens = result.data;
      //   setTokensCryptoCompare(newTokens);
      // }
      const newTokens = (tokensListData as any).Data;
      console.log('App getTokensFromCryptoCompare:', newTokens);
      setTokensCryptoCompare(newTokens);
    } catch (e) {
      console.error(e);
    }
  };

  const changeTokensInfo = React.useCallback(
    (data) => {
      const newData = data;
      data.map((token: any, it: number) => {
        const { symbol, address, decimals } = token;
        const isImage = tokensCryptoCompare[symbol] && tokensCryptoCompare[symbol].ImageUrl;
        newData[it].image = isImage
          ? `https://www.cryptocompare.com/media${tokensCryptoCompare[symbol].ImageUrl}`
          : imageTokenPay;
        newData[it].address = address;
        newData[it].decimals = decimals;
        return null;
      });
      return newData;
    },
    [tokensCryptoCompare],
  );

  const getTokens = React.useCallback(async () => {
    try {
      const resultGetTokens = await Zx.getTokens();
      const newTokens = resultGetTokens.data;
      console.log('getTokens:', newTokens);
      newTokens.push(tokenGear);
      const tokens = changeTokensInfo(newTokens);
      setTokens({ tokens });
    } catch (e) {
      console.error('getTokens:', e);
    }
  }, [setTokens, changeTokensInfo]);

  React.useEffect(() => {
    getTokensFromCryptoCompare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!tokensCryptoCompare || tokensCryptoCompare?.length === 0) return;
    getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensCryptoCompare]);

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
              <Pages.PageAccount />
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
