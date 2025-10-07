import { takeEvery, put, call, select } from 'redux-saga/effects';
import { routerActions, push } from 'react-router-redux';
import { browserHistory } from 'react-router';
import * as lodash from 'lodash';
import { Roles } from 'app/core/config/constants';
import RealtimeActions from 'app/realtime-services/actions/creator';
import { Types as Type, Creators as Actions } from 'app/user/actions';
import common from 'app/common';
import { translate } from 'app/intl';
import config from 'brand/config';
import { takeLatest } from '../../../../node_modules/redux-saga/effects';

const {
  helpers: { checkResponse, convertToFormData },
  sagaSelectors: { getActiveSector },
  notify: { notifySuccess, notifyError }
} = common.util;

const { CentreLearner, CentreAdmin } = Roles;

export default api => {
  /**
   * Send a create account email to an educator
   * associated with a center number.
   */
  function* sendEducatorEmailAttempt(action) {
    console.log(
      'Attempting to send an verifcation email to the address associated with',
      action.user.centre_number
    );
    const { user } = action;
    const { centre_number } = user;
    try {
      const resp = yield call(api.sendEducatorEmail, { centre_number });
      yield checkResponse(resp);
      yield put(Actions.sendEducatorEmailSuccess(user));
    } catch (err) {
      yield put(Actions.sendEducatorEmailFailure(err));
    }
  }

  /**
   * The sending of the email from the saga above was successful.
   */
  function* sendEducatorEmailSuccess(action) {
    console.log(
      '%cEducator verification email successfully sent. ✅',
      'color: rgb(12, 143, 92);'
    );
    const { user } = action;
    yield put(
      routerActions.replace({
        pathname: '/register/educator/confirmed',
        state: { user }
      })
    );

    yield put(notifySuccess(yield translate('email_sent')));
  }

  /**
   * The sending of educator verification email has been unsuccessful.
   */
  function* sendEducatorEmailFailure(action) {
    console.error(
      'Failed to send a verification email to the Educator.',
      action
    );
    yield put(notifyError(yield translate('email_send_failed')));
  }

  /**
   * Attempt to verfy an Educator email with the given verification code
   */

  /**
   * Attempt to validate the emal
   */
  function* verifyInvitationEmailAttempt({ verification_key, account_type }) {
    try {
      let apiCall = api.verifyCentreMemberEmail; // 'member'

      switch (account_type) {
        case 'centre':
          apiCall = api.verifyEducatorEmail;
          break;
        case 'business':
          apiCall = api.verifyLearnerEmail;
          break;
        case 'admin':
          apiCall = api.verifyAdminEmail;
          break;
        default:
          break;
      }

      const resp = yield call(apiCall, { verification_key });
      const { data } = yield checkResponse(resp);
      // const data = {activation_key: '4n8tybared'}
      // const data = {token: '4n8tybared'}
      if (account_type !== 'learner') {
        yield put(Actions.verifyInvitationEmailSuccess(data));
      }
      const token = lodash.get(data, 'token', '');
      const member = lodash.get(data, 'member');

      if (token && member) {
        api.setAuthToken(token);
        yield put(Actions.setUserToken(token));
        yield put(Actions.getUserByTokenAttempt(token));
        // // yield put(RealtimeActions.initiatePusher({token: token}));
        // yield put(Actions.setUserToken(token));

        // const sector = yield select(getActiveSector);
        // const { sectors, centres, current_qualification } = member;
        // const userRole = lodash.get(centres, ['0', 'roles', '0'], lodash.get(member, ['roles', '0']));

        // if (!member.current_qualification) {
        //   member['current_qualification'] = {}
        // }

        // // Try get permissions/permissions
        // const permissions = yield call(
        //   api.getUserPermissions,
        //   lodash.get(member, 'member_id', '')
        // );
        // yield checkResponse(permissions);

        // member['permissions'] = permissions.data.data;

        // // Assign sector
        // // If all else fails
        // const defaultSector = lodash.get(sectors, ['0', 'sector_id'], '');

        // if (lodash.get(member, 'is_business_member') == 0 || userRole === CentreLearner) {
        //   const activeSector = lodash.find(
        //                             sectors,
        //                             (sector) => sector.sector_id == lodash.get(current_qualification, 'sector_id', lodash.get(sector, 'sector_id', defaultSector)))

        //   yield put(Actions.setActiveSector(activeSector));

        // } else if (!sector || !lodash.find(sectors, (item)=> item.sector_id == sector.sector_id)) {
        //   // If there is no sector, or we can't find the sector ID in the user's
        //   // sectors array...
        //   yield put(Actions.setActiveSector(lodash.head(sectors)));
        // }
        // yield put(Actions.updateOwnProfileSuccess(member));
        browserHistory.replace(`/register/${account_type}/create/profile`);

        // // if (lodash.get(member, 'is_business_member') == 1 || userRole === CentreAdmin) {
        // //   console.log('business-profile')
        // //   browserHistory.replace(`/register/business/create/business-profile`);
        // // } else {
        // //   browserHistory.replace(`/register/${account_type}/create/profile`);
        // // }
      } else {
        browserHistory.replace(`/register/${account_type}/activate`);
      }
    } catch (err) {
      console.log(err);
      yield put(Actions.verifyInvitationEmailFailure(err));
    }
  }
  /**
   * Handle a successful verification
   */
  function* verifyInvitationEmailSuccess(action) {}
  /**
   * Handle verification failure
   */
  function* verifyInvitationEmailFailure(err) {
    yield put(notifyError(yield translate('email_verification_failed')));
  }

  function* verifyLearnerInvitationEmailAttempt({ verification_key }) {
    try {
      const resp = yield call(api.verifyOtherEmail, {
        verification_key
      });
      const { data } = yield checkResponse(resp);
      const token = lodash.get(data, 'token', '');
      if (token) {
        api.setAuthToken(token);
        yield put(Actions.setUserToken(token));
        yield put(Actions.getUserByTokenAttempt(token));
      }
      yield put(Actions.verifyLearnerInvitationEmailSuccess());
    } catch (err) {
      console.log(err);
      yield put(Actions.verifyLearnerInvitationEmailFailure(err));
    }
  }

  function* verifyLearnerInvitationEmailSuccess() {
    browserHistory.push('/dashboard');
  }

  function* verifyTutorInvitationEmailAttempt({ verification_key }) {
    try {
      const resp = yield call(api.verifyCentreMemberEmail, {
        verification_key
      });
      console.log(resp);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Attempt to activate email and password
   */
  function* activationAttempt({ userData, account_type }) {
    try {
      let apiCall = api.activateCentreMember; // 'member'
      switch (account_type) {
        case 'centre':
        case 'business':
          apiCall = api.activateCentre;
          break;
        case 'admin':
          apiCall = api.activateAdmin;
          break;
        default:
          break;
      }
      const resp = yield call(apiCall, convertToFormData(userData));
      const { data } = yield checkResponse(resp);
      // const data = {token: '12345678'};

      const token = lodash.get(data, 'token');
      // const member = lodash.get(data, 'member');
      // const centre = lodash.get(data, 'centre');

      if (!token) {
        throw new Error('No token provided by server');
      }

      api.setAuthToken(token);
      yield put(Actions.setUserToken(token));
      yield put(Actions.activationSuccess(data));
      yield put(Actions.getUserByTokenAttempt(token));

      // // yield put(RealtimeActions.initiatePusher({token: token}));
      // if (member) {
      //   const sector = yield select(getActiveSector);
      //   const { sectors, centres, current_qualification } = member;
      //   const userRole = lodash.get(centres, ['0', 'roles', '0'], lodash.get(member, ['roles', '0']));

      //   if (!member.current_qualification) {
      //     member['current_qualification'] = {}
      //   }

      //   // Try get permissions/permissions
      //   const permissions = yield call(
      //     api.getUserPermissions,
      //     lodash.get(member, 'member_id', '')
      //   );
      //   yield checkResponse(permissions);

      //   member['permissions'] = permissions.data.data;

      //   // Assign sector

      //   // If all else fails
      //   const defaultSector = lodash.get(sectors, ['0', 'sector_id'], '');

      //   if (userRole === CentreLearner) {
      //     const activeSector = lodash.find(
      //                                 sectors,
      //                                 (sector) => sector.sector_id == lodash.get(current_qualification, 'sector_id', lodash.get(sector, 'sector_id', defaultSector)))

      //     yield put(Actions.setActiveSector(activeSector));
      //   } else if (!sector || !lodash.find(sectors, (item)=> item.sector_id == sector.sector_id)) {
      //     // If there is no sector, or we can't find the sector ID in the user's
      //     // sectors array...
      //     yield put(Actions.setActiveSector(lodash.head(sectors)));
      //   }

      //   yield put(Actions.updateOwnProfileSuccess(member));
      if (config.registrationFlow === '2') {
        browserHistory.replace('/user/settings');
      } else if (['centre', 'business'].indexOf(account_type) >= 0) {
        browserHistory.replace(`/register/business/create/business-profile`);
      } else {
        browserHistory.replace(`/register/${account_type}/create/profile`);
      }
      // }
    } catch (err) {
      yield put(Actions.activationFailure(err));
    }
  }
  /**
   * Handle a successful activation
   */
  function* activationSuccess(action) {}
  /**
   * Handle activation failure
   */
  function* activationFailure() {
    yield put(notifyError(yield translate('registration_failed')));
  }

  function* verifyEducatorEmailAttempt(action) {
    const { verification_key } = action;
    try {
      const resp = yield call(api.verifyEducatorEmail, { verification_key });
      const {
        data: { activation_key }
      } = yield checkResponse(resp);
      yield put(Actions.verifyEducatorEmailSuccess(activation_key));
    } catch (err) {
      yield put(Actions.verifyEducatorEmailFailure(err));
    }
  }

  /**
   * Successfully verified Educator email.
   */
  function* verifyEducatorEmailSuccess() {
    yield put(
      notifySuccess(yield translate('email_verification_sucess'), {
        canDimiss: true,
        duration: 1000
      })
    );
    console.log(
      '%cEducator email successfully verified. ✅',
      'color: rgb(12, 143, 92);'
    );
  }

  /**
   * Failed to verify Educator email.
   */

  function* verifyEducatorEmailFailure() {
    yield put(notifyError(yield translate('email_verification_failed')));
  }

  /**
   * Attempt to register an Educator
   */
  function* registerEducatorAttempt(action) {
    const payload = action.userData;
    try {
      const resp = yield call(api.registerEducator, payload);
      const { data } = yield checkResponse(resp);
      yield put(Actions.registerEducatorSuccess(data));
    } catch (err) {
      yield put(Actions.registerEducatorFailure(err));
    }
  }

  /**
   * Handle a successful Educator registration
   */
  function* registerEducatorSuccess() {
    console.log(
      '%cEducator successfully registered. ✅',
      'color: rgb(12, 143, 92);'
    );
    // let {registerData, user} = action;
    // if (!registerData || !registerData.token) {
    //   throw new Error('No token provided by server');
    // }
    // yield put(Actions.loginSuccess({token: registerData.token}));
  }

  /**
   * Handle an unsuccessful Educator registration
   */
  function* registerEducatorFailure() {
    yield put(notifyError(yield translate('registration_failed')));
  }

  /**
   * Attempt to verfy an Centre member email with the given verification code
   */
  function* verifyCentreMemberEmailAttempt(action) {
    console.log(
      'Attemptying to verify the educator email for the verification code: ',
      action.verification_key
    );
    const { verification_key } = action;
    try {
      const resp = yield call(api.verifyCentreMemberEmail, {
        verification_key
      });
      const {
        data: { activation_key }
      } = yield checkResponse(resp);
      yield put(Actions.verifyCentreMemberEmailSuccess(activation_key));
    } catch (err) {
      yield put(Actions.verifyCentreMemberEmailFailure(err));
    }
  }

  /**
   * Successfully verified Centre member email.
   */
  function* verifyCentreMemberEmailSuccess() {
    console.log(
      '%cEducator email successfully verified. ✅',
      'color: rgb(12, 143, 92);'
    );
  }

  /**
   * Failed to verify Centre member email.
   */
  function* verifyCentreMemberEmailFailure() {
    yield put(
      notifyError(yield translate('center_member_verification_failed'))
    );
  }

  /**
   * Attempt to register an Centre member
   */
  function* registerCentreMemberAttempt(action) {
    console.log(
      'Attemptying to verify the educator email for the verification code: ',
      action.verification_key
    );
    const payload = action.userData;
    try {
      const resp = yield call(api.registerCentreMember, payload);
      const { data } = yield checkResponse(resp);
      yield put(Actions.registerCentreMemberSuccess(data));
    } catch (err) {
      yield put(Actions.registerCentreMemberFailure(err));
    }
  }

  /**
   * Handle a successful Centre member registration
   */
  function* registerCentreMemberSuccess() {
    console.log(
      '%cEducator email successfully verified. ✅',
      'color: rgb(12, 143, 92);'
    );
  }

  /**
   * Handle an unsuccessful Centre member registration
   */
  function* registerCentreMemberFailure() {
    yield put(notifyError(yield translate('center_member_activation_failed')));
  }

  /**
   * Attempt to verfy an Admin  email with the given verification code
   */
  function* verifyAdminEmailAttempt(action) {
    console.log(
      'Attemptying to verify the admin email for the verification code: ',
      action.verification_key
    );
    const { verification_key } = action;
    try {
      const resp = yield call(api.verifyAdminEmail, {
        verification_key
      });
      const {
        data: { activation_key }
      } = yield checkResponse(resp);
      yield put(Actions.verifyAdminEmailSuccess(activation_key));
    } catch (err) {
      yield put(Actions.verifyAdminEmailFailure(err));
    }
  }

  /**
   * Successfully verified Centre member email.
   */
  function* verifyAdminEmailSuccess() {
    yield put(
      notifySuccess(yield translate('email_verification_sucess'), {
        canDimiss: true,
        duration: 1000
      })
    );
    console.log(
      '%Admin email successfully verified. ✅',
      'color: rgb(12, 143, 92);'
    );
  }

  /**
   * Failed to verify Centre member email.
   */
  function* verifyAdminEmailFailure() {
    yield put(notifyError(yield translate('admin_verification_failed')));
  }

  /**
   * Attempt to register an Centre member
   */
  function* registerAdminAttempt(action) {
    console.log(
      'Attemptying to verify the admin email for the verification code: ',
      action.verification_key
    );
    const payload = action.userData;
    try {
      const resp = yield call(api.registerAdmin, payload);
      const { data } = yield checkResponse(resp);
      yield put(Actions.registerAdminSuccess(data));
    } catch (err) {
      yield put(Actions.registerAdminFailure(err));
    }
  }

  /**
   * Handle a successful Centre member registration
   */
  function* registerAdminSuccess() {
    console.log(
      '%Admin email successfully verified. ✅',
      'color: rgb(12, 143, 92);'
    );
  }

  /**
   * Handle an unsuccessful Centre member registration
   */
  function* registerAdminFailure() {
    yield put(notifyError(yield translate('admin_activation_failed')));
  }

  function* createBusinessProfileAttempt(action) {
    try {
      // const {
      //   profile: { user }
      // } = yield select();
      const user = lodash.get(action, 'user');
      const registerData = lodash.get(action, 'data');

      if (user.centres && user.centres[0]) {
        const resp = yield call(
          api.updateCentre,
          registerData,
          user.centres[0].centre_id
        );
        const { data } = yield checkResponse(resp);
        yield put(Actions.updateCentreSuccess(data));
        yield put(
          Actions.updateOwnProfileSuccess({
            ...user,
            centres: [data]
          })
        );
        yield put(Actions.changeLoadingStatus(false));
        browserHistory.replace(`/dashboard`);
      } else {
        yield put(notifyError(yield translate('no_centre_exist')));
        yield put(Actions.sendRegisterRequestFailure('No centres exist'));
      }
    } catch (err) {
      console.log(err);
      yield put(Actions.sendRegisterRequestFailure(err));
    }
  }

  function* startWatchers() {
    yield takeEvery(Type.SEND_EDUCATOR_EMAIL_ATTEMPT, sendEducatorEmailAttempt);
    yield takeEvery(Type.SEND_EDUCATOR_EMAIL_SUCCESS, sendEducatorEmailSuccess);
    yield takeEvery(Type.SEND_EDUCATOR_EMAIL_FAILURE, sendEducatorEmailFailure);
    yield takeEvery(
      Type.VERIFY_EDUCATOR_EMAIL_ATTEMPT,
      verifyEducatorEmailAttempt
    );
    yield takeEvery(
      Type.VERIFY_EDUCATOR_EMAIL_SUCCESS,
      verifyEducatorEmailSuccess
    );
    yield takeEvery(
      Type.VERIFY_EDUCATOR_EMAIL_FAILURE,
      verifyEducatorEmailFailure
    );
    yield takeEvery(Type.REGISTER_EDUCATOR_ATTEMPT, registerEducatorAttempt);
    yield takeEvery(Type.REGISTER_EDUCATOR_SUCCESS, registerEducatorSuccess);
    yield takeEvery(Type.REGISTER_EDUCATOR_FAILURE, registerEducatorFailure);
    yield takeEvery(
      Type.VERIFY_CENTRE_MEMBER_EMAIL_ATTEMPT,
      verifyCentreMemberEmailAttempt
    );
    yield takeEvery(
      Type.VERIFY_CENTRE_MEMBER_EMAIL_SUCCESS,
      verifyCentreMemberEmailSuccess
    );
    yield takeEvery(
      Type.VERIFY_CENTRE_MEMBER_EMAIL_FAILURE,
      verifyCentreMemberEmailFailure
    );
    yield takeEvery(
      Type.REGISTER_CENTRE_MEMBER_ATTEMPT,
      registerCentreMemberAttempt
    );
    yield takeEvery(
      Type.REGISTER_CENTRE_MEMBER_SUCCESS,
      registerCentreMemberSuccess
    );
    yield takeEvery(
      Type.REGISTER_CENTRE_MEMBER_FAILURE,
      registerCentreMemberFailure
    );

    yield takeEvery(Type.VERIFY_ADMIN_EMAIL_ATTEMPT, verifyAdminEmailAttempt);
    yield takeEvery(Type.VERIFY_ADMIN_EMAIL_SUCCESS, verifyAdminEmailSuccess);
    yield takeEvery(Type.VERIFY_ADMIN_EMAIL_FAILURE, verifyAdminEmailFailure);
    yield takeEvery(Type.REGISTER_ADMIN_ATTEMPT, registerAdminAttempt);
    yield takeEvery(Type.REGISTER_ADMIN_SUCCESS, registerAdminSuccess);
    yield takeEvery(Type.REGISTER_ADMIN_FAILURE, registerAdminFailure);
    yield takeEvery(
      Type.CREATE_BUSINESS_PROFILE_ATTEMPT,
      createBusinessProfileAttempt
    );

    yield takeEvery(
      Type.VERIFY_INVITATION_EMAIL_ATTEMPT,
      verifyInvitationEmailAttempt
    );
    yield takeEvery(
      Type.VERIFY_INVITATION_EMAIL_SUCCESS,
      verifyInvitationEmailSuccess
    );
    yield takeEvery(
      Type.VERIFY_INVITATION_EMAIL_FAILURE,
      verifyInvitationEmailFailure
    );

    yield takeEvery(Type.ACTIVATION_ATTEMPT, activationAttempt);
    yield takeEvery(Type.ACTIVATION_SUCCESS, activationSuccess);
    yield takeEvery(Type.ACTIVATION_FAILURE, activationFailure);

    yield takeLatest(
      Type.VERIFY_TUTOR_INVITATION_EMAIL_ATTEMPT,
      verifyTutorInvitationEmailAttempt
    );
    yield takeLatest(
      Type.VERIFY_LEARNER_INVITATION_EMAIL_ATTEMPT,
      verifyLearnerInvitationEmailAttempt
    );
    yield takeLatest(
      Type.VERIFY_LEARNER_INVITATION_EMAIL_SUCCESS,
      verifyLearnerInvitationEmailSuccess
    );
  }

  return {
    startWatchers,
    registerEducatorAttempt,
    registerEducatorSuccess,
    registerEducatorFailure,
    verifyEducatorEmailAttempt,
    verifyEducatorEmailSuccess,
    verifyEducatorEmailFailure,
    sendEducatorEmailAttempt,
    sendEducatorEmailSuccess,
    sendEducatorEmailFailure,
    verifyCentreMemberEmailAttempt,
    verifyCentreMemberEmailSuccess,
    verifyCentreMemberEmailFailure,
    registerCentreMemberAttempt,
    registerCentreMemberSuccess,
    registerCentreMemberFailure,

    verifyInvitationEmailAttempt,
    verifyInvitationEmailSuccess,
    verifyInvitationEmailFailure,

    activationAttempt,
    activationSuccess,
    activationFailure
  };
};
