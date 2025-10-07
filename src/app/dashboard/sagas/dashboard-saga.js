import { takeEvery, put, call, select } from 'redux-saga/effects';
import common from 'app/common';
import { translate, translatef } from 'app/intl';
import { Types, Creators } from '../actions';

const {
  helpers: { checkResponse },
  notify: { notifyError, notifySuccess }
} = common.util;

export default api => {
  function* getUserSummaryAttempt() {
    try {
      const response = yield call(api.getUserSummary);
      const { data } = yield checkResponse(response);

      yield put(Creators.getUserSummarySuccess(data));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getUserSummaryFailure(err));
    }
  }

  function* getReportingTopCentresAttempt() {
    try {
      const response = yield call(api.getReportingTopCentres);
      const { data } = yield checkResponse(response);

      yield put(Creators.getReportingTopCentresSuccess(data));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getReportingTopCentresFailure(err));
    }
  }

  function* getReportingMonthlyLearningHoursAttempt() {
    try {
      const response = yield call(api.getReportingMonthlyLearningHours);
      const { data } = yield checkResponse(response);

      yield put(Creators.getReportingMonthlyLearningHoursSuccess(data));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getReportingMonthlyLearningHoursFailure(err));
    }
  }

  function* getReportingDailyLoginsAttempt() {
    try {
      const response = yield call(api.getReportingDailyLogins);
      const { data } = yield checkResponse(response);

      yield put(Creators.getReportingDailyLoginsSuccess(data));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getReportingDailyLoginsFailure(err));
    }
  }

  function* getReportingTopQualificationsAttempt() {
    try {
      const response = yield call(api.getReportingTopQualifications);
      const { data } = yield checkResponse(response);

      yield put(Creators.getReportingTopQualificationsSuccess(data));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getReportingTopQualificationsFailure(err));
    }
  }

  function* getReportingMonthlyTopQualificationsAttempt() {
    try {
      const response = yield call(api.getReportingMonthlyTopQualifications);
      const { data } = yield checkResponse(response);

      yield put(Creators.getReportingMonthlyTopQualificationsSuccess(data));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getReportingMonthlyTopQualificationsFailure(err));
    }
  }

  function* getReportingOrdersAttempt() {
    try {
      const response = yield call(api.getReportingOrders, {
        limit: 5,
        offset: 0
      });
      const { data } = yield checkResponse(response);

      yield put(Creators.getReportingOrdersSuccess(data));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getReportingOrdersFailure(err));
    }
  }

  function* getReportingOrdersAttempt() {
    try {
      const response = yield call(api.getReportingOrders, {
        limit: 5,
        offset: 0
      });
      const { data } = yield checkResponse(response);

      yield put(Creators.getReportingOrdersSuccess(data));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getReportingOrdersFailure(err));
    }
  }

  function* getReportingOrdersMonthlyAttempt() {
    try {
      const response = yield call(api.getReportingOrdersMonthly);
      const { data } = yield checkResponse(response);

      yield put(Creators.getReportingOrdersMonthlySuccess(data));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getReportingOrdersMonthlyFailure(err));
    }
  }

  function* startWatchers() {
    yield takeEvery(Types.GET_USER_SUMMARY_ATTEMPT, getUserSummaryAttempt);
    yield takeEvery(
      Types.GET_REPORTING_TOP_CENTRES_ATTEMPT,
      getReportingTopCentresAttempt
    );
    yield takeEvery(
      Types.GET_REPORTING_MONTHLY_LEARNING_HOURS_ATTEMPT,
      getReportingMonthlyLearningHoursAttempt
    );
    yield takeEvery(
      Types.GET_REPORTING_DAILY_LOGINS_ATTEMPT,
      getReportingDailyLoginsAttempt
    );
    yield takeEvery(
      Types.GET_REPORTING_TOP_QUALIFICATIONS_ATTEMPT,
      getReportingTopQualificationsAttempt
    );
    yield takeEvery(
      Types.GET_REPORTING_MONTHLY_TOP_QUALIFICATIONS_ATTEMPT,
      getReportingMonthlyTopQualificationsAttempt
    );
    yield takeEvery(
      Types.GET_REPORTING_ORDERS_ATTEMPT,
      getReportingOrdersAttempt
    );
    yield takeEvery(
      Types.GET_REPORTING_ORDERS_MONTHLY_ATTEMPT,
      getReportingOrdersMonthlyAttempt
    );
  }

  return {
    startWatchers
  };
};
