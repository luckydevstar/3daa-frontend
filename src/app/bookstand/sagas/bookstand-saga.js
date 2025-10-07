import React from 'react';
import { find, propEq } from 'ramda';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import common from 'app/common';
import { Types, Creators as BookstandCreators } from '../actions';
import { translate } from 'app/intl';

const {
  helpers: { checkResponse },
  notify: { notifyError, notifySuccess },
  sagaSelectors: { getQualifications }
} = common.util;

export default api => {
  // Sector qualifications
  function* getSectorQualificationsAttempt({ sectorId }) {
    try {
      const resp = yield call(api.getAllQualifications, sectorId);
      const {
        data: { qualifications }
      } = yield checkResponse(resp);
      // NOTE data -> data.sector & data.qualifications
      yield put(
        BookstandCreators.getSectorQualificationsSuccess(qualifications)
      );
    } catch (err) {
      yield put(BookstandCreators.getSectorQualificationsFailure(err));
    }
  }

  function* notifyQualificationsSuccess(qualifications) {
    const message = qualifications.length
      ? 'qualifications_loaded'
      : 'no_qualifications_found';
    yield put(
      notifySuccess(yield translate(message), {
        duration: 3000,
        canDimiss: true
      })
    );
  }

  function* notifyQualificationsFailure(errorCode) {
    yield put(
      notifyError(yield translate(errorCode), {
        duration: 3000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getSectorQualificationsSuccess({ qualifications }) {
    yield call(notifyQualificationsSuccess, qualifications);
  }

  function* getSectorQualificationsFailure({ errorCode }) {
    yield call(notifyQualificationsFailure, errorCode);
  }

  function* getSectorQualificationAttempt({ qualificationId }) {
    try {
      const resp = yield call(api.getQualification, qualificationId);
      const { data } = yield checkResponse(resp);
      // NOTE data -> data.qualification & data.units
      // TODO api needs to put units inside qualification, same as centre endpoint
      const qualification = {
        ...data.qualification,
        units: data.units
      };
      yield put(BookstandCreators.getSectorQualificationSuccess(qualification));
    } catch (err) {
      yield put(BookstandCreators.getSectorQualificationFailure(err));
    }
  }

  function* getSectorQualificationFailure({ errorCode }) {
    yield call(notifyQualificationsFailure, errorCode);
  }

  // Centre (tutor) qualifications
  function* getCentreTutorQualificationsAttempt({ centreId, sectorId }) {
    try {
      const resp = yield call(api.getCentreQualifications, centreId, sectorId);
      const { data } = yield checkResponse(resp);
      yield put(BookstandCreators.getCentreTutorQualificationsSuccess(data));
    } catch (err) {
      yield put(BookstandCreators.getCentreTutorQualificationsFailure(err));
    }
  }

  function* getCentreTutorQualificationsSuccess({ qualifications }) {
    yield call(notifyQualificationsSuccess, qualifications);
  }

  function* getCentreTutorQualificationsFailure({ errorCode }) {
    yield call(notifyQualificationsFailure, errorCode);
  }

  function* getCentreTutorQualificationAttempt({ centreId, qualificationId }) {
    try {
      const resp = yield call(
        api.getCentreQualification,
        centreId,
        qualificationId
      );
      const { data } = yield checkResponse(resp);
      yield put(BookstandCreators.getCentreTutorQualificationSuccess(data));
    } catch (err) {
      yield put(BookstandCreators.getCentreTutorQualificationFailure(err));
    }
  }

  function* getCentreTutorQualificationFailure({ errorCode }) {
    yield call(notifyQualificationsFailure, errorCode);
  }

  // Assess learner
  function* getAssessLearnerAttempt({ memberId }) {
    try {
      const resp = yield call(api.getMember, memberId);
      const { data } = yield checkResponse(resp);
      yield put(BookstandCreators.getAssessLearnerSuccess(data));
    } catch (err) {
      yield put(BookstandCreators.getAssessLearnerFailure(err));
    }
  }

  function* getAssessLearnerFailure({ errorCode }) {
    yield call(notifyQualificationsFailure, errorCode);
  }

  // Learner qualifications
  function* getLearnerQualificationsAttempt({ memberId, sectorId }) {
    try {
      const resp = yield call(api.getMemberQualifications, memberId, sectorId);
      const { data } = yield checkResponse(resp);

      // NOTE data -> list of qualifications
      yield put(BookstandCreators.getLearnerQualificationsSuccess(data));
    } catch (err) {
      yield put(BookstandCreators.getLearnerQualificationsFailure(err));
    }
  }

  function* getLearnerQualificationsSuccess({ qualifications }) {
    yield call(notifyQualificationsSuccess, qualifications);
  }

  function* getLearnerQualificationsFailure({ errorCode }) {
    yield call(notifyQualificationsFailure, errorCode);
  }

  function* getLearnerQualificationAttempt({ qualificationId }) {
    const qualifications = yield select(getQualifications);

    const qualification = find(propEq('qualification_id', qualificationId))(
      qualifications
    );
    if (qualification) {
      yield put(
        BookstandCreators.getLearnerQualificationSuccess(qualification)
      );
    } else {
      yield put(
        BookstandCreators.getLearnerQualificationFailure(
          'qualification_unavailable'
        )
      );
    }
  }

  function* getLearnerQualificationFailure({ errorCode }) {
    yield call(notifyQualificationsFailure, errorCode);
  }

  function* startWatchers() {
    // Sector qualifications
    yield takeEvery(
      Types.GET_SECTOR_QUALIFICATIONS_ATTEMPT,
      getSectorQualificationsAttempt
    );
    yield takeEvery(
      Types.GET_SECTOR_QUALIFICATIONS_SUCCESS,
      getSectorQualificationsSuccess
    );
    yield takeEvery(
      Types.GET_SECTOR_QUALIFICATIONS_FAILURE,
      getSectorQualificationsFailure
    );
    yield takeEvery(
      Types.GET_SECTOR_QUALIFICATION_ATTEMPT,
      getSectorQualificationAttempt
    );
    yield takeEvery(
      Types.GET_SECTOR_QUALIFICATION_FAILURE,
      getSectorQualificationFailure
    );
    // Centre (tutor) qualifications
    yield takeEvery(
      Types.GET_CENTRE_TUTOR_QUALIFICATIONS_ATTEMPT,
      getCentreTutorQualificationsAttempt
    );
    yield takeEvery(
      Types.GET_CENTRE_TUTOR_QUALIFICATIONS_SUCCESS,
      getCentreTutorQualificationsSuccess
    );
    yield takeEvery(
      Types.GET_CENTRE_TUTOR_QUALIFICATIONS_FAILURE,
      getCentreTutorQualificationsFailure
    );
    yield takeEvery(
      Types.GET_CENTRE_TUTOR_QUALIFICATION_ATTEMPT,
      getCentreTutorQualificationAttempt
    );
    yield takeEvery(
      Types.GET_CENTRE_TUTOR_QUALIFICATION_FAILURE,
      getCentreTutorQualificationFailure
    );
    // Assess learner
    yield takeEvery(Types.GET_ASSESS_LEARNER_ATTEMPT, getAssessLearnerAttempt);
    yield takeEvery(Types.GET_ASSESS_LEARNER_FAILURE, getAssessLearnerFailure);
    // Learner qualifications
    yield takeEvery(
      Types.GET_LEARNER_QUALIFICATIONS_ATTEMPT,
      getLearnerQualificationsAttempt
    );
    yield takeEvery(
      Types.GET_LEARNER_QUALIFICATIONS_SUCCESS,
      getLearnerQualificationsSuccess
    );
    yield takeEvery(
      Types.GET_LEARNER_QUALIFICATIONS_FAILURE,
      getLearnerQualificationsFailure
    );
    yield takeEvery(
      Types.GET_LEARNER_QUALIFICATION_ATTEMPT,
      getLearnerQualificationAttempt
    );
    yield takeEvery(
      Types.GET_LEARNER_QUALIFICATION_FAILURE,
      getLearnerQualificationFailure
    );
  }

  return {
    startWatchers
  };
};
