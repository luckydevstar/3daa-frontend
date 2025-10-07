import React from 'react';
import refactorUnitsData from 'app/units/util/refactor-unit-data';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import { Types, Creators as Actions } from '../actions';
import common from 'app/common';
import { translate } from 'app/intl';
import unit from '../../intl/components/unit';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifyError, notifySuccess },
  sagaSelectors: { getUserCentres, getActiveSector }
} = common.util;

export default api => {
  function* getElearningHoursAttempt({ centre_id, params }) {
    try {
      // Send API calls
      const resp = yield call(api.getElearningHours, centre_id, params);
      const data = yield checkResponse(resp);
      yield put(Actions.getElearningHoursSuccess(data));
    } catch (err) {
      yield put(Actions.getElearningHoursFailure(err));
    }
  }

  function* getElearningHoursFailure() {
    yield put(
      notifyError(yield translate('invitation_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getHoursMemberActivityAttempt({ member_id }) {
    try {
      // Send API calls
      const resp = yield call(api.getHoursMemberActivity, member_id);
      const data = yield checkResponse(resp);
      yield put(Actions.getHoursMemberActivitySuccess(data));
    } catch (err) {
      yield put(Actions.getHoursMemberActivityFailure(err));
    }
  }

  function* getHoursMemberActivityFailure() {
    yield put(
      notifyError(yield translate('invitation_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getHoursMemberActivityQualificationAttempt({
    member_id,
    qualification_id
  }) {
    try {
      // Send API calls
      const resp = yield call(
        api.getHoursMemberActivityQualification,
        member_id,
        qualification_id
      );
      const data = yield checkResponse(resp);
      yield put(Actions.getHoursMemberActivityQualificationSuccess(data));
    } catch (err) {
      yield put(Actions.getHoursMemberActivityQualificationFailure(err));
    }
  }

  function* getHoursMemberActivityQualificationFailure() {
    yield put(
      notifyError(yield translate('invitation_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getAssessmentGuidanceAttempt({ params }) {
    try {
      // Send API calls
      const resp = yield call(api.getAssessmentGuidance, params);
      const data = yield checkResponse(resp);
      yield put(Actions.getAssessmentGuidanceSuccess(data));
    } catch (err) {
      yield put(Actions.getAssessmentGuidanceFailure(err));
    }
  }

  function* getAssessmentGuidanceFailure() {
    yield put(
      notifyError(yield translate('invitation_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getAssessmentMemberQualificationAttempt({
    member_id,
    qualification_id,
    params
  }) {
    try {
      // Send API calls
      const resp = yield call(
        api.getAssessmentMemberQualification,
        member_id,
        qualification_id,
        params
      );
      const data = yield checkResponse(resp);
      yield put(Actions.getAssessmentMemberQualificationSuccess(data));
    } catch (err) {
      yield put(Actions.getAssessmentMemberQualificationFailure(err));
    }
  }

  function* getAssessmentMemberQualificationFailure() {
    yield put(
      notifyError(yield translate('qualification_get_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getAssessmentMemberUnitAttempt({
    member_id,
    qualification_id,
    unit_id
  }) {
    try {
      // Send API calls
      const resp = yield call(
        api.getAssessmentMemberUnit,
        member_id,
        qualification_id,
        unit_id
      );
      const data = yield checkResponse(resp);
      yield put(Actions.getAssessmentMemberUnitSuccess(data));
    } catch (err) {
      yield put(Actions.getAssessmentMemberUnitFailure(err));
    }
  }

  function* getAssessmentMemberUnitFailure() {
    yield put(
      notifyError(yield translate('unit_get_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getAssessmentMemberEvidencesAttempt({
    member_id,
    qualification_id,
    params
  }) {
    try {
      // Send API calls
      const resp = yield call(
        api.getAssessmentMemberEvidences,
        member_id,
        qualification_id,
        params
      );
      console.log(resp);
      const data = yield checkResponse(resp);
      yield put(Actions.getAssessmentMemberEvidencesSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Actions.getAssessmentMemberEvidencesFailure(err));
    }
  }

  function* getAssessmentMemberEvidencesFailure() {
    yield put(
      notifyError(yield translate('evidences_get_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getAssessmentMemberEvidenceDetailsAttempt({
    member_id,
    qualification_id,
    evidence_id
  }) {
    try {
      // Send API calls
      const resp = yield call(
        api.getAssessmentMemberEvidenceDetails,
        member_id,
        qualification_id,
        evidence_id
      );
      const data = yield checkResponse(resp);
      yield put(Actions.getAssessmentMemberEvidenceDetailsSuccess(data));
    } catch (err) {
      yield put(Actions.getAssessmentMemberEvidenceDetailsFailure(err));
    }
  }

  function* getAssessmentMemberEvidenceDetailsFailure() {
    yield put(
      notifyError(yield translate('evidence_get_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getAssessmentAllCriteriasAttempt({ member_id, qualification_id }) {
    try {
      // Send API calls
      const resp = yield call(
        api.getAssessmentAllCriterias,
        member_id,
        qualification_id
      );
      const data = yield checkResponse(resp);
      yield put(Actions.getAssessmentAllCriteriasSuccess(data));
    } catch (err) {
      yield put(Actions.getAssessmentAllCriteriasFailure(err));
    }
  }

  function* getAssessmentAllCriteriasFailure() {
    yield put(
      notifyError(yield translate('evidence_get_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* postAssessmentEvidenceAttempt({
    member_id,
    qualification_id,
    onUploadProgress,
    payload
  }) {
    try {
      // Send API calls
      const resp = yield call(
        api.postAssessmentEvidence,
        member_id,
        qualification_id,
        onUploadProgress,
        convertToFormData(payload)
      );
      console.log(resp);
      const data = yield checkResponse(resp);
      yield put(Actions.postAssessmentEvidenceSuccess(data));
    } catch (err) {
      yield put(Actions.postAssessmentEvidenceFailure(err));
    }
  }

  function* postAssessmentEvidenceFailure() {
    yield put(
      notifyError(yield translate('evidence_get_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* postAssessmentUpdateEvidenceAttempt({
    member_id,
    qualification_id,
    evidence_id,
    payload
  }) {
    try {
      // Send API calls
      const resp = yield call(
        api.postAssessmentUpdateEvidence,
        member_id,
        qualification_id,
        evidence_id,
        convertToFormData(payload)
      );
      const data = yield checkResponse(resp);
      yield put(Actions.postAssessmentUpdateEvidenceSuccess(data));
      yield put(
        Actions.getAssessmentMemberEvidencesAttempt(
          member_id,
          qualification_id,
          {}
        )
      );
    } catch (err) {
      yield put(Actions.postAssessmentUpdateEvidenceFailure(err));
    }
  }

  function* postAssessmentUpdateEvidenceFailure() {
    yield put(
      notifyError(yield translate('evidence_get_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* deleteAssessmentEvidenceAttempt({
    member_id,
    qualification_id,
    evidence_id
  }) {
    const resp = yield call(
      api.deleteAssessmentEvidence,
      member_id,
      qualification_id,
      evidence_id
    );
    yield put(Actions.deleteAssessmentEvidenceSuccess(evidence_id));
  }

  function* postAssessmentEvidenceCommentAttempt({
    member_id,
    qualification_id,
    evidence_id,
    params
  }) {
    try {
      const resp = yield call(
        api.postAssessmentEvidenceComment,
        member_id,
        qualification_id,
        evidence_id,
        params
      );
      yield checkResponse(resp);
      yield put(
        Actions.getAssessmentMemberEvidenceDetailsAttempt(
          member_id,
          qualification_id,
          evidence_id
        )
      );
      yield put(Actions.postAssessmentEvidenceCommentSuccess());
      console.log(resp);
    } catch (err) {
      console.log(err);
      yield put(Actions.postAssessmentEvidenceCommentFailure());
    }
  }

  function* getWorkbookActivitiesAttempt({
    workbooks,
    member_id,
    qualification_id,
    assessment_criteria
  }) {
    try {
      let activities = [];
      const activitiesResponses = yield workbooks.map(workbook =>
        call(api.getWorkbookActivities, workbook.unit_id, workbook.workbook_id)
      );
      console.log(activitiesResponses);
      activitiesResponses.forEach(activityData => {
        const arr = activityData.data.data.activities;
        activities = [...activities, ...arr];
      });
      const evidenceResponses = yield activities.map(activity =>
        call(
          api.postAssessmentEvidence,
          member_id,
          qualification_id,
          () => {},
          convertToFormData({
            title: activity.title,
            description: activity.description,
            assessment_criteria
          })
        )
      );

      const checkResp = evidenceResponses.map(evidenceData =>
        checkResponse(evidenceData)
      );

      yield put(
        Actions.getAssessmentMemberEvidencesAttempt(
          member_id,
          qualification_id,
          {}
        )
      );
    } catch (err) {
      console.log(err);
      yield put(Actions.getWorkbookActivitiesFailure());
    }
  }

  function* startWatchers() {
    yield takeEvery(
      Types.GET_ELEARNING_HOURS_ATTEMPT,
      getElearningHoursAttempt
    );
    yield takeEvery(
      Types.GET_ELEARNING_HOURS_FAILURE,
      getElearningHoursFailure
    );

    yield takeEvery(
      Types.GET_HOURS_MEMBER_ACTIVITY_ATTEMPT,
      getHoursMemberActivityAttempt
    );
    yield takeEvery(
      Types.GET_HOURS_MEMBER_ACTIVITY_FAILURE,
      getHoursMemberActivityFailure
    );

    yield takeEvery(
      Types.GET_HOURS_MEMBER_ACTIVITY_QUALIFICATION_ATTEMPT,
      getHoursMemberActivityQualificationAttempt
    );
    yield takeEvery(
      Types.GET_HOURS_MEMBER_ACTIVITY_QUALIFICATION_FAILURE,
      getHoursMemberActivityQualificationFailure
    );

    yield takeEvery(
      Types.GET_ASSESSMENT_GUIDANCE_ATTEMPT,
      getAssessmentGuidanceAttempt
    );
    yield takeEvery(
      Types.GET_ASSESSMENT_GUIDANCE_FAILURE,
      getAssessmentGuidanceFailure
    );

    yield takeEvery(
      Types.GET_ASSESSMENT_MEMBER_QUALIFICATION_ATTEMPT,
      getAssessmentMemberQualificationAttempt
    );
    yield takeEvery(
      Types.GET_ASSESSMENT_MEMBER_QUALIFICATION_FAILURE,
      getAssessmentMemberQualificationFailure
    );

    yield takeEvery(
      Types.GET_ASSESSMENT_MEMBER_UNIT_ATTEMPT,
      getAssessmentMemberUnitAttempt
    );
    yield takeEvery(
      Types.GET_ASSESSMENT_MEMBER_UNIT_FAILURE,
      getAssessmentMemberUnitFailure
    );

    yield takeEvery(
      Types.GET_ASSESSMENT_MEMBER_EVIDENCES_ATTEMPT,
      getAssessmentMemberEvidencesAttempt
    );
    yield takeEvery(
      Types.GET_ASSESSMENT_MEMBER_EVIDENCES_FAILURE,
      getAssessmentMemberEvidencesFailure
    );

    yield takeEvery(
      Types.GET_ASSESSMENT_MEMBER_EVIDENCE_DETAILS_ATTEMPT,
      getAssessmentMemberEvidenceDetailsAttempt
    );
    yield takeEvery(
      Types.GET_ASSESSMENT_MEMBER_EVIDENCE_DETAILS_FAILURE,
      getAssessmentMemberEvidenceDetailsFailure
    );

    yield takeEvery(
      Types.GET_ASSESSMENT_ALL_CRITERIAS_ATTEMPT,
      getAssessmentAllCriteriasAttempt
    );
    yield takeEvery(
      Types.GET_ASSESSMENT_ALL_CRITERIAS_FAILURE,
      getAssessmentAllCriteriasFailure
    );

    yield takeEvery(
      Types.POST_ASSESSMENT_EVIDENCE_ATTEMPT,
      postAssessmentEvidenceAttempt
    );
    yield takeEvery(
      Types.POST_ASSESSMENT_EVIDENCE_FAILURE,
      postAssessmentEvidenceFailure
    );

    yield takeEvery(
      Types.POST_ASSESSMENT_UPDATE_EVIDENCE_ATTEMPT,
      postAssessmentUpdateEvidenceAttempt
    );
    yield takeEvery(
      Types.POST_ASSESSMENT_UPDATE_EVIDENCE_FAILURE,
      postAssessmentUpdateEvidenceFailure
    );
    yield takeEvery(
      Types.DELETE_ASSESSMENT_EVIDENCE_ATTEMPT,
      deleteAssessmentEvidenceAttempt
    );
    yield takeEvery(
      Types.POST_ASSESSMENT_EVIDENCE_COMMENT_ATTEMPT,
      postAssessmentEvidenceCommentAttempt
    );
    yield takeEvery(
      Types.GET_WORKBOOK_ACTIVITIES_ATTEMPT,
      getWorkbookActivitiesAttempt
    );
  }

  return {
    startWatchers,
    getElearningHoursAttempt,
    getElearningHoursFailure,

    getHoursMemberActivityAttempt,
    getHoursMemberActivityFailure,

    getHoursMemberActivityQualificationAttempt,
    getHoursMemberActivityQualificationFailure,

    getAssessmentGuidanceAttempt,
    getAssessmentGuidanceFailure,

    getAssessmentMemberQualificationAttempt,
    getAssessmentMemberQualificationFailure,

    getAssessmentMemberUnitAttempt,
    getAssessmentMemberUnitFailure,

    getAssessmentMemberEvidencesAttempt,
    getAssessmentMemberEvidencesFailure,

    getAssessmentMemberEvidenceDetailsAttempt,
    getAssessmentMemberEvidenceDetailsFailure,

    getAssessmentAllCriteriasAttempt,
    getAssessmentAllCriteriasFailure,

    postAssessmentEvidenceAttempt,
    postAssessmentEvidenceFailure,

    postAssessmentUpdateEvidenceAttempt,
    postAssessmentUpdateEvidenceFailure
  };
};
