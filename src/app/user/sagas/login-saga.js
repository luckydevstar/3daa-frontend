import { takeEvery, put, call, select } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { find, propEq, head, pathOr, propOr, pipe, prop } from 'ramda';
import { Types as Type, Creators as Actions } from 'app/user/actions';
import { Creators as CoreCreators } from 'app/core/actions';
import { Roles } from 'app/core/config/constants';
import RealtimeActions from 'app/realtime-services/actions/creator';
import RealtimeTypes from '../../realtime-services/actions/type';
import authenticatePusher from 'app/core/services/pusher';
import common from 'app/common';
import { translate } from 'app/intl';

const {
  helpers: { checkResponse },
  sagaSelectors: { getActiveSector },
  notify: { notifySuccess, notifyError }
} = common.util;

const { CentreLearner, CentreEQA } = Roles;

export default api => {
  function* loginAttempt(action) {
    const user = action.user;
    try {
      const resp = yield call(api.login, action.user);
      const { data } = yield checkResponse(resp);
      if (data.token) {
        yield put(Actions.loginSuccess(data, user));
        yield put(Actions.setAsMember());
        browserHistory.replace('/dashboard');
      } else {
        const problem = data.general || (yield translate('unable_to_login'));
        yield put(Actions.loginFailure(problem));
      }
    } catch (err) {
      yield put(Actions.loginFailure(err));
    }
  }

  function* loginSuccess(action) {
    const token = action.loginData && action.loginData.token;
    if (!token) {
      throw new Error('No token provided by server');
    }
    api.setAuthToken(token);
    yield put(Actions.getUserByTokenAttempt(token));
  }

  function* loginFailure({ errorCode }) {
    yield put(notifyError(yield translate(errorCode || 'login_failed')));
  }

  function* initiatePusher(userToken) {
    const {
      token: { token }
    } = userToken;
    try {
      yield authenticatePusher(token);
      yield put(RealtimeActions.realtimeConnectionOnline());
    } catch (e) {
      console.log('Realtime connection failure');
    }
  }

  function* getUserByTokenAttempt(action) {
    const { token, isNewSocialAccount } = action;

    try {
      // Check token first
      if (!token) {
        throw new Error('No token provided');
      }

      // This saga contains potentially useful get member resources (permissions)
      // code.

      // Get user
      const user = yield call(api.getUser);
      const sector = yield select(getActiveSector);
      yield checkResponse(user);

      // Try get permissions/permissions
      const permissions = yield call(
        api.getUserPermissions,
        user.data.data.member_id
      );
      yield checkResponse(permissions);

      const userData = {
        ...user.data.data,
        permissions: permissions.data.data
      };

      const { sectors, centres, current_qualification } = userData;

      const userRole = pathOr(userData.roles[0], [0, 'roles', 0])(centres);
      // Assign sector

      // If all else fails
      // const defaultSector = pipe(
      //   head,
      //   prop('sector_id')
      // )(sectors);

      // if (userRole === CentreLearner) {
      //   const activeSector = find(
      //     propEq(
      //       'sector_id',
      //       propOr(
      //         sector ? sector.sector_id : defaultSector,
      //         'sector_id',
      //         current_qualification
      //       )
      //     ),
      //     sectors
      //   );

      //   yield put(Actions.setActiveSector(activeSector));
      // } else if (
      //   !sector ||
      //   !find(propEq('sector_id', sector.sector_id))(sectors)
      // ) {
      //   // If there is no sector, or we can't find the sector ID in the user's
      //   // sectors array...
      //   yield put(Actions.setActiveSector(head(sectors)));
      // }
      yield put(
        Actions.setActiveSector({ sector_id: 0, title: 'ALL SECTORS' })
      );

      yield put(
        Actions.getUserByTokenSuccess(userData, isNewSocialAccount, token)
      );

      if (userRole === CentreEQA) {
        browserHistory.replace('/community/learners');
      }
    } catch (err) {
      yield put(Actions.getUserByTokenFailure(err));
    }
  }

  function* getUserByTokenSuccess(userData) {
    const { token } = userData;
    const {
      persisted: { loggedAsMember }
    } = yield select();
    if (loggedAsMember) {
      browserHistory.replace('/dashboard');
    }
    yield put(RealtimeActions.initiatePusher(token));
  }

  function* getUserByTokenFailure() {
    yield put(notifyError(yield translate('user_get_failed')));
    yield put(Actions.logout());
  }

  /**
   * Facebook login sagas
   * */
  function* loginWithFbAttempt(action) {
    const token = action.token;

    // Check token first
    if (!token) {
      throw new Error('No token provided from facebook');
    }

    try {
      const resp = yield call(api.loginWithFb, token);
      const { data } = yield checkResponse(resp);
      if (data.token) {
        yield put(Actions.loginWithFbSuccess(data));
      } else {
        yield put(Actions.loginWithFbFailure(yield translate('no_token')));
      }
    } catch (err) {
      yield put(Actions.loginWithFbFailure(err));
    }
  }

  function* loginWithFbSuccess(action) {
    const token = action.loginData && action.loginData.token;
    if (!token) {
      throw new Error('No token provided by server');
    }

    yield put(Actions.loginSuccess({ token }));
  }

  function* loginWithFbFailure(action) {
    const errorCode = action.errorCode;
    yield put(notifyError(yield translate('login_failed')));
  }

  /**
   * Google Login Sagas
   */
  function* loginWithGoogleAttempt(action) {
    const token = action.token;

    // Check token first
    if (!token) {
      throw new Error('No token provided from Google');
    }

    try {
      const resp = yield call(api.loginWithGoogle, token);
      const { data } = yield checkResponse(resp);
      yield put(Actions.loginWithGoogleSuccess(data));
    } catch (err) {
      yield put(Actions.loginWithGoogleFailure(err));
    }
  }

  function* loginWithGoogleSuccess(action) {
    const token = action.loginData && action.loginData.token;
    if (!token) {
      throw new Error('No token provided by server');
    }

    yield put(Actions.loginSuccess({ token }));
  }

  function* loginWithGoogleFailure(action) {
    const errorCode = action.errorCode;
    yield put(notifyError(yield translate('login_failed')));
  }

  function* logout(action) {
    const { noRedirect, noNotification } = action;
    yield put(CoreCreators.appLogout());

    // TODO proper logout handler
    // NOTE calling api.logout before appLogout doesn't work, getting errors in console
    yield call(api.logout);

    api.setAuthToken('');
    if (!noNotification) {
      yield put(notifySuccess(yield translate('msg_successfully_logged_out')));
    }
    yield put(CoreCreators.toggleAppLoading(false));
    if (!noRedirect) {
      browserHistory.push('/login');
    }
  }

  // Login as Member
  function* loginAsMemberAttempt(action) {
    const member_id = action.memberId;
    try {
      const resp = yield call(api.loginAsMember, member_id);
      const { data } = yield checkResponse(resp);

      if (data.token) {
        yield put(Actions.loginAsMemberSuccess(data));
        yield put(
          notifySuccess(
            `You have been successfully logged in with member_id: ${data.member_id}`
          )
        );
      } else {
        const problem = data.general || (yield translate('unable_to_login'));
        yield put(Actions.loginAsMemberFailure(problem));
      }
    } catch (err) {
      yield put(Actions.loginAsMemberFailure(err));
    }
  }

  function* loginAsMemberSuccess(action) {
    const token = action.loginData && action.loginData.token;

    if (!token) {
      throw new Error('No token provided by server');
    }
    api.setAuthToken(token);
    yield put(Actions.getUserByTokenAttempt(token));
  }

  function* loginAsMemberFailure({ errorCode }) {
    yield put(notifyError(yield translate(errorCode || 'login_failed')));
  }

  function* goBackToPrevToken(action) {
    api.setAuthToken(action.prevToken);
    yield put(Actions.getUserByTokenAttempt(action.prevToken));
    browserHistory.replace('/dashboard');
  }

  // -----------
  // The Main Watcher function
  // -----------
  function* startWatchers() {
    yield takeEvery(Type.LOGIN_ATTEMPT, loginAttempt);
    yield takeEvery(Type.LOGIN_SUCCESS, loginSuccess);
    yield takeEvery(Type.LOGIN_FAILURE, loginFailure);
    yield takeEvery(Type.GET_USER_BY_TOKEN_ATTEMPT, getUserByTokenAttempt);
    yield takeEvery(Type.GET_USER_BY_TOKEN_SUCCESS, getUserByTokenSuccess);
    yield takeEvery(Type.GET_USER_BY_TOKEN_FAILURE, getUserByTokenFailure);
    yield takeEvery(Type.LOGIN_WITH_FB_ATTEMPT, loginWithFbAttempt);
    yield takeEvery(Type.LOGIN_WITH_FB_SUCCESS, loginWithFbSuccess);
    yield takeEvery(Type.LOGIN_WITH_FB_FAILURE, loginWithFbFailure);
    yield takeEvery(Type.LOGIN_WITH_GOOGLE_ATTEMPT, loginWithGoogleAttempt);
    yield takeEvery(Type.LOGIN_WITH_GOOGLE_SUCCESS, loginWithGoogleSuccess);
    yield takeEvery(Type.LOGIN_WITH_GOOGLE_FAILURE, loginWithGoogleFailure);
    yield takeEvery(Type.LOGOUT, logout);
    yield takeEvery(RealtimeTypes.INITIATE_PUSHER, initiatePusher);
    yield takeEvery(Type.LOGIN_AS_MEMBER_ATTEMPT, loginAsMemberAttempt);
    yield takeEvery(Type.LOGIN_AS_MEMBER_SUCCESS, loginAsMemberSuccess);
    yield takeEvery(Type.LOGIN_AS_MEMBER_FAILURE, loginAsMemberFailure);
    yield takeEvery(Type.GO_BACK_TO_PREV_TOKEN, goBackToPrevToken);
  }

  return {
    startWatchers,
    loginAttempt,
    loginSuccess,
    loginFailure,
    getUserByTokenAttempt,
    getUserByTokenSuccess,
    getUserByTokenFailure,
    loginWithFbAttempt,
    loginWithFbSuccess,
    loginWithFbFailure,
    logout,
    initiatePusher,
    loginAsMemberAttempt,
    loginAsMemberSuccess,
    loginAsMemberFailure,
    goBackToPrevToken
  };
};
