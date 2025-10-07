/* eslint-disable no-restricted-syntax, no-prototype-builtins */
import React from 'react';
import { takeLatest, takeEvery, put, call, select } from 'redux-saga/effects';
import { browserHistory } from 'react-router';

import { Roles } from 'app/core/config/constants';
import UserRole from 'app/user/enums/user-role';
import common from 'app/common';
import { translate, translatef } from 'app/intl';

import { Types, Creators } from '../actions';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifySuccess, notifyError },
  sagaSelectors: { getUser }
} = common.util;

const { SuperAdmin, SiteAdmin } = Roles;

export default api => {
  /**
   * Attempt to get all centres
   */
  function* financeGetAllCentresAttempt({ params }) {
    try {
      // Send API calls
      const resp = yield call(api.getAdminCentre, params);
      const data = yield checkResponse(resp);
      yield put(Creators.financeGetAllCentresSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.financeGetAllCentresFailure(err));
    }
  }

  function* financeGetAllCentresFailure() {
    yield put(
      notifyError(yield translate('invitation_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  /**
   * Attempt to get all qualification licenses in a centre
   */
  function* financeGetCentreLicensesAttempt({ centre_id, params }) {
    try {
      // Send API calls
      const resp = yield call(api.getCentreLicenses, centre_id, params);
      const data = yield checkResponse(resp);
      yield put(Creators.financeGetCentreLicensesSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.financeGetCentreLicensesFailure(err));
    }
  }

  function* financeGetCentreLicensesFailure() {
    yield put(
      notifyError(yield translate('licenses_get_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  /**
   * Attempt to suspend a centre
   */
  function* financeSuspendCentreAttempt({ centre_id }) {
    try {
      // Send API calls
      const resp = yield call(api.putCentreSuspend, centre_id);
      const data = yield checkResponse(resp);
      yield put(Creators.financeSuspendCentreSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.financeSuspendCentreFailure(err));
    }
  }

  function* financeSuspendCentreFailure() {
    yield put(
      notifyError(yield translate('centre_suspend_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  /**
   * Attempt to suspend a centre
   */
  function* financeRestoreCentreAttempt({ centre_id }) {
    try {
      // Send API calls
      const resp = yield call(api.putCentreRestore, centre_id);
      const data = yield checkResponse(resp);
      yield put(Creators.financeRestoreCentreSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.financeRestoreCentreFailure(err));
    }
  }

  function* financeRestoreCentreFailure() {
    yield put(
      notifyError(yield translate('centre_active_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  /**
   * Attempt to suspend a license in centre
   */
  function* financeSuspendCentreLicenseAttempt({
    centre_id,
    qualification_license_id
  }) {
    try {
      // Send API calls
      const resp = yield call(
        api.putCentreLicenseSuspend,
        centre_id,
        qualification_license_id
      );
      const data = yield checkResponse(resp);
      yield put(Creators.financeSuspendCentreLicenseSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.financeSuspendCentreLicenseFailure(err));
    }
  }

  function* financeSuspendCentreLicenseFailure() {
    yield put(
      notifyError(yield translate('license_suspend_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  /**
   * Attempt to restore a license in a centre
   */
  function* financeRestoreCentreLicenseAttempt({
    centre_id,
    qualification_license_id
  }) {
    try {
      console.log(qualification_license_id);
      // Send API calls
      const resp = yield call(
        api.putCentreLicenseRestore,
        centre_id,
        qualification_license_id
      );
      const data = yield checkResponse(resp);
      yield put(Creators.financeRestoreCentreLicenseSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.financeSuspendCentreLicenseFailure(err));
    }
  }

  function* financeRestoreCentreLicenseFailure() {
    yield put(
      notifyError(yield translate('license_active_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  /**
   * Attempt to suspend all licenses in a centre
   */
  function* financeSuspendCentreLicensesAttempt({ centre_id }) {
    try {
      // Send API calls
      const resp = yield call(api.putCentreLicensesSuspend, centre_id);
      const data = yield checkResponse(resp);
      yield put(Creators.financeSuspendCentreLicensesSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.financeSuspendCentreLicensesFailure(err));
    }
  }

  function* financeSuspendCentreLicensesFailure() {
    yield put(
      notifyError(yield translate('license_suspend_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  /**
   * Attempt to restore all licenses in a centre
   */
  function* financeRestoreCentreLicensesAttempt({
    centre_id,
    qualification_license_id
  }) {
    try {
      console.log(qualification_license_id);
      // Send API calls
      const resp = yield call(
        api.putCentreLicensesRestore,
        centre_id,
        qualification_license_id
      );
      const data = yield checkResponse(resp);
      yield put(Creators.financeRestoreCentreLicensesSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.financeSuspendCentreLicensesFailure(err));
    }
  }

  function* financeRestoreCentreLicensesFailure() {
    yield put(
      notifyError(yield translate('license_active_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  /**
   * Attempt to add qualification licenses to centre
   */
  function* financeAddCentreQualificationLicensesAttempt({
    centre_id,
    params
  }) {
    try {
      // Send API calls
      const resp = yield call(api.postCentreLicenses, centre_id, params);
      const data = yield checkResponse(resp);
      yield put(Creators.financeAddCentreQualificationLicensesSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.financeAddCentreQualificationLicensesFailure(err));
    }
  }

  function* financeAddCentreQualificationLicensesFailure() {
    yield put(
      notifyError(yield translate('license_active_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* startWatchers() {
    yield takeLatest(
      Types.FINANCE_GET_ALL_CENTRES_ATTEMPT,
      financeGetAllCentresAttempt
    );
    yield takeLatest(
      Types.FINANCE_GET_ALL_CENTRES_FAILURE,
      financeGetAllCentresFailure
    );

    yield takeLatest(
      Types.FINANCE_GET_CENTRE_LICENSES_ATTEMPT,
      financeGetCentreLicensesAttempt
    );
    yield takeLatest(
      Types.FINANCE_GET_CENTRE_LICENSES_FAILURE,
      financeGetCentreLicensesFailure
    );

    yield takeLatest(
      Types.FINANCE_SUSPEND_CENTRE_ATTEMPT,
      financeSuspendCentreAttempt
    );
    yield takeLatest(
      Types.FINANCE_SUSPEND_CENTRE_FAILURE,
      financeSuspendCentreFailure
    );

    yield takeLatest(
      Types.FINANCE_RESTORE_CENTRE_ATTEMPT,
      financeRestoreCentreAttempt
    );
    yield takeLatest(
      Types.FINANCE_RESTORE_CENTRE_FAILURE,
      financeRestoreCentreFailure
    );

    yield takeLatest(
      Types.FINANCE_SUSPEND_CENTRE_LICENSE_ATTEMPT,
      financeSuspendCentreLicenseAttempt
    );
    yield takeLatest(
      Types.FINANCE_SUSPEND_CENTRE_LICENSE_FAILURE,
      financeSuspendCentreLicenseFailure
    );

    yield takeLatest(
      Types.FINANCE_RESTORE_CENTRE_LICENSE_ATTEMPT,
      financeRestoreCentreLicenseAttempt
    );
    yield takeLatest(
      Types.FINANCE_RESTORE_CENTRE_LICENSE_FAILURE,
      financeRestoreCentreLicenseFailure
    );

    yield takeLatest(
      Types.FINANCE_SUSPEND_CENTRE_LICENSES_ATTEMPT,
      financeSuspendCentreLicensesAttempt
    );
    yield takeLatest(
      Types.FINANCE_SUSPEND_CENTRE_LICENSES_FAILURE,
      financeSuspendCentreLicensesFailure
    );

    yield takeLatest(
      Types.FINANCE_RESTORE_CENTRE_LICENSES_ATTEMPT,
      financeRestoreCentreLicensesAttempt
    );
    yield takeLatest(
      Types.FINANCE_RESTORE_CENTRE_LICENSES_FAILURE,
      financeRestoreCentreLicensesFailure
    );

    yield takeLatest(
      Types.FINANCE_ADD_CENTRE_QUALIFICATION_LICENSES_ATTEMPT,
      financeAddCentreQualificationLicensesAttempt
    );
    yield takeLatest(
      Types.FINANCE_ADD_CENTRE_QUALIFICATION_LICENSES_FAILURE,
      financeAddCentreQualificationLicensesFailure
    );
  }

  return {
    startWatchers,
    financeGetAllCentresAttempt,
    financeGetAllCentresFailure,

    financeGetCentreLicensesAttempt,
    financeGetCentreLicensesFailure,

    financeSuspendCentreAttempt,
    financeSuspendCentreFailure,

    financeRestoreCentreAttempt,
    financeRestoreCentreFailure,

    financeSuspendCentreLicenseAttempt,
    financeSuspendCentreLicenseFailure,

    financeRestoreCentreLicenseAttempt,
    financeRestoreCentreLicenseFailure,

    financeSuspendCentreLicensesAttempt,
    financeSuspendCentreLicensesFailure,

    financeRestoreCentreLicensesAttempt,
    financeRestoreCentreLicensesFailure,

    financeAddCentreQualificationLicensesAttempt,
    financeAddCentreQualificationLicensesFailure
  };
};
