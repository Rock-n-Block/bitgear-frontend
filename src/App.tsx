import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import * as Components from './components';
import * as Pages from './pages';

export const App: React.FC = () => {
  return (
    <Router>
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
          <Route path="*">
            <Pages.Page404 />
          </Route>
        </Switch>
      </main>
    </Router>
  );
};
