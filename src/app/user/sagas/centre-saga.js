import { takeEvery, put, call } from 'redux-saga/effects';
import common from 'app/common';
import { Types as Type, Creators as Actions } from 'app/user/actions';
import { checkResponse } from 'app/common/util/helpers';

const convertToFormData = common.util.helpers.convertToFormData;

export default api => {
  /**
   * Update centre
   */
  const { updateCentre } = api;

  function* updateCentreAttempt(action) {
    const { payload, id } = action;
    try {
      const resp = yield call(updateCentre, convertToFormData(payload), id);
      yield checkResponse(resp);
      yield put(Actions.updateCentreSuccess(resp.data.data));
    } catch (err) {
      console.log(err);
      yield put(Actions.updateCentreFailure());
    }
  }

  function* updateCentreSuccess(action) {
    console.log('Update centre success');
  }

  function* updateCentreFailure(action) {
    console.log('updateCentreFailure');
  }

  /**
   * Get centre user seats
   */
  function* getCentreSeatsAttempt(action) {
    const { id } = action;
    try {
      const resp = yield call(api.getCentreSeats, id);
      const {
        data: { seats }
      } = yield checkResponse(resp);
      yield put(Actions.getCentreSeatsSuccess(seats || []));
    } catch (err) {
      yield put(Actions.getCentreSeatsFailure(err));
    }
  }

  function* getCentreSeatsSuccess(action) {
    console.log('getCentreSeatsSuccess:', action);
  }

  function* getCentreSeatsFailure(action) {
    console.log('getCentreSeatsFailure:', action);
  }

  /**
   * Get centre profile
   */
  function* getCentreProfileAttempt(action) {
    const { id } = action;
    try {
      const resp = yield call(api.getCentreProfile, id);
      const { data } = yield checkResponse(resp);
      yield put(Actions.getCentreProfileSuccess(data));
    } catch (err) {
      yield put(Actions.getCentreProfileFailure(err));
    }
  }

  function* getCentreProfileSuccess(action) {
    // console.log('getCentreProfileSuccess:', action);
  }

  function* getCentreProfileFailure(action) {
    // console.log('getCentreProfileFailure:', action);
  }

  function* startWatchers() {
    yield takeEvery(Type.UPDATE_CENTRE_ATTEMPT, updateCentreAttempt);
    yield takeEvery(Type.UPDATE_CENTRE_SUCCESS, updateCentreSuccess);
    yield takeEvery(Type.UPDATE_CENTRE_FAILURE, updateCentreFailure);
    yield takeEvery(Type.GET_CENTRE_SEATS_ATTEMPT, getCentreSeatsAttempt);
    yield takeEvery(Type.GET_CENTRE_SEATS_SUCCESS, getCentreSeatsSuccess);
    yield takeEvery(Type.GET_CENTRE_SEATS_FAILURE, getCentreSeatsFailure);
    yield takeEvery(Type.GET_CENTRE_PROFILE_ATTEMPT, getCentreProfileAttempt);
    yield takeEvery(Type.GET_CENTRE_PROFILE_SUCCESS, getCentreProfileSuccess);
    yield takeEvery(Type.GET_CENTRE_PROFILE_FAILURE, getCentreProfileFailure);
  }

  return {
    startWatchers,
    updateCentreAttempt,
    updateCentreSuccess,
    updateCentreFailure,
    getCentreSeatsAttempt,
    getCentreSeatsSuccess,
    getCentreSeatsFailure,
    getCentreProfileAttempt,
    getCentreProfileSuccess,
    getCentreProfileFailure
  };
};
