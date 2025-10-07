/* global window */
import { applyMiddleware, compose, createStore } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import createActionBuffer from 'redux-action-buffer';
import { autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import ReduxPersistSettings from './persistence/redux-persist-settings';
import ReduxPersistService from '../services/redux-persist-service';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers/';
import sagas from '../sagas/';

const sagaMiddleware = createSagaMiddleware();
const routingMiddleware = routerMiddleware(browserHistory);

// Redux Dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const middleware = [
    sagaMiddleware,
    routingMiddleware,
    createActionBuffer(REHYDRATE)
  ];
  const enhancers = [applyMiddleware(...middleware)];

  if (ReduxPersistSettings.active) {
    enhancers.push(autoRehydrate());
  }

  const store = createStore(rootReducer, composeEnhancers(...enhancers));

  ReduxPersistService.updateReducers(store);
  sagaMiddleware.run(sagas);

  if (__DEV__) {
    window.store = store;
  }

  return store;
};
