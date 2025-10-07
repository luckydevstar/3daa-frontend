import { takeEvery, put, call } from 'redux-saga/effects';
import refactorUnitsData from '../util/refactor-unit-data';

import { Types, Creators as Actions } from '../actions';
import { translate } from 'app/intl';
import common from 'app/common';

const {
  helpers: { checkResponse },
  notify: { notifyError, notifySuccess }
} = common.util;

export default api => {
  /**
   * GET
   */
  function* getUnitsAttempt(action) {
    try {
      const params = action.params || null;
      const resp = yield call(api.getUnits, params);
      const data = yield checkResponse(resp);
      data.data.units = refactorUnitsData(data.data.units);
      yield put(Actions.getUnitsSuccess(data));
    } catch (err) {
      yield put(Actions.getUnitsFailure(err));
    }
  }

  function* getUnitsFailure(action) {
    const { errorCode } = action;
    console.log(errorCode);
  }

  function* getUnitAttempt(action) {
    try {
      const resp = yield call(api.getUnit, action.id);
      const data = yield checkResponse(resp);

      data.data.units = refactorUnitsData(data.data.units);
      yield put(Actions.getUnitSuccess(data));
    } catch (err) {
      yield put(Actions.getUnitFailure(err));
    }
  }

  function* getUnitFailure(action) {
    const { errorCode } = action;
    console.log(errorCode);
  }

  /**
   * POST
   */
  function* postUnitsAttempt(action) {
    try {
      const resp = yield call(api.postUnits, action.unit);
      const data = yield checkResponse(resp);
      yield put(Actions.postUnitsSuccess(data));
    } catch (err) {
      yield put(Actions.postUnitsFailure(err));
    }
  }

  function* postUnitsSuccess() {
    yield put(
      notifySuccess(yield translate('unit_created'), {
        duration: 1000,
        canDimiss: true
      })
    );
    yield getUnitsAttempt({
      params: { limit: 20, offset: 0, sort: 'unit_id', order: 'desc' }
    });
  }

  function* postUnitsFailure(action) {
    const { errorCode } = action;
    console.log('Failure: ', errorCode);
    // TODO api error?
    yield put(
      notifyError(yield translate('unit_create_failed'), {
        duration: 1000,
        canDimiss: true
      })
    );
  }

  /**
   * PUT
   * @param  {object}    unit [Units object]
   * @return {Generator}      [description]
   */
  function* putUnitsAttempt(action) {
    try {
      const resp = yield call(api.putUnits, action.unit);
      const data = yield checkResponse(resp);
      yield put(Actions.putUnitsSuccess(data));
    } catch (err) {
      yield put(Actions.putUnitsFailure(err));
    }
  }

  function* putUnitsSuccess() {
    yield put(
      notifySuccess(yield translate('unit_updated'), {
        duration: 1000,
        canDimiss: true
      })
    );
  }

  function* putUnitsFailure(action) {
    const { errorCode } = action;
    console.log('Failure: ', errorCode);
    // TODO api error?
    yield put(
      notifyError(yield translate('unit_update_failed'), {
        duration: 1000,
        canDimiss: true
      })
    );
  }

  /**
   * DELETE
   */
  function* deleteUnitsAttempt(action) {
    // make the call to the api
    try {
      const resp = yield call(api.deleteUnits, action.id);
      const data = yield checkResponse(resp);
      const params = action.params || null;
      yield put(Actions.deleteUnitsSuccess(data, params));
    } catch (err) {
      yield put(Actions.deleteUnitsFailure(err));
    }
  }

  function* deleteUnitsSuccess(action) {
    yield put(
      notifySuccess(yield translate('unit_deleted'), {
        duration: 1000,
        canDimiss: true
      })
    );
    yield getUnitsAttempt({ params: action.params });
  }

  function* deleteUnitsFailure(action) {
    const { errorCode } = action;
    console.log(errorCode);
    // TODO api error?
    yield put(
      notifyError(yield translate('unit_delete_failed'), {
        duration: 1000,
        canDimiss: true
      })
    );
  }

  // -----------
  // The Main Watcher function
  // -----------
  function* startWatchers() {
    yield takeEvery(Types.GET_UNITS_ATTEMPT, getUnitsAttempt);
    yield takeEvery(Types.GET_UNITS_FAILURE, getUnitsFailure);
    yield takeEvery(Types.GET_UNIT_ATTEMPT, getUnitAttempt);
    yield takeEvery(Types.GET_UNIT_FAILURE, getUnitFailure);
    yield takeEvery(Types.POST_UNITS_ATTEMPT, postUnitsAttempt);
    yield takeEvery(Types.POST_UNITS_SUCCESS, postUnitsSuccess);
    yield takeEvery(Types.POST_UNITS_FAILURE, postUnitsFailure);
    yield takeEvery(Types.PUT_UNITS_ATTEMPT, putUnitsAttempt);
    yield takeEvery(Types.PUT_UNITS_SUCCESS, putUnitsSuccess);
    yield takeEvery(Types.PUT_UNITS_FAILURE, putUnitsFailure);
    yield takeEvery(Types.DELETE_UNITS_ATTEMPT, deleteUnitsAttempt);
    yield takeEvery(Types.DELETE_UNITS_SUCCESS, deleteUnitsSuccess);
    yield takeEvery(Types.DELETE_UNITS_FAILURE, deleteUnitsFailure);
  }

  return {
    startWatchers,
    getUnitsAttempt,
    getUnitsFailure,
    getUnitAttempt,
    getUnitFailure,
    postUnitsAttempt,
    postUnitsSuccess,
    postUnitsFailure,
    putUnitsAttempt,
    putUnitsSuccess,
    putUnitsFailure,
    deleteUnitsAttempt,
    deleteUnitsSuccess,
    deleteUnitsFailure
  };
};
