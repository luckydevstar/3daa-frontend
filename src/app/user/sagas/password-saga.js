import { takeEvery, put, call } from 'redux-saga/effects';
import { Types as Type, Creators as Actions } from 'app/user/actions';
import { checkResponse } from 'app/common/util/helpers';

export default api => {
  function* passwordResetAttempt(action) {
    try {
      const resp = yield call(api.passwordReset, action.email);
      yield checkResponse(resp);
      yield put(Actions.passwordResetSuccess());
    } catch (err) {
      yield put(Actions.passwordResetFailure());
    }
  }

  function* updateResetPasswordAttempt(action) {
    try {
      const resp = yield call(api.updateResetPassword, action.values);
      yield checkResponse(resp);
      yield put(Actions.updateResetPasswordSuccess());
    } catch (err) {
      yield put(Actions.updateResetPasswordFailure());
    }
  }

  function* startWatchers() {
    yield takeEvery(Type.PASSWORD_RESET_ATTEMPT, passwordResetAttempt);
    yield takeEvery(
      Type.UPDATE_RESET_PASSWORD_ATTEMPT,
      updateResetPasswordAttempt
    );
  }

  return {
    startWatchers,
    passwordResetAttempt,
    updateResetPasswordAttempt
  };
};
