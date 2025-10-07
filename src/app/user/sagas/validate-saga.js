import { takeEvery, put, call } from 'redux-saga/effects';
import React from 'react';
import { Types as Type } from 'app/user/actions';
import common from 'app/common';
import { translate } from 'app/intl';

const { helpers: { checkResponse }, notify: { notifyError } } = common.util;

export default api => {
  /**
   * Attempts validation of registration email address
   */
  function* validateEmailAttempt(action) {
    const { payload, formPromise } = action;
    const { resolve, reject } = formPromise;

    try {
      const resp = yield call(api.validateEmail, payload);
      yield checkResponse(resp);
      yield call(resolve);
    } catch (err) {
      const error = {
        email: err || (yield translate('incorrect_field_value'))
      };
      yield call(reject, error);
    }
  }

  /**
   * Attempts validation of a learner registration number
   */
  function* validateRegNumberAttempt(action) {
    const { payload, formPromise } = action;
    const { resolve, reject } = formPromise;
    try {
      const resp = yield call(api.validateRegNumber, payload);
      yield checkResponse(resp);
      yield call(resolve);
    } catch (err) {
      yield put(
        notifyError(yield translate(err || 'validate_number_failed'), {
          icon: <i className="fa fa-times" />
        })
      );
      yield call(reject);
    }
  }

  /**
   * Attempts the validation of a center number
   */
  function* validateCenterAttempt(action) {
    const { payload, formPromise } = action;
    const { resolve, reject } = formPromise;
    try {
      const resp = yield call(api.validateCenter, payload);
      yield checkResponse(resp);
      yield call(resolve);
    } catch (err) {
      yield put(
        notifyError(yield translate(err || 'unable_to_validate'), {
          icon: <i className="fa fa-times" />
        })
      );
      yield call(reject);
    }
  }

  function* startWatchers() {
    yield takeEvery(Type.VALIDATE_EMAIL_ATTEMPT, validateEmailAttempt);
    yield takeEvery(Type.VALIDATE_REG_NUMBER_ATTEMPT, validateRegNumberAttempt);
    yield takeEvery(Type.VALIDATE_CENTER_ATTEMPT, validateCenterAttempt);
  }

  return {
    startWatchers,
    validateEmailAttempt,
    validateRegNumberAttempt
  };
};
