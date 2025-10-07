import { takeEvery, takeLatest, put, call, select } from 'redux-saga/effects';
import React from 'react';
import { filter } from 'ramda';
import Slugify from 'slugify';
import common from 'app/common';
import { translate } from 'app/intl';

import { Types, Creators } from '../actions';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifyError, notifySuccess }
} = common.util;

export default api => {
  /**
   * Get sectors sagas
   */
  function* getSectorsAttempt() {
    try {
      const resp = yield call(api.getSectors);
      const { data } = yield checkResponse(resp);
      yield put(Creators.getSectorsSuccess(data));
    } catch (err) {
      yield put(
        Creators.getSectorsFailure(yield translate('sector_get_failed'))
      );
    }
  }

  function* getSectorsFailure({ errorCode }) {
    yield put(notifyError(errorCode, { canDimiss: true, duration: 30000 }));
  }

  function* getSectorAttempt(action) {
    console.log(action);
    const sectors = yield select(getSectors);
    if (!sectors) {
      yield takeLatest(Types.GET_SECTORS_SUCCESS, () =>
        getSectorAttempt(action)
      );
      yield put(Actions.getSectorsAttempt());
    } else {
      // Find sector ID by sector name
      const id = filter(
        n => Slugify(n.title.toLowerCase()) === action.sectorName,
        sectors
      )[0].sector_id;
      try {
        const resp = yield call(api.getSector, id);
        const { data } = yield checkResponse(resp);
        yield put(Actions.getSectorSuccess(data));
      } catch (err) {
        yield put(
          Actions.getSectorFailure(yield translate('sector_get_failed'))
        );
      }
    }
  }

  function* getSectorFailure({ errorCode }) {
    yield put(
      notifyError(errorCode, {
        duration: 30000,
        canDimiss: true
      })
    );
  }

  function* createSectorAttempt(action) {
    try {
      const resp = yield call(
        api.createSector,
        convertToFormData(action.params)
      );
      const { data } = yield checkResponse(resp);
      yield put(Creators.createSectorSuccess(data));
      yield put(
        notifySuccess(yield translate('sector_created'), {
          duration: 2000,
          canDimiss: true
        })
      );
    } catch (err) {
      yield put(
        Creators.createSectorFailure(yield translate('sector_create_failed'))
      );
    }
  }

  function* createSectorFailure({ errorCode }) {
    yield put(notifyError(errorCode, { canDimiss: true, duration: 30000 }));
  }

  function* updateSectorAttempt(action) {
    try {
      const resp = yield call(
        api.updateSector,
        convertToFormData(action.params),
        action.id
      );
      const { data } = yield checkResponse(resp);
      yield put(Creators.updateSectorSuccess(data, action.id));
      yield put(
        notifySuccess(yield translate('sector_updated'), {
          duration: 2000,
          canDimiss: true
        })
      );
    } catch (err) {
      yield put(Creators.updateSectorFailure(err));
    }
  }

  function* updateSectorFailure(action) {
    yield put(
      notifyError(action.errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* deleteSectorAttempt(action) {
    try {
      const resp = yield call(api.deleteSector, action.id);
      yield put(Creators.deleteSectorSuccess(action.id));
      yield put(
        notifySuccess(yield translate('sector_deleted'), {
          duration: 2000,
          canDimiss: true
        })
      );
    } catch (err) {
      yield put(Creators.deleteSectorFailure(err));
    }
  }

  function* deleteSectorFailure(action) {
    yield put(
      notifyError(action.errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* startWatchers() {
    yield takeEvery(Types.GET_SECTORS_ATTEMPT, getSectorsAttempt);
    yield takeEvery(Types.GET_SECTOR_ATTEMPT, getSectorAttempt);
    yield takeEvery(Types.CREATE_SECTOR_ATTEMPT, createSectorAttempt);
    yield takeEvery(Types.UPDATE_SECTOR_ATTEMPT, updateSectorAttempt);
    yield takeEvery(Types.DELETE_SECTOR_ATTEMPT, deleteSectorAttempt);

    yield takeEvery(Types.GET_SECTORS_FAILURE, getSectorsFailure);
    yield takeEvery(Types.GET_SECTOR_FAILURE, getSectorFailure);
    yield takeEvery(Types.CREATE_SECTOR_FAILURE, createSectorFailure);
    yield takeEvery(Types.UPDATE_SECTOR_FAILURE, updateSectorFailure);
    yield takeEvery(Types.DELETE_SECTOR_FAILURE, deleteSectorFailure);
  }

  return {
    startWatchers,

    getSectorsAttempt,
    getSectorAttempt,
    createSectorAttempt,
    updateSectorAttempt,
    deleteSectorAttempt,

    getSectorsFailure,
    getSectorFailure,
    createSectorFailure,
    updateSectorFailure,
    deleteSectorFailure
  };
};
