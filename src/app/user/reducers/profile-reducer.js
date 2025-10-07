import { Types as Type } from 'app/user/actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  user: null,
  primaryProfile: null,
  updatingOwnProfile: false,
  secondaryProfiles: [],
  adminBalance: null,
  passwordResetAttempt: false
});

const getUserByTokenSuccess = (state, { user }) =>
  state.merge({
    user: {
      ...state.user,
      ...user,
      ...{ sectors: [{ sector_id: 0, title: 'ALL SECTORS' }, ...user.sectors] }
    }
  });

const getUserByTokenFailure = state => state.merge({ user: null });

const updateOwnProfileAttempt = state =>
  state.merge({ updatingOwnProfile: true });

const updateOwnProfileSuccess = (state, { user }) =>
  state.merge({ updatingOwnProfile: false, user: { ...state.user, ...user } });

const updateOwnProfileFailure = state =>
  state.merge({ updatingOwnProfile: false });

const updateLocalUser = (state, action) => {
  const newUserState = {
    ...state.user,
    ...action.user
  };
  return state.merge({ user: newUserState });
};

const getAdminBalanceAttempt = state => state.merge({ adminBalance: null });

const getAdminBalanceSuccess = (state, { data }) =>
  state.merge({
    adminBalance: data
  });

const setProfileWithUlnSuccess = (state, { user }) =>
  state.merge({
    user
  });

const updateProfileAttempt = state =>
  state.merge({
    passwordResetAttempt: true
  });

const updateProfileSuccess = state =>
  state.merge({
    passwordResetAttempt: false
  });

const updateProfileFailure = state =>
  state.merge({
    passwordResetAttempt: false
  });

// map our types to our handlers
const ACTION_HANDLERS = {
  [Type.GET_USER_BY_TOKEN_SUCCESS]: getUserByTokenSuccess,
  [Type.GET_USER_BY_TOKEN_FAILURE]: getUserByTokenFailure,
  [Type.UPDATE_OWN_PROFILE_ATTEMPT]: updateOwnProfileAttempt,
  [Type.UPDATE_OWN_PROFILE_SUCCESS]: updateOwnProfileSuccess,
  [Type.UPDATE_OWN_PROFILE_FAILURE]: updateOwnProfileFailure,
  [Type.LOGOUT]: getUserByTokenFailure,
  [Type.UPDATE_LOCAL_USER]: updateLocalUser,
  [Type.GET_ADMIN_BALANCE_ATTEMPT]: getAdminBalanceAttempt,
  [Type.GET_ADMIN_BALANCE_SUCCESS]: getAdminBalanceSuccess,

  [Type.SET_PROFILE_WITH_ULN_SUCCESS]: setProfileWithUlnSuccess,

  [Type.UPDATE_PROFILE_ATTEMPT]: updateProfileAttempt,
  [Type.UPDATE_PROFILE_SUCCESS]: updateProfileSuccess,
  [Type.UPDATE_PROFILE_FAILURE]: updateProfileFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
