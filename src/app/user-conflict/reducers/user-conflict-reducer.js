import { Types } from 'app/user-conflict/actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  users: [],
  usersTotal: 0,
  usersLoading: false,
  error: null,
  userUpdateLoading: false,
  userUpdatePopup: false
});

/**
 * Update settings
 */

const getUserConflictListAttempt = state =>
  state.merge({
    usersLoading: true
  });
const getUserConflictListSuccess = (state, action) =>
  state.merge({
    users: action.users,
    usersTotal: action.usersTotal,
    usersLoading: false
  });
const getUserConflictListFailure = (state, action) =>
  state.merge({
    error: action.error,
    usersLoading: false
  });

const updateUserConflictEmailAttempt = (state, action) =>
  state.merge({
    userUpdateLoading: true
  });

const updateUserConflictEmailSuccess = state =>
  state.merge({
    userUpdateLoading: false,
    userUpdatePopup: true
  });

const updateUserConflictEmailFailure = (state, action) =>
  state.merge({
    userUpdateLoading: false,
    error: action.error
  });

const closeUserConclictUpdateEmailModal = state =>
  state.merge({
    userUpdatePopup: false
  });

const deleteUserConflictAttempt = state =>
  state.merge({
    usersLoading: true
  });

const deleteUserConflictSuccess = state =>
  state.merge({
    usersLoading: false
  });

const deleteUserConflictFailure = state =>
  state.merge({
    usersLoading: false
  });

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.GET_USER_CONFLICT_LIST_ATTEMPT]: getUserConflictListAttempt,
  [Types.GET_USER_CONFLICT_LIST_SUCCESS]: getUserConflictListSuccess,
  [Types.GET_USER_CONFLICT_LIST_FAILURE]: getUserConflictListFailure,

  [Types.UPDATE_USER_CONFLICT_EMAIL_ATTEMPT]: updateUserConflictEmailAttempt,
  [Types.UPDATE_USER_CONFLICT_EMAIL_SUCCESS]: updateUserConflictEmailSuccess,
  [Types.UPDATE_USER_CONFLICT_EMAIL_FAILURE]: updateUserConflictEmailFailure,

  [Types.DELETE_USER_CONFLICT_ATTEMPT]: deleteUserConflictAttempt,
  [Types.DELETE_USER_CONFLICT_SUCCESS]: deleteUserConflictSuccess,
  [Types.DELETE_USER_CONFLICT_FAILURE]: deleteUserConflictFailure,

  [Types.CLOSE_USER_CONCLICT_UPDATE_EMAIL_MODAL]: closeUserConclictUpdateEmailModal
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
