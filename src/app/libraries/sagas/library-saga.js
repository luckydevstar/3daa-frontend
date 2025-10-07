import { takeEvery, put, call } from 'redux-saga/effects';
import { checkResponse } from 'app/common/util/helpers';
import Type from '../actions/type';
import Actions from '../actions/creator';

export default api => {
  function* getActivitiesAttempt(action) {
    try {
      const resp = yield call(api.getActivities, action.payload);
      const { data } = yield checkResponse(resp);
      yield put(Actions.getActivitiesSuccess(data));
    } catch (err) {
      yield put(Actions.getActivitiesFailure(err));
    }
  }

  function* startWatchers() {
    yield takeEvery(Type.GET_ACTIVITIES_ATTEMPT, getActivitiesAttempt);
  }

  return {
    startWatchers,
    getActivitiesAttempt
  };
};
