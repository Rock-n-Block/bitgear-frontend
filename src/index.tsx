import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

import Connector from './contexts/WalletConnect';
import store from './redux/store';
import { stylizeConsole } from './utils/console';
import { App } from './App';
import config from './config';

import './index.scss';

stylizeConsole({ showConsoleLog: config.SHOW_CONSOLE_LOGS });

const client = new ApolloClient({
  uri: config.apis.theGraph,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Connector>
          <App />
        </Connector>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
