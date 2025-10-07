import { takeEvery, put, call } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { Types as Type, Creators as Actions } from 'app/user/actions';
import common from 'app/common';
import { translate } from 'app/intl';
import { has } from 'lodash';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifySuccess, notifyError }
} = common.util;

export default api => {
  function* registerOtherAttempt({ user }) {
    try {
      const resp = yield call(api.reigsterOther, user);
      const { data } = yield checkResponse(resp);
      const { token } = data;
      yield put(Actions.registerOtherSuccess(user));
      if (token) {
        api.setAuthToken(token);
        yield put(Actions.setUserToken(token));
        yield put(Actions.getUserByTokenAttempt(token));
      }
    } catch (err) {
      console.log(err);
      yield put(Actions.registerOtherFailure(err));
    }
  }

  function* registerOtherSuccess() {
    browserHistory.push('/regiser/profile/uln');
    yield put(notifySuccess('Success.'));
  }

  function* registerOtherFailure() {
    yield put(
      notifyError(
        yield translate(
          'This email is already exist. Please try another email or contact admin'
        )
      )
    );
  }

  function* validateUlnAttempt({ params }) {
    try {
      const resp = yield call(api.validateUln, params);
      console.log(resp);
      yield checkResponse(resp);
      yield put(Actions.validateUlnSuccess(params.uln, params.lastname));
    } catch (err) {
      yield put(Actions.validateUlnFailure(err));
    }
  }

  function* validateUlnSuccess({ uln, lastname }) {
    browserHistory.push(
      `/register/learner/create/profile?uln=${uln}&lastname=${lastname}`
    );
  }

  function* validateUlnFailure({ err }) {
    yield put(notifyError(err));
  }

  function* setProfileWithUlnAttempt({ user }) {
    try {
      const resp = yield call(api.setProfileWithUln, user);
      const { data } = yield checkResponse(resp);
      yield put(Actions.setProfileWithUlnSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Actions.setProfileWithUlnFailure());
    }
  }

  function* setProfileWithUlnSuccess({ user }) {
    if (!user.unverified_email) {
      browserHistory.push('/dashboard');
    } else if (has(user, ['verification_email_key'])) {
      browserHistory.push(
        `/register/learner/verify/${user.verification_email_key}?clearSession=true`
      );
    } else {
      browserHistory.push('/register/learner/verify/key?clearSession=true');
    }
  }

  function* resendVerificationEmailAttempt({ email }) {
    try {
      const resp = yield call(api.sendVerificationEmail, { email });
      yield checkResponse(resp);
      yield put(Actions.resendVerificationEmailSuccess());
    } catch (err) {
      console.log(err);
      yield put(Actions.resendVerificationEmailFailure(err));
    }
  }

  function* resendVerificationEmailSuccess() {
    yield put(notifySuccess('Email sent.'));
  }

  function* resendVerificationEmailFailure({ err }) {
    yield put(notifyError(err));
    yield put(Actions.verifyLearnerInvitationEmailFailure(err));
  }

  function* verifyOtherEmailAttempt({ params }) {
    try {
      const resp = yield call(api.verifyLearnerEmail, params);
      yield checkResponse(resp);
      yield put(Actions.verifyOtherEmailSuccess());
    } catch (err) {
      yield put(Actions.verifyOtherEmailFailure(err));
    }
  }

  function* startWatchers() {
    yield takeEvery(Type.REGISTER_OTHER_ATTEMPT, registerOtherAttempt);
    yield takeEvery(Type.REGISTER_OTHER_SUCCESS, registerOtherSuccess);
    yield takeEvery(Type.REGISTER_OTHER_FAILURE, registerOtherFailure);

    yield takeEvery(Type.VALIDATE_ULN_ATTEMPT, validateUlnAttempt);
    yield takeEvery(Type.VALIDATE_ULN_SUCCESS, validateUlnSuccess);
    yield takeEvery(Type.VALIDATE_ULN_FAILURE, validateUlnFailure);

    yield takeEvery(
      Type.SET_PROFILE_WITH_ULN_ATTEMPT,
      setProfileWithUlnAttempt
    );
    yield takeEvery(
      Type.SET_PROFILE_WITH_ULN_SUCCESS,
      setProfileWithUlnSuccess
    );

    yield takeEvery(
      Type.RESEND_VERIFICATION_EMAIL_ATTEMPT,
      resendVerificationEmailAttempt
    );
    yield takeEvery(
      Type.RESEND_VERIFICATION_EMAIL_SUCCESS,
      resendVerificationEmailSuccess
    );
    yield takeEvery(
      Type.RESEND_VERIFICATION_EMAIL_FAILURE,
      resendVerificationEmailFailure
    );

    yield takeEvery(Type.VERIFY_OTHER_EMAIL_ATTEMPT, verifyOtherEmailAttempt);
  }

  return {
    startWatchers
  };
};
