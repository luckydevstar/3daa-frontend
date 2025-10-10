/**
 * Main entry point
 * */
import 'babel-polyfill';
import './assets/styles/styles.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import HttpsRedirect from 'react-https-redirect';

import Routes from 'app/core/config/routes';
import configureStore from 'app/core/config/store';

import 'antd/dist/antd.css';

const store = configureStore();

const Main = () => (
  <Provider store={store}>
    <HttpsRedirect>{Routes(store)}</HttpsRedirect>
  </Provider>
);

ReactDOM.render(<Main />, document.getElementById('main'));
