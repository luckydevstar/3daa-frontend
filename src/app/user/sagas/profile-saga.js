/* eslint no-unused-vars: 'off', no-use-before-define: 'off' */
import { takeEvery, put, call, fork, select } from 'redux-saga/effects';
import { find, propEq, head, path, pathOr, propOr, pipe, prop } from 'ramda';
import common from 'app/common';
import { Types as Type, Creators as Actions } from 'app/user/actions';
import { checkResponse } from 'app/common/util/helpers';
import { Roles } from 'app/core/config/constants';

const { CentreLearner } = Roles;
const convertToFormData = common.util.helpers.convertToFormData;
const {
  notify: { notifyError, notifySuccess }
} = common.util;

const getActiveSector = ({ persisted: { sector } }) => sector;
const getUser = state => state.profile.user;

export default api => {
  function* updateOwnProfileAttempt(action) {
    try {
      let user;
      let userOk;
      // Attempt update
      const update = yield call(
        api.updateOwnProfile,
        convertToFormData(action.payload)
      );
      const updateOk =
        update && update.ok && update.data && update.data.status === 'success';
      // If update OK, attempt fetch of updated user
      if (updateOk) {
        // NOTE update token on user update
        const token = path(['data', 'data', 'token'])(update);
        if (token) {
          api.setAuthToken(token);
          yield put(Actions.setUserToken(token));
        }
        console.log('profile get user');
        user = yield call(api.getUser);
        userOk =
          user.ok &&
          user.data &&
          user.data.data &&
          user.data.status === 'success';
      }
      // If update and User OK, update state.profile.user with new data
      // as well as any extra data passed to the action
      if (updateOk && userOk) {
        const newUserObj = {
          ...user.data.data,
          ...action.extraUserData
        };

        // TODO DUPLCIATED FROM LOGIN SAGA FFS... @andris
        const sector = yield select(getActiveSector);
        const { sectors, centres, current_qualification } = newUserObj;
        const userRole = pathOr(newUserObj.roles[0], [0, 'roles', 0])(centres);

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

        yield put(Actions.updateOwnProfileSuccess(newUserObj));
      } else {
        yield put(
          Actions.updateOwnProfileFailure(update.problem || user.problem)
        );
      }
    } catch (err) {
      yield put(Actions.updateOwnProfileFailure(err));
    }
  }

  function* getAdminBalanceAttempt(params) {
    try {
      const response = yield call(api.getAdminBalance, params);
      const { data } = yield checkResponse(response);

      yield put(Actions.getAdminBalanceSuccess(data));
    } catch (err) {
      console.log(err);
      // yield put(notifyError(yield translate(err)));
      yield put(Actions.getAdminBalanceFailure(err));
    }
  }

  function* updateProfileAttempt({ params }) {
    try {
      const resp = yield call(api.updateProfile, params);
      console.log(resp);
      if (resp.ok) {
        yield put(Actions.updateProfileSuccess());
      } else {
        throw resp.data.message;
      }
    } catch (err) {
      yield put(Actions.updateProfileFailure(err));
    }
  }

  function* updateProfileSuccess() {
    yield put(notifySuccess('Password updated successfully'));
  }

  function* updateProfileFailure({ err }) {
    yield put(notifyError(err));
  }

  function* startWatchers() {
    yield takeEvery(Type.UPDATE_OWN_PROFILE_ATTEMPT, updateOwnProfileAttempt);
    yield takeEvery(Type.GET_ADMIN_BALANCE_ATTEMPT, getAdminBalanceAttempt);
    yield takeEvery(Type.UPDATE_PROFILE_ATTEMPT, updateProfileAttempt);
    yield takeEvery(Type.UPDATE_PROFILE_SUCCESS, updateProfileSuccess);
    yield takeEvery(Type.UPDATE_PROFILE_FAILURE, updateProfileFailure);
  }

  return {
    startWatchers,
    updateOwnProfileAttempt,
    getAdminBalanceAttempt
  };
};
