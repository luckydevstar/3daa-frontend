import { takeEvery, put, select, call } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import { checkResponse } from 'app/common/util/helpers';
import { Creators } from 'app/core/actions';
import user from 'app/user';

const UserAction = user.Actions;
const getToken = state => state.persisted.token;
const urlParam = name => {
  const match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

export default api => {
  /**
   *  resumeSession():
   * - Handles automatically logging in a user from persistence
   * - Handles clearing the session/token if the route requires it
   */
  function* resumeSession() {
    const token = yield select(getToken);
    const clearSession = urlParam('clearSession');
    if (token) {
      if (clearSession) {
        yield put(UserAction.logout(true, true));
      } else {
        // console.info('Token being loaded from persistence: ', { token });
        yield put(UserAction.loginSuccess({ token }));
      }
    }
  }

  function* getConfigAttempt() {
    try {
      const resp = yield call(api.getConfig);
      const { data } = yield checkResponse(resp);
      yield put(Creators.getConfigSuccess(data));
    } catch (err) {
      yield put(Creators.getConfigFailure(err));
    }
  }

  function* startWatchers() {
    yield takeEvery(REHYDRATE, resumeSession);
    yield put(Creators.appStart());
    yield getConfigAttempt();
    yield put(Creators.toggleAppLoading(false));
  }

  return {
    startWatchers,
    resumeSession,
    getConfigAttempt
  };
};
