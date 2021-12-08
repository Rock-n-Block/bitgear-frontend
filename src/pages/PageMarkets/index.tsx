import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { PageMarketsContent } from './PageMarketsContent';

import s from './style.module.scss';

type TypeRouteMatch = {
  path?: string;
  url?: string;
};

export const PageMarkets: React.FC = () => {
  const { path } = useRouteMatch<TypeRouteMatch>();

  return (
    <div className={s.marketWrapper}>
      <div className="shadowCenter" />
      <div className={s.container}>
        <Switch>
          <Route path={path} exact>
            <Redirect to="/explore" />
          </Route>
          <Route path={`${path}/:addressOne/:addressTwo`}>
            <PageMarketsContent />
          </Route>
          <Route path={`${path}/:addressOne`}>
            <PageMarketsContent />
          </Route>
        </Switch>
      </div>
    </div>
  );
};
