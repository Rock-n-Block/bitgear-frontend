import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

import Connector from './contexts/WalletConnect';
import store from './redux/store';
import { App } from './App';

import './index.scss';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/gundamdweeb/bifrost',
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
