import { Types as Type } from 'app/user/actions';
import { Types as CoreTypes } from 'app/core/actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  loginData: null,
  errorCode: null,
  attemptingToLogin: false,
  hydrated: false
});

const appStart = state => state.merge({ hydrated: true });

/**
 * Login reducers
 */
const loginAttempt = state =>
  state.merge({ loginData: null, attemptingToLogin: true, errorCode: null });

const loginSuccess = (state, action) =>
  state.merge({
    loginData: action.loginData,
    attemptingToLogin: false,
    errorCode: null
  });

const loginFailure = (state, action) =>
  state.merge({
    loginData: null,
    attemptingToLogin: false,
    errorCode: action.errorCode
  });

const getUserByTokenAttempt = state =>
  state.merge({ attemptingToLogin: true, errorCode: null });

const getUserByTokenSuccess = state =>
  state.merge({ attemptingToLogin: false, errorCode: null });

const getUserByTokenFailure = (state, action) =>
  state.merge({ attemptingToLogin: false, errorCode: action.errorCode });

const logout = state =>
  state.merge({
    loginData: null,
    attemptingToLogin: false,
    startingRegistration: false,
    attemptingToActivate: false
  });

/**
 * When verifying a Learner email during registration, a token is returned
 * so that the user can be logged in and a session started.
 * These
 */
const verifyEmailAttempt = state => state.merge({ loginData: null });

const verifyEmailSuccess = (state, action) =>
  state.merge({ loginData: action.activationData });

const verifyEmailFailure = (state, action) =>
  state.merge({ loginData: null, errorCode: action.errorCode });

const loginAsMemberAttempt = state =>
  state.merge({ attemptingToLogin: true, errorCode: null });

const loginAsMemberSuccess = state =>
  state.merge({
    attemptingToLogin: false,
    errorCode: null
  });

const loginAsMemberFailure = (state, action) =>
  state.merge({
    attemptingToLogin: false,
    errorCode: action.errorCode
  });

const ACTION_HANDLERS = {
  [CoreTypes.APP_START]: appStart,
  [Type.LOGIN_ATTEMPT]: loginAttempt,
  [Type.LOGIN_SUCCESS]: loginSuccess,
  [Type.LOGIN_FAILURE]: loginFailure,
  [Type.GET_USER_BY_TOKEN_ATTEMPT]: getUserByTokenAttempt,
  [Type.GET_USER_BY_TOKEN_SUCCESS]: getUserByTokenSuccess,
  [Type.GET_USER_BY_TOKEN_FAILURE]: getUserByTokenFailure,
  [Type.LOGOUT]: logout,
  [Type.VERIFY_EMAIL_ATTEMPT]: verifyEmailAttempt,
  [Type.VERIFY_EMAIL_SUCCESS]: verifyEmailSuccess,
  [Type.VERIFY_EMAIL_FAILURE]: verifyEmailFailure,
  [Type.LOGIN_AS_MEMBER_ATTEMPT]: loginAsMemberAttempt,
  [Type.LOGIN_AS_MEMBER_SUCCESS]: loginAsMemberSuccess,
  [Type.LOGIN_AS_MEMBER_FAILURE]: loginAsMemberFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
