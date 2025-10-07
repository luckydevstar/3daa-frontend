import { Types as Type } from 'app/user/actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  attemptingPasswordReset: false,
  passwordResetSuccess: false,
  passwordResetFailure: false,

  attemptingUpdateResetPassword: false,
  updateResetPasswordSuccess: false,
  updateResetPasswordFailure: false,
  updateResetPasswordErrorMessage: ''
});

/**
 * Reset password
 */
const passwordResetAttempt = (state, action) => {
  return state.merge({
    attemptingPasswordReset: true,
    passwordResetSuccess: false,
    passwordResetFailure: false
  });
};

const passwordResetSuccess = (state, action) =>
  state.merge({
    attemptingPasswordReset: false,
    passwordResetSuccess: true,
    passwordResetFailure: false
  });

const passwordResetFailure = (state, action) =>
  state.merge({
    attemptingPasswordReset: false,
    passwordResetSuccess: false,
    passwordResetFailure: true
  });

const updateResetPasswordAttempt = (state, action) =>
  state.merge({
    attemptingUpdateResetPassword: true,
    updateResetPasswordSuccess: false,
    updateResetPasswordFailure: false,
    updateResetPasswordErrorMessage: ''
  });
const updateResetPasswordSuccess = (state, action) =>
  state.merge({
    attemptingUpdateResetPassword: false,
    updateResetPasswordSuccess: true,
    updateResetPasswordFailure: false,
    updateResetPasswordErrorMessage: ''
  });
const updateResetPasswordFailure = (state, action) =>
  state.merge({
    attemptingUpdateResetPassword: false,
    updateResetPasswordSuccess: false,
    updateResetPasswordFailure: true,
    updateResetPasswordErrorMessage: action.error
  });

// map our types to our handlers
const ACTION_HANDLERS = {
  [Type.PASSWORD_RESET_ATTEMPT]: passwordResetAttempt,
  [Type.PASSWORD_RESET_SUCCESS]: passwordResetSuccess,
  [Type.PASSWORD_RESET_FAILURE]: passwordResetFailure,
  [Type.UPDATE_RESET_PASSWORD_ATTEMPT]: updateResetPasswordAttempt,
  [Type.UPDATE_RESET_PASSWORD_SUCCESS]: updateResetPasswordSuccess,
  [Type.UPDATE_RESET_PASSWORD_FAILURE]: updateResetPasswordFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
