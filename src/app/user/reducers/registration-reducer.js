import { Types as Type } from 'app/user/actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import * as lodash from 'lodash';

export const INITIAL_STATE = Immutable({
  sendingEmail: false,
  verifyingEmail: false,
  startingRegistration: false,
  activating: false,
  gettingMemberships: false,
  checkingVoucher: false,
  sendingRequest: false,
  validatingUln: false,
  emailResendAttempt: false,

  errorCode: null,
  activationKey: 'ztvcgvwids',
  activated: false,
  activationData: null,
  registerData: null,
  voucherCode: null,
  availableMemberships: []
});

/**
 * Educator registration reducers
 */
const registerEducatorAttempt = state =>
  state.merge({ startingRegistration: true, registerData: null });

const registerEducatorSuccess = (state, action) =>
  state.merge({
    startingRegistration: false,
    registerData: action.registerData
  });

const registerEducatorFailure = state =>
  state.merge({ startingRegistration: false, registerData: null });

/**
 * Educator sending email reducers
 */
const sendEducatorEmailAttempt = state =>
  state.merge({
    startingRegistration: true,
    sendingEmail: true,
    errorCode: null
  });

const sendEducatorEmailSuccess = state =>
  state.merge({
    startingRegistration: false,
    sendingEmail: false,
    errorCode: null
  });

const sendEducatorEmailFailure = (state, action) =>
  state.merge({
    startingRegistration: false,
    sendingEmail: false,
    errorCode: action.errorCode
  });

/**
 * Educator verification reducers
 */
const verifyInvitationEmailAttempt = state =>
  state.merge({ activationKey: null, verifyingEmail: true, errorCode: null });
const verifyInvitationEmailSuccess = (state, action) => {
  return state.merge({
    activationKey: lodash.get(action, 'data.activation_key', ''),
    activated: lodash.get(action, 'data.member.activated') ? true : false,
    verifyingEmail: false,
    errorCode: null
  });
};

const verifyInvitationEmailFailure = (state, action) =>
  state.merge({
    activationKey: null,
    verifyingEmail: false,
    errorCode: action.errorCode
  });

const setActivationData = (state, action) =>
  state.merge({
    activationData: lodash.get(action, 'activationData')
  });

const activationAttempt = state =>
  state.merge({
    activating: true,
    activated: false,
    errorCode: null
  });
const activationSuccess = (state, action) => {
  return state.merge({
    activating: false,
    activated: true,
    errorCode: null,
    registerData: lodash.get(action, 'registerData')
  });
};
const activationFailure = (state, action) => {
  return state.merge({
    activating: false,
    activated: false,
    errorCode: lodash.get(action, 'errorCode')
  });
};

const verifyEducatorEmailAttempt = state =>
  state.merge({ activationKey: null, verifyingEmail: true, errorCode: null });

const verifyEducatorEmailSuccess = (state, action) =>
  state.merge({
    activationKey: action.activationKey,
    verifyingEmail: false,
    errorCode: null
  });

const verifyEducatorEmailFailure = (state, action) =>
  state.merge({
    activationKey: null,
    verifyingEmail: false,
    errorCode: action.errorCode
  });

/**
 * Learner registration reducers
 */
const registerAttempt = state =>
  state.merge({
    startingRegistration: true,
    registerData: null,
    errorCode: null
  });

const registerSuccess = (state, action) =>
  state.merge({
    startingRegistration: false,
    errorCode: null,
    registerData: action.user
  });

const registerFailure = (state, action) =>
  state.merge({ startingRegistration: false, errorCode: action.errorCode });

/**
 * Centre member reducers
 */
const verifyCentreMemberEmailAttempt = state =>
  state.merge({ activationKey: null, verifyingEmail: true, errorCode: null });

const verifyCentreMemberEmailSuccess = (state, action) =>
  state.merge({
    activationKey: action.activationKey,
    verifyingEmail: false,
    errorCode: null
  });

const verifyCentreMemberEmailFailure = (state, action) =>
  state.merge({
    activationKey: null,
    verifyingEmail: false,
    errorCode: action.errorCode
  });

/**
 * Centre member registration reducers
 */
const registerCentreMemberAttempt = state =>
  state.merge({ startingRegistration: true, registerData: null });

const registerCentreMemberSuccess = (state, action) =>
  state.merge({
    startingRegistration: false,
    registerData: action.registerData
  });

const registerCentreMemberFailure = state =>
  state.merge({ startingRegistration: false, registerData: null });

/**
 * Centre admin reducers
 */
const verifyAdminEmailAttempt = state =>
  state.merge({ activationKey: null, verifyingEmail: true, errorCode: null });

const verifyAdminEmailSuccess = (state, action) =>
  state.merge({
    activationKey: action.activationKey,
    verifyingEmail: false,
    errorCode: null
  });

const verifyAdminEmailFailure = (state, action) =>
  state.merge({
    activationKey: null,
    verifyingEmail: false,
    errorCode: action.errorCode
  });

/**
 * Centre member registration reducers
 */
const registerAdminAttempt = state =>
  state.merge({ startingRegistration: true, registerData: null });

const registerAdminSuccess = (state, action) =>
  state.merge({
    startingRegistration: false,
    registerData: action.registerData
  });

const registerAdminFailure = state =>
  state.merge({ startingRegistration: false, registerData: null });

/**
 * Send learner email reducers
 */
const sendLearnerEmailAttempt = state =>
  state.merge({ sendingEmail: true, errorCode: null });

const sendLearnerEmailSuccess = state =>
  state.merge({ sendingEmail: false, errorCode: null });

const sendLearnerEmailFailure = (state, action) =>
  state.merge({ sendingEmail: false, errorCode: action.errorCode });

/**
 * Learner activation Reducers
 */
const verifyEmailAttempt = state =>
  state.merge({ errorCode: null, verifyingEmail: true });

const verifyEmailSuccess = state =>
  state.merge({ verifyingEmail: false, errorCode: null });

const verifyEmailFailure = (state, action) =>
  state.merge({
    loginData: null,
    verifyingEmail: false,
    errorCode: action.errorCode
  });

/**
 * Available Memberships
 */
const getAvailableMembershipsAttempt = state =>
  state.merge({
    availableMemberships: [],
    gettingMemberships: true,
    errorCode: null
  });

const getAvailableMembershipsSuccess = (state, { data }) => {
  return state.merge({
    availableMemberships: data,
    gettingMemberships: false,
    errorCode: null
  });
};

const getAvailableMembershipsFailure = (state, action) => {
  return state.merge({ gettingMemberships: false });
};

const membershipVoucherCheckAttempt = state =>
  state.merge({ checkingVoucher: true, voucherCode: null, errorCode: null });

const membershipVoucherCheckSuccess = (state, { data }) => {
  return state.merge({
    checkingVoucher: false,
    voucherCode: data,
    errorCode: null
  });
};

const membershipVoucherCheckFailure = (state, action) => {
  return state.merge({ checkingVoucher: false });
};

const registerRequestAttempt = state =>
  state.merge({
    sendingRequest: true
  });

const sendRegisterRequestFailure = (state, action) =>
  state.merge({
    sendingRequest: false,
    errorCode: action.err
  });

const changeLoadingStatus = (state, action) =>
  state.merge({
    sendingRequest: action.loading
  });

// Register other
const verifyOtherEmailSuccess = state =>
  state.merge({
    verifyingEmail: false,
    errorCode: null
  });

const verifyOtherEmailFailure = state =>
  state.merge({
    verifyingEmail: false,
    errorCode: true
  });

const validateUlnAttempt = state =>
  state.merge({
    validatingUln: true
  });

const validateUlnSuccess = state =>
  state.merge({
    validatingUln: false
  });

const validateUlnFailure = state =>
  state.merge({
    validatingUln: false
  });

const resendVerificationEmailAttempt = state =>
  state.merge({
    emailResendAttempt: true
  });

const resendVerificationEmailSuccess = state =>
  state.merge({
    emailResendAttempt: false
  });

const resendVerificationEmailFailure = state =>
  state.merge({
    emailResendAttempt: false
  });

const verifyLearnerInvitationEmailFailure = (state, { errorCode }) =>
  state.merge({
    errorCode
  });

const ACTION_HANDLERS = {
  [Type.REGISTER_ATTEMPT]: registerAttempt,
  [Type.REGISTER_SUCCESS]: registerSuccess,
  [Type.REGISTER_FAILURE]: registerFailure,
  [Type.VERIFY_EMAIL_ATTEMPT]: verifyEmailAttempt,
  [Type.VERIFY_EMAIL_SUCCESS]: verifyEmailSuccess,
  [Type.VERIFY_EMAIL_FAILURE]: verifyEmailFailure,
  [Type.SEND_LEARNER_EMAIL_ATTEMPT]: sendLearnerEmailAttempt,
  [Type.SEND_LEARNER_EMAIL_SUCCESS]: sendLearnerEmailSuccess,
  [Type.SEND_LEARNER_EMAIL_FAILURE]: sendLearnerEmailFailure,
  [Type.REGISTER_EDUCATOR_ATTEMPT]: registerEducatorAttempt,
  [Type.REGISTER_EDUCATOR_SUCCESS]: registerEducatorSuccess,
  [Type.REGISTER_EDUCATOR_FAILURE]: registerEducatorFailure,
  [Type.SEND_EDUCATOR_EMAIL_ATTEMPT]: sendEducatorEmailAttempt,
  [Type.SEND_EDUCATOR_EMAIL_SUCCESS]: sendEducatorEmailSuccess,
  [Type.SEND_EDUCATOR_EMAIL_FAILURE]: sendEducatorEmailFailure,

  [Type.VERIFY_INVITATION_EMAIL_ATTEMPT]: verifyInvitationEmailAttempt,
  [Type.VERIFY_INVITATION_EMAIL_SUCCESS]: verifyInvitationEmailSuccess,
  [Type.VERIFY_INVITATION_EMAIL_FAILURE]: verifyInvitationEmailFailure,

  [Type.SET_ACTIVATION_DATA]: setActivationData,
  [Type.ACTIVATION_ATTEMPT]: activationAttempt,
  [Type.ACTIVATION_SUCCESS]: activationSuccess,
  [Type.ACTIVATION_FAILURE]: activationFailure,

  [Type.VERIFY_EDUCATOR_EMAIL_ATTEMPT]: verifyEducatorEmailAttempt,
  [Type.VERIFY_EDUCATOR_EMAIL_SUCCESS]: verifyEducatorEmailSuccess,
  [Type.VERIFY_EDUCATOR_EMAIL_FAILURE]: verifyEducatorEmailFailure,
  [Type.VERIFY_CENTRE_MEMBER_EMAIL_ATTEMPT]: verifyCentreMemberEmailAttempt,
  [Type.VERIFY_CENTRE_MEMBER_EMAIL_SUCCESS]: verifyCentreMemberEmailSuccess,
  [Type.VERIFY_CENTRE_MEMBER_EMAIL_FAILURE]: verifyCentreMemberEmailFailure,
  [Type.REGISTER_CENTRE_MEMBER_ATTEMPT]: registerCentreMemberAttempt,
  [Type.REGISTER_CENTRE_MEMBER_SUCCESS]: registerCentreMemberSuccess,
  [Type.REGISTER_CENTRE_MEMBER_FAILURE]: registerCentreMemberFailure,
  [Type.VERIFY_ADMIN_EMAIL_ATTEMPT]: verifyAdminEmailAttempt,
  [Type.VERIFY_ADMIN_EMAIL_SUCCESS]: verifyAdminEmailSuccess,
  [Type.VERIFY_ADMIN_EMAIL_FAILURE]: verifyAdminEmailFailure,
  [Type.REGISTER_ADMIN_ATTEMPT]: registerAdminAttempt,
  [Type.REGISTER_ADMIN_SUCCESS]: registerAdminSuccess,
  [Type.REGISTER_ADMIN_FAILURE]: registerAdminFailure,

  [Type.SEND_REGISTER_REQUEST_FAILURE]: sendRegisterRequestFailure,

  [Type.CREATE_BUSINESS_PROFILE_ATTEMPT]: registerRequestAttempt,
  [Type.CREATE_PERSONAL_PROFILE_ATTEMPT]: registerRequestAttempt,
  [Type.PAY_MEMBERSHIP_ATTEMPT]: registerRequestAttempt,

  [Type.GET_AVAILABLE_MEMBERSHIPS_ATTEMPT]: getAvailableMembershipsAttempt,
  [Type.GET_AVAILABLE_MEMBERSHIPS_SUCCESS]: getAvailableMembershipsSuccess,
  [Type.GET_AVAILABLE_MEMBERSHIPS_FAILURE]: getAvailableMembershipsFailure,

  [Type.MEMBERSHIP_VOUCHER_CHECK_ATTEMPT]: membershipVoucherCheckAttempt,
  [Type.MEMBERSHIP_VOUCHER_CHECK_SUCCESS]: membershipVoucherCheckSuccess,
  [Type.MEMBERSHIP_VOUCHER_CHECK_FAILURE]: membershipVoucherCheckFailure,

  [Type.CHANGE_LOADING_STATUS]: changeLoadingStatus,

  // Register other
  [Type.REGISTER_OTHER_SUCCESS]: registerSuccess,

  [Type.VERIFY_OTHER_EMAIL_SUCCESS]: verifyOtherEmailSuccess,
  [Type.VERIFY_OTHER_EMAIL_FAILURE]: verifyOtherEmailFailure,

  [Type.VALIDATE_ULN_ATTEMPT]: validateUlnAttempt,
  [Type.VALIDATE_ULN_SUCCESS]: validateUlnSuccess,
  [Type.VALIDATE_ULN_FAILURE]: validateUlnFailure,

  [Type.RESEND_VERIFICATION_EMAIL_ATTEMPT]: resendVerificationEmailAttempt,
  [Type.RESEND_VERIFICATION_EMAIL_SUCCESS]: resendVerificationEmailSuccess,
  [Type.RESEND_VERIFICATION_EMAIL_FAILURE]: resendVerificationEmailFailure,

  [Type.VERIFY_LEARNER_INVITATION_EMAIL_FAILURE]: verifyLearnerInvitationEmailFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
