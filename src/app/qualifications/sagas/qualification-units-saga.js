import { takeEvery, takeLatest, put, call, select } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { path } from 'ramda';
import refactorUnitsData from 'app/units/util/refactor-unit-data';

import { Types, Creators as Actions } from '../actions';
import { translate } from 'app/intl';
import common from 'app/common';

const {
  helpers: { checkResponse },
  notify: { notifyError, notifySuccess }
} = common.util;

export default api => {
  function* getQualificationUnitTypesAttempt(action) {
    try {
      yield put(Actions.getQualificationUnitTypesSuccess([]));
    } catch (err) {
      yield put(Actions.getQualificationUnitTypesFailure(err));
    }
  }

  function* getQualificationUnitTypesFailure(action) {
    const { errorCode } = action;
    console.log(errorCode);
  }

  function* getQualificationUnitAttempt(action) {
    try {
      const resp = yield call(api.getUnit, action.id);
      const data = yield checkResponse(resp);
      data.data.units = refactorUnitsData(data.data.units);
      yield put(Actions.getQualificationUnitSuccess(data));
    } catch (err) {
      yield put(Actions.getQualificationUnitFailure(err));
    }
  }

  function* getQualificationUnitFailure(action) {
    const { errorCode } = action;
    console.log(errorCode);
  }

  function* createQualificationUnitAttempt(action) {
    try {
      const resp = yield call(api.postUnits, action.unit);
      const data = yield checkResponse(resp);
      yield put(Actions.createQualificationUnitSuccess(data));
    } catch (err) {
      yield put(Actions.createQualificationUnitFailure(err));
    }
  }

  function* createQualificationUnitSuccess() {
    yield put(
      notifySuccess(yield translate('unit_created'), {
        duration: 1000,
        canDimiss: true
      })
    );
    // yield getQualificationUnitsAttempt({
    //   params: { limit: 20, offset: 0, sort: 'unit_id', order: 'desc' }
    // });
  }

  function* createQualificationUnitFailure(action) {
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
   * @param  {object}    unit [QualificationUnits object]
   * @return {Generator}      [description]
   */
  function* updateQualificationUnitAttempt(action) {
    try {
      const resp = yield call(
        api.putUnits,
        convertToFormData(action.payload),
        action.id
      );
      const data = yield checkResponse(resp);
      yield put(Actions.updateQualificationUnitSuccess(data));
    } catch (err) {
      yield put(Actions.updateQualificationUnitFailure(err));
    }
  }

  function* updateQualificationUnitSuccess() {
    yield put(
      notifySuccess(yield translate('unit_updated'), {
        duration: 1000,
        canDimiss: true
      })
    );
  }

  function* updateQualificationUnitFailure(action) {
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
  function* deleteQualificationUnitAttempt(action) {
    // make the call to the api
    try {
      const resp = yield call(api.deleteUnits, action.id);
      const data = yield checkResponse(resp);
      const params = action.params || null;
      yield put(Actions.deleteQualificationUnitSuccess(data, params));
    } catch (err) {
      yield put(Actions.deleteQualificationUnitFailure(err));
    }
  }

  function* deleteQualificationUnitSuccess(action) {
    yield put(
      notifySuccess(yield translate('unit_deleted'), {
        duration: 1000,
        canDimiss: true
      })
    );
    // yield getQualificationUnitsAttempt({ params: action.params });
  }

  function* deleteQualificationUnitFailure(action) {
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

  // Delete workbook from unit
  function* deleteWorkbookFromUnitAttempt(action) {
    try {
      const { unit_id, workbook_id } = action;
      const res = yield call(api.deleteWorkbookFromUnit, unit_id, workbook_id);
      const data = yield checkResponse(res);
      yield put(Actions.deleteWorkbookFromUnitSuccess(unit_id, workbook_id));
    } catch (err) {
      yield put(Actions.deleteWorkbookFromUnitFailure());
    }
  }

  function* deleteWorkbookFromUnitSuccess(action) {
    const { unit_id } = action;
    const sector = yield select(state => path(['persisted', 'sector'], state));
    const qualificationId = yield select(state =>
      path(
        [
          'qualifications',
          'currentQualification',
          'qualification',
          'qualification_id'
        ],
        state
      )
    );
    yield put(
      notifySuccess(yield translate('Workbook deleted successfully.'), {
        duration: 3000,
        canDimiss: true
      })
    );
    browserHistory.push(
      `/qualifications/${sector.title}/${qualificationId}/${unit_id}`
    );
  }

  function* deleteWorkbookFromUnitFailure() {
    yield put(
      notifyError(yield translate('Workbook delete failure.'), {
        duration: 3000,
        canDimiss: true
      })
    );
  }

  // -----------
  // The Main Watcher function
  // -----------
  function* startWatchers() {
    yield takeEvery(
      Types.GET_QUALIFICATION_UNIT_TYPES_ATTEMPT,
      getQualificationUnitTypesAttempt
    );
    yield takeEvery(
      Types.GET_QUALIFICATION_UNIT_TYPES_FAILURE,
      getQualificationUnitTypesFailure
    );

    yield takeEvery(
      Types.GET_QUALIFICATION_UNIT_ATTEMPT,
      getQualificationUnitAttempt
    );
    yield takeEvery(
      Types.GET_QUALIFICATION_UNIT_FAILURE,
      getQualificationUnitFailure
    );
    yield takeEvery(
      Types.CREATE_QUALIFICATION_UNIT_ATTEMPT,
      createQualificationUnitAttempt
    );
    yield takeEvery(
      Types.CREATE_QUALIFICATION_UNIT_SUCCESS,
      createQualificationUnitSuccess
    );
    yield takeEvery(
      Types.CREATE_QUALIFICATION_UNIT_FAILURE,
      createQualificationUnitFailure
    );
    yield takeEvery(
      Types.UPDATE_QUALIFICATION_UNIT_ATTEMPT,
      updateQualificationUnitAttempt
    );
    yield takeEvery(
      Types.UPDATE_QUALIFICATION_UNIT_SUCCESS,
      updateQualificationUnitSuccess
    );
    yield takeEvery(
      Types.UPDATE_QUALIFICATION_UNIT_FAILURE,
      updateQualificationUnitFailure
    );
    yield takeEvery(
      Types.DELETE_QUALIFICATION_UNIT_ATTEMPT,
      deleteQualificationUnitAttempt
    );
    yield takeEvery(
      Types.DELETE_QUALIFICATION_UNIT_SUCCESS,
      deleteQualificationUnitSuccess
    );
    yield takeEvery(
      Types.DELETE_QUALIFICATION_UNIT_FAILURE,
      deleteQualificationUnitFailure
    );
    yield takeLatest(
      Types.DELETE_WORKBOOK_FROM_UNIT_ATTEMPT,
      deleteWorkbookFromUnitAttempt
    );
    yield takeEvery(
      Types.DELETE_WORKBOOK_FROM_UNIT_SUCCESS,
      deleteWorkbookFromUnitSuccess
    );
    yield takeEvery(
      Types.DELETE_WORKBOOK_FROM_UNIT_FAILURE,
      deleteWorkbookFromUnitFailure
    );
  }

  return {
    startWatchers,
    getQualificationUnitTypesAttempt,
    getQualificationUnitTypesFailure,

    getQualificationUnitAttempt,
    getQualificationUnitFailure,

    createQualificationUnitAttempt,
    createQualificationUnitSuccess,
    createQualificationUnitFailure,

    updateQualificationUnitAttempt,
    updateQualificationUnitSuccess,
    updateQualificationUnitFailure,

    deleteQualificationUnitAttempt,
    deleteQualificationUnitSuccess,
    deleteQualificationUnitFailure
  };
};
