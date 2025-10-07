import { delay } from 'redux-saga';
import { takeEvery, take, put, call, fork, select } from 'redux-saga/effects';
import { routerActions } from 'react-router-redux';

import Type from '../actions';

export default api => {
  function* getExampleAttempt(action) {}

  // -----------
  // The Main Watcher function
  // -----------
  function* startWatchers() {
    yield takeEvery(Type.EXAMPLE_ACTION, getExampleAttempt);
  }

  return {
    startWatchers,
    getExampleAttempt
  };
};
