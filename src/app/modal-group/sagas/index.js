import { takeEvery, takeLatest, put, call, select } from 'redux-saga/effects';
import { head } from 'ramda';
import { checkResponse, isWhitespace } from 'app/common/util/helpers';
import { notifyError } from 'app/common/util/notify';
import { Types, Creators } from '../actions';
import common from 'app/common';
import { translate } from 'app/intl';

const {
  helpers: { convertToFormData, organiseQualificationsAndPathways },
  sagaSelectors: { getUserCentres, getActiveSector }
} = common.util;

export default {
  modalGroupSaga: api => {
    /**
     * Get group qualifications
     */
    function* getGroupQualificationsAttempt() {
      try {
        const centres = yield select(getUserCentres);
        const sector = yield select(getActiveSector);
        const sectorId = sector.sector_id;
        const centreId = head(centres).centre_id;
        const response = yield call(
          api.getCentreQualifications,
          centreId,
          sectorId
        );
        console.log(response);
        const { data } = yield checkResponse(response);
        yield put(
          Creators.getGroupQualificationsSuccess(
            organiseQualificationsAndPathways(data)
          )
        );
      } catch (err) {
        yield put(notifyError(yield translate('qualifications_get_err')));
        yield put(Creators.getGroupQualificationsFailure(err));
      }
    }

    /**
     * Group member search
     */
    function* findUsers(searchTerm, centreId, userType, qualification_id) {
      const params = {
        search: searchTerm,
        centre_roles: [userType],
        qualification_id,
        all: 1,
        existing_members: 1,
        limit: 999999999 // yolo
      };
      const response = yield call(api.getCentreMembers, centreId, params);
      const {
        data: { members }
      } = yield checkResponse(response);
      return members;
    }

    function* findLearners(searchTerm, centreId, userType, qualification_id) {
      const params = {
        search: searchTerm,
        centre_roles: [userType],
        qualification_id,
        all: 1,
        existing_members: 1,
        limit: 999999999 // yolo
      };
      const response = yield call(api.getCentreLearners, centreId, params);
      const {
        data: { learners }
      } = yield checkResponse(response);
      return learners;
    }

    function* findSeats(searchTerm, centreId, qualification_id) {
      const params = {
        search: searchTerm,
        qualification_id
      };
      const response = yield call(api.getCentreSeats, centreId, params);
      const {
        data: { seats }
      } = yield checkResponse(response);
      return seats;
    }

    function* searchForGroupMembersAttempt({
      searchTerm,
      userType,
      qualificationId
    }) {
      try {
        const {
          profile: {
            user: { centres }
          }
        } = yield select();
        const centreId = head(centres).centre_id;
        const users = !isWhitespace(userType)
          ? yield userType === 'CENTRE_LEARNER_ROLE'
              ? findLearners(searchTerm, centreId, userType, qualificationId)
              : findUsers(searchTerm, centreId, userType, qualificationId)
          : yield findSeats(searchTerm, centreId, qualificationId);
        yield put(Creators.searchForGroupMembersSuccess(users));
      } catch (err) {
        yield put(notifyError(yield translate('search_err')));
        yield put(Creators.searchForGroupMembersFailure(err));
      }
    }

    /**
     * Group save/update
     */
    function* updateGroup(payload, centreId, groupId) {
      const response = yield call(
        api.updateCentreGroup,
        centreId,
        groupId,
        payload
      );
      yield checkResponse(response);
      yield put(Creators.saveGroupSuccess());
      yield put(Creators.setCloseModal(true));
    }

    function* createGroup(payload, centreId) {
      const response = yield call(api.createCentreGroup, centreId, payload);
      yield checkResponse(response);
      yield put(Creators.saveGroupSuccess());
      yield put(Creators.setCloseModal(true));
    }

    function* saveGroupAttempt({ payload }) {
      try {
        const {
          profile: {
            user: { centres }
          }
        } = yield select();
        const centreId = head(centres).centre_id;
        const { group_id } = payload;
        const fdPayload = convertToFormData(payload);
        if (group_id) yield updateGroup(fdPayload, centreId, group_id);
        else yield createGroup(fdPayload, centreId);
      } catch (err) {
        yield put(notifyError(yield translate('save_group_err')));
        yield put(Creators.saveGroupFailure(err));
      }
    }

    function* startWatchers() {
      yield takeLatest(
        Types.SEARCH_FOR_GROUP_MEMBERS_ATTEMPT,
        searchForGroupMembersAttempt
      );
      yield takeEvery(
        Types.GET_GROUP_QUALIFICATIONS_ATTEMPT,
        getGroupQualificationsAttempt
      );
      yield takeEvery(Types.SAVE_GROUP_ATTEMPT, saveGroupAttempt);
    }

    return {
      startWatchers,
      searchForGroupMembersAttempt,
      saveGroupAttempt,
      getGroupQualificationsAttempt
    };
  }
};
