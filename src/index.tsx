import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import Connector from './services/WalletConnect';
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
