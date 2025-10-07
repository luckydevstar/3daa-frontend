import { takeEvery, put, call, fork } from 'redux-saga/effects';
import { Types as Type, Creators as Actions } from 'app/user/actions';
import { checkResponse } from 'app/common/util/helpers';
import { browserHistory } from 'react-router';

export default api => {
  function* updateSettingsAttempt(action) {
    // action contains member_id and values which is a FormData object
    try {
      // let apiCall = api.updateProfileOther;
      const uln = action.values.get('uln');
      // if (uln) {
      //   apiCall = api.updateProfileOtherV1;
      // }

      const resp = yield call(api.updateProfileOtherV1, action);

      yield checkResponse(resp);
      yield put(Actions.updateLocalUser(resp.data.data));
      yield put(Actions.updateSettingsSuccess());

      if (uln) {
        browserHistory.push('/dashboard');
      }
    } catch (err) {
      console.log('caught an error', err);
      yield put(Actions.updateSettingsFailure());
    }
  }

  // -----------
  // The Main Watcher function
  // -----------
  function* startWatchers() {
    yield takeEvery(Type.UPDATE_SETTINGS_ATTEMPT, updateSettingsAttempt);
  }

  return {
    startWatchers,
    updateSettingsAttempt
  };
};
