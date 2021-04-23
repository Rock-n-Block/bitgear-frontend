import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Connector from './contexts/WalletConnect';
import store from './redux/store';
import { App } from './App';

import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Connector>
        <App />
      </Connector>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
