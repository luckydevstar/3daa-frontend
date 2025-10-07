/* eslint-disable no-restricted-syntax, no-prototype-builtins */
import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'app/notifications/actions';
import { checkResponse } from 'app/common/util/helpers';

export default api => {
  function* getMemberNotificationsAttempt() {
    try {
      const response = yield call(api.getMemberNotifications);
      if (checkResponse(response)) {
        const { data: { data: { notifications } } } = response;
        yield put(Creators.getMemberNotificationsSuccess(notifications));
      }
    } catch (e) {
      yield call(Creators.getMemberNotificationsFailure(e));
    }
  }

  function* getMemberNotificationsSuccess() {}

  function* getMemberNotificationsFailure() {}

  function* startWatchers() {
    yield takeLatest(
      Types.GET_MEMBER_NOTIFICATIONS_ATTEMPT,
      getMemberNotificationsAttempt
    );
    yield takeLatest(
      Types.GET_MEMBER_NOTIFICATIONS_SUCCESS,
      getMemberNotificationsSuccess
    );
    yield takeLatest(
      Types.GET_MEMBER_NOTIFICATIONS_FAILURE,
      getMemberNotificationsFailure
    );
  }

  return {
    getMemberNotificationsAttempt,
    getMemberNotificationsSuccess,
    getMemberNotificationsFailure,
    startWatchers
  };
};
