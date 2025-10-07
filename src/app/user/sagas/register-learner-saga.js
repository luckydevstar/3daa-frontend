import { takeEvery, put, call, select } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';
import { dissoc } from 'ramda';
import * as lodash from 'lodash';
import { Types as Type, Creators as Actions } from 'app/user/actions';
import common from 'app/common';
import { translate } from 'app/intl';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifySuccess, notifyError }
} = common.util;

export default api => {
  /**
   * Attempt to register a Learner
   */
  function* registerAttempt(action) {
    const { user } = action;
    try {
      const resp = yield call(api.sendLearnerEmail, user);
      yield checkResponse(resp);
      yield put(Actions.registerSuccess(user));
    } catch (err) {
      yield put(Actions.registerFailure(err));
    }
  }

  /**
   * Handle a successful Learner registration
   */
  function* registerSuccess({ user }) {
    if (user.is_business) {
      browserHistory.push('/register/business/resend');
    } else {
      browserHistory.push('/register/personal/resend');
    }
  }

  /**
   * Handle an unsuccessful Learner registration
   */
  function* registerFailure() {
    yield put(notifyError(yield translate('user_register_failed')));
  }

  /**
   * Attempt to activate a registered Learner
   */
  function* verifyEmailAttempt({ verification_key, acc_type }) {
    try {
      const resp = yield call(api.verifyLearnerEmail, { verification_key });
      const { data } = yield checkResponse(resp);
      yield put(Actions.verifyEmailSuccess(data));
      yield put(Actions.setUserToken(data.token));
      yield put(Actions.getUserByTokenAttempt(data.token));
      browserHistory.replace(`/register/${acc_type}/create/profile`);
    } catch (err) {
      yield put(Actions.verifyEmailFailure(err));
    }
  }

  /**
   * Handle a successful Learner activation
   */
  function* verifyEmailSuccess(action) {
    const { activationData } = action;

    if (!activationData || !activationData.token) {
      throw new Error('No token provided by server');
    }

    api.setAuthToken(activationData.token);
  }
  /**
   * Handle Learner activation failure
   */
  function* verifyEmailFailure() {
    yield put(notifyError(yield translate('email_verification_failed')));
  }

  /**
   * Resend email
   */
  function* sendLearnerEmailAttempt(action) {
    const { email } = action;
    const {
      registration: {
        registerData: { email: old_email }
      }
    } = yield select();
    try {
      const resp = yield call(api.sendLearnerEmail, { email, old_email });
      const { message, data } = yield checkResponse(resp);
      yield put(notifySuccess(message));
      yield put(Actions.sendLearnerEmailSuccess(data));
    } catch (err) {
      yield put(
        Actions.sendLearnerEmailFailure(
          err || (yield translate('email_resend_failed'))
        )
      );
    }
  }

  /*
   * Create profile
   */
  function* createPersonalProfileAttempt(action) {
    try {
      const resp = yield call(api.createPersonalProfile, action.data);
      const { data } = yield checkResponse(resp);
      yield put(Actions.updateLocalUser(data));
      yield put(Actions.changeLoadingStatus(false));
    } catch (err) {
      yield put(Actions.sendRegisterRequestFailure(err));
    }
  }

  function* payMembershipAttempt({ payload, token }) {
    try {
      const resp = yield call(api.payMembership, payload);
      console.log(resp);
      const { data } = yield checkResponse(resp);
      if (token) {
        yield put(Actions.getUserByTokenAttempt(token));
      }
      // const member = lodash.get(data, 'member');
      // const centre = lodash.get(member, ['centres', '0']);

      // if (centre) {
      //   yield put(Actions.updateCentreSuccess(centre));
      // }

      // yield put(
      //   Actions.updateLocalUser({
      //     ...member,
      //     showPaymentConfirmed: true
      //   })
      // );

      yield put(
        Actions.updateLocalUser({
          showPaymentConfirmed: true
        })
      );

      yield put(Actions.changeLoadingStatus(false));
      browserHistory.replace(`/dashboard`);
    } catch (err) {
      yield put(Actions.sendRegisterRequestFailure(err));
    }
  }

  function* getAvailableMembershipsAttempt() {
    try {
      const resp = yield call(api.getAvailableMemberships);
      const { data } = yield checkResponse(resp);
      yield put(Actions.getAvailableMembershipsSuccess(data));
    } catch (err) {
      yield put(Actions.getAvailableMembershipsFailure(err));
    }
  }

  function* getAvailableMembershipsFailure(err) {
    yield put(notifyError(yield translate(err)));
    // yield put(notifyError(yield translate('email_verification_failed')));
  }

  function* membershipVoucherCheckAttempt({ payload }) {
    try {
      const resp = yield call(
        api.membershipVoucherCheck,
        convertToFormData(payload)
      );
      const { data } = yield checkResponse(resp);
      yield put(Actions.updateOwnProfileSuccess({ canMoveToPayment: true }));
      yield put(Actions.membershipVoucherCheckSuccess(data));
    } catch (err) {
      yield put(Actions.membershipVoucherCheckFailure(err));
    }
  }

  function* membershipVoucherCheckFailure(err) {
    // yield put(notifyError(yield translate(err)));
    yield put(notifyError(yield translate('voucher_code_failed')));
  }

  function* startWatchers() {
    yield takeEvery(Type.REGISTER_ATTEMPT, registerAttempt);
    yield takeEvery(Type.REGISTER_SUCCESS, registerSuccess);
    yield takeEvery(Type.REGISTER_FAILURE, registerFailure);
    yield takeEvery(Type.VERIFY_EMAIL_ATTEMPT, verifyEmailAttempt);
    yield takeEvery(Type.VERIFY_EMAIL_SUCCESS, verifyEmailSuccess);
    yield takeEvery(Type.VERIFY_EMAIL_FAILURE, verifyEmailFailure);
    yield takeEvery(Type.SEND_LEARNER_EMAIL_ATTEMPT, sendLearnerEmailAttempt);
    yield takeEvery(
      Type.CREATE_PERSONAL_PROFILE_ATTEMPT,
      createPersonalProfileAttempt
    );
    yield takeEvery(Type.PAY_MEMBERSHIP_ATTEMPT, payMembershipAttempt);

    yield takeEvery(
      Type.GET_AVAILABLE_MEMBERSHIPS_ATTEMPT,
      getAvailableMembershipsAttempt
    );
    yield takeEvery(
      Type.GET_AVAILABLE_MEMBERSHIPS_FAILURE,
      getAvailableMembershipsFailure
    );

    yield takeEvery(
      Type.MEMBERSHIP_VOUCHER_CHECK_ATTEMPT,
      membershipVoucherCheckAttempt
    );
    yield takeEvery(
      Type.MEMBERSHIP_VOUCHER_CHECK_FAILURE,
      membershipVoucherCheckFailure
    );
  }

  return {
    startWatchers,
    registerAttempt,
    registerSuccess,
    registerFailure,
    verifyEmailAttempt,
    verifyEmailSuccess,
    verifyEmailFailure,
    getAvailableMembershipsAttempt,
    getAvailableMembershipsFailure,
    membershipVoucherCheckAttempt,
    membershipVoucherCheckFailure
  };
};
