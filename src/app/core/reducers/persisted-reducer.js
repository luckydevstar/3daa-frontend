import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import user from 'app/user';
import { Types } from 'app/core/actions';

const UserActionType = user.Type;

export const INITIAL_STATE = Immutable({
  token: null,
  sector: null,
  lang: 'en',
  prevToken: null,
  loggedAsMember: false
});

// persist token on successful login
const loginSuccess = (state, action) => {
  const token = action.loginData && action.loginData.token;
  return state.merge({ token, prevToken: token });
};

const loginAsMemberSuccess = (state, action) => {
  const token = action.loginData && action.loginData.token;
  return state.merge({
    token,
    loggedAsMember: true
  });
};

const loginAsMemberFailure = state => state.merge({ loggedAsMember: false });

const setAsMember = state => state.merge({ loggedAsMember: false });

const goBackToPrevToken = (state, action) => {
  return state.merge({
    token: action.prevToken,
    loggedAsMember: false
  });
};

const setUserToken = (state, { token }) => state.merge({ token });

// Set an active sector
const setActiveSector = (state, { sector }) => state.merge({ sector });

// Remove token on failed login
const loginFailure = state => state.merge({ token: null });

// Remove token on failed login
const logout = state => state.merge({ token: null });

const language = (state, { lang }) => state.merge({ lang });

// map our types to our handlers
const ACTION_HANDLERS = {
  [UserActionType.LOGIN_SUCCESS]: loginSuccess,
  [UserActionType.SET_USER_TOKEN]: setUserToken,
  [UserActionType.SET_ACTIVE_SECTOR]: setActiveSector,
  [UserActionType.LOGIN_WITH_FB_SUCCESS]: loginSuccess,
  [UserActionType.LOGIN_FAILURE]: loginFailure,
  [UserActionType.LOGOUT]: logout,
  [UserActionType.GET_USER_BY_TOKEN_FAILURE]: loginFailure,
  [UserActionType.LOGIN_WITH_FB_FAILURE]: loginFailure,
  [Types.LANGUAGE]: language,
  [UserActionType.LOGIN_AS_MEMBER_SUCCESS]: loginAsMemberSuccess,
  [UserActionType.LOGIN_AS_MEMBER_FAILURE]: loginAsMemberFailure,
  [UserActionType.GO_BACK_TO_PREV_TOKEN]: goBackToPrevToken,
  [UserActionType.SET_AS_MEMBER]: setAsMember
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
