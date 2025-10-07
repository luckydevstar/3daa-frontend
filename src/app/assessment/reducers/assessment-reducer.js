import { LOCATION_CHANGE } from 'react-router-redux';
import Immutable from 'seamless-immutable';
import common from 'app/common';
import { createReducer } from 'reduxsauce';
import * as R from 'ramda';
import * as lodash from 'lodash';
import { path, filter, propEq, not } from 'ramda';
import extractWorkbooksFromQualification from 'app/workbooks/util/helpers';
import { Types } from '../actions';

const {
  util: {
    helpers: { organiseQualificationsAndPathways }
  }
} = common;

export const INITIAL_STATE = Immutable({
  attemptingGetElearningHours: false,
  attemptingGetHoursMemberActivity: false,
  attemptingGetHoursMemberQualificationActivity: false,
  attemptingGetAssessmentGuidance: false,
  attemptingGetAssessmentMemberQualification: false,
  attemptingGetAssessmentMemberUnit: false,
  attemptingGetAssessmentMemberEvidences: false,
  attemptingGetAssessmentMemberEvidenceDetails: false,
  attemptingGetAssessmentCriterias: false,
  attemptingPostAssessmentEvidence: false,
  attemptingPostUpdateAssessmentEvidence: false,
  attemptingDeleteAssessmentEvidence: false,
  attemptingPostAssessmentEvidenceComment: false,
  assessmentEvidenceChangeState: false,

  eLearningHours: [],
  qualificationLearningHours: null,
  assessmentGuidance: null,
  assessmentMember: null,
  assessmentMemberQualification: null,
  assessmentMemberEvidences: null,
  assessmentMemberEvidenceDetails: null,
  assessmentCriterias: [],
  assessmentActivities: [],

  errorCode: null
});

const getElearningHoursAttempt = state => {
  return state.merge({
    attemptingGetElearningHours: true,
    eLearningHours: [],
    errorCode: null
  });
};

const getElearningHoursSuccess = (state, { data }) => {
  return state.merge({
    attemptingGetElearningHours: false,
    eLearningHours: lodash.get(data, 'data')
  });
};

const getElearningHoursFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingGetElearningHours: false,
    errorCode: errorCode
  });
};

const getHoursMemberActivityAttempt = state => {
  return state.merge({
    attemptingGetHoursMemberActivity: true,
    eLearningHours: [],
    errorCode: null
  });
};

const getHoursMemberActivitySuccess = (state, { data }) => {
  console.log(data);
  return state.merge({
    attemptingGetMemberActivity: false,
    eLearningHours: lodash.get(data, 'data')
  });
};

const getHoursMemberActivityFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingGetMemberActivity: false,
    errorCode: errorCode
  });
};

const getHoursMemberActivityQualificationAttempt = state => {
  return state.merge({
    attemptingGetHoursMemberActivityQualification: true,
    qualificationLearningHours: null,
    errorCode: null
  });
};

const getHoursMemberActivityQualificationSuccess = (state, { data }) => {
  return state.merge({
    attemptingGetHoursMemberActivityQualification: false,
    qualificationLearningHours: lodash.get(data, 'data')
  });
};

const getHoursMemberActivityQualificationFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingGetHoursMemberActivityQualification: false,
    errorCode: errorCode
  });
};

const getAssessmentGuidanceAttempt = state => {
  return state.merge({
    attemptingGetAssessmentGuidance: true,
    assessmentGuidance: [],
    errorCode: null
  });
};

const getAssessmentGuidanceSuccess = (state, { data }) => {
  return state.merge({
    attemptingGetAssessmentGuidance: false,
    assessmentGuidance: lodash.get(data, 'data')
  });
};

const getAssessmentGuidanceFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingGetAssessmentGuidance: false,
    errorCode: errorCode
  });
};

const getAssessmentMemberQualificationAttempt = state => {
  return state.merge({
    attemptingGetAssessmentMemberQualification: true,
    assessmentMemberQualification: null,
    errorCode: null
  });
};

const getAssessmentMemberQualificationSuccess = (state, { data }) => {
  return state.merge({
    attemptingGetAssessmentMemberQualification: false,
    assessmentMemberQualification: lodash.get(data, 'data')
  });
};

const getAssessmentMemberQualificationFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingGetAssessmentMemberQualification: false,
    errorCode: errorCode
  });
};

const getAssessmentMemberUnitAttempt = state => {
  return state.merge({
    attemptingGetAssessmentMemberUnit: true,
    assessmentMemberUnit: null,
    errorCode: null
  });
};

const getAssessmentMemberUnitSuccess = (state, { data }) => {
  return state.merge({
    attemptingGetAssessmentMemberUnit: false,
    assessmentMemberUnit: lodash.get(data, 'data')
  });
};

const getAssessmentMemberUnitFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingGetAssessmentMemberUnit: false,
    errorCode: errorCode
  });
};

const getAssessmentMemberEvidencesAttempt = state => {
  return state.merge({
    attemptingGetAssessmentMemberEvidences: true,
    assessmentMemberEvidences: null,
    errorCode: null
  });
};

const getAssessmentMemberEvidencesSuccess = (state, { data }) => {
  return state.merge({
    attemptingGetAssessmentMemberEvidences: false,
    assessmentMemberEvidences: lodash.get(data, 'data')
  });
};

const getAssessmentMemberEvidencesFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingGetAssessmentMemberEvidences: false,
    errorCode: errorCode
  });
};

const getAssessmentMemberEvidenceDetailsAttempt = state => {
  return state.merge({
    attemptingGetAssessmentMemberEvidenceDetails: true,
    assessmentEvidenceDetails: null,
    errorCode: null
  });
};

const getAssessmentMemberEvidenceDetailsSuccess = (state, { data }) => {
  return state.merge({
    attemptingGetAssessmentMemberEvidenceDetails: false,
    assessmentEvidenceDetails: lodash.get(data, 'data')
  });
};

const getAssessmentMemberEvidenceDetailsFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingGetAssessmentMemberEvidenceDetails: false,
    errorCode: errorCode
  });
};

const getAssessmentAllCriteriasAttempt = state => {
  return state.merge({
    attemptingGetAssessmentCriterias: true,
    assessmentCriterias: [],
    errorCode: null
  });
};

const getAssessmentAllCriteriasSuccess = (state, { data }) => {
  return state.merge({
    attemptingGetAssessmentCriterias: false,
    assessmentCriterias: lodash.get(data, 'data')
  });
};

const getAssessmentAllCriteriasFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingGetAssessmentCriterias: false,
    errorCode: errorCode
  });
};

const postAssessmentEvidenceAttempt = state => {
  return state.merge({
    attemptingPostAssessmentEvidence: true,
    errorCode: null
  });
};

const postAssessmentEvidenceSuccess = (state, { data }) => {
  const assessmentMemberEvidences =
    lodash.get(state, ['assessmentMemberEvidences']) || null;
  const evidences = lodash.get(assessmentMemberEvidences, ['evidences']) || [];
  const evidence_details =
    lodash.get(data, ['data', 'evidence_details']) || null;

  return state.merge({
    attemptingPostAssessmentEvidence: false,
    assessmentEvidenceDetails: lodash.get(data, 'data'),
    assessmentMemberEvidences: {
      ...assessmentMemberEvidences,
      evidences: evidences.concat([evidence_details])
    }
  });
};

const postAssessmentEvidenceFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingPostAssessmentEvidence: false,
    errorCode: errorCode
  });
};

const postAssessmentUpdateEvidenceAttempt = state => {
  return state.merge({
    attemptingPostUpdateAssessmentEvidence: true,
    assessmentEvidenceChangeState: false,
    errorCode: null
  });
};

const postAssessmentUpdateEvidenceSuccess = (state, { data }) => {
  return state.merge({
    attemptingPostUpdateAssessmentEvidence: false,
    assessmentEvidenceDetails: lodash.get(data, 'data'),
    assessmentEvidenceChangeState: true
  });
};

const postAssessmentUpdateEvidenceFailure = (state, { errorCode }) => {
  return state.merge({
    attemptingPostUpdateAssessmentEvidence: false,
    errorCode: errorCode
  });
};

const setAssessmentMember = (state, { member }) =>
  state.merge({
    assessmentMember: member
  });

const deleteAssessmentEvidenceAttempt = state =>
  state.merge({
    attemptingDeleteAssessmentEvidence: true
  });

const deleteAssessmentEvidenceSuccess = (state, { evidence_id }) => {
  const evidences =
    path(['assessmentMemberEvidences', 'evidences'], state) || [];
  const filteredEvidences = filter(evidence =>
    not(propEq('learning_progress_evidence_id', evidence_id)(evidence))
  )(evidences);
  return state.merge({
    attemptingDeleteAssessmentEvidence: false,
    assessmentMemberEvidences: {
      ...state.assessmentMemberEvidences,
      evidences: filteredEvidences
    }
  });
};

const postAssessmentEvidenceCommentAttempt = state =>
  state.merge({
    attemptingPostAssessmentEvidenceComment: true
  });

const postAssessmentEvidenceCommentSuccess = state =>
  state.merge({
    attemptingPostAssessmentEvidenceComment: false
  });

const postAssessmentEvidenceCommentFailure = state =>
  state.merge({
    attemptingPostAssessmentEvidenceComment: false
  });

const getWorkbookActivitiesAttempt = state =>
  state.merge({
    attemptingPostUpdateAssessmentEvidence: true
  });

const getWorkbookActivitiesSuccess = (state, { activities }) =>
  state.merge({
    attemptingPostUpdateAssessmentEvidence: false,
    assessmentActivities: activities
  });

const getWorkbookActivitiesFailure = state =>
  state.merge({
    attemptingPostUpdateAssessmentEvidence: false
  });

const ACTION_HANDLERS = {
  [Types.GET_ELEARNING_HOURS_ATTEMPT]: getElearningHoursAttempt,
  [Types.GET_ELEARNING_HOURS_SUCCESS]: getElearningHoursSuccess,
  [Types.GET_ELEARNING_HOURS_FAILURE]: getElearningHoursFailure,

  [Types.GET_HOURS_MEMBER_ACTIVITY_ATTEMPT]: getHoursMemberActivityAttempt,
  [Types.GET_HOURS_MEMBER_ACTIVITY_SUCCESS]: getHoursMemberActivitySuccess,
  [Types.GET_HOURS_MEMBER_ACTIVITY_FAILURE]: getHoursMemberActivityFailure,

  [Types.GET_HOURS_MEMBER_ACTIVITY_QUALIFICATION_ATTEMPT]: getHoursMemberActivityQualificationAttempt,
  [Types.GET_HOURS_MEMBER_ACTIVITY_QUALIFICATION_SUCCESS]: getHoursMemberActivityQualificationSuccess,
  [Types.GET_HOURS_MEMBER_ACTIVITY_QUALIFICATION_FAILURE]: getHoursMemberActivityQualificationFailure,

  [Types.GET_ASSESSMENT_GUIDANCE_ATTEMPT]: getAssessmentGuidanceAttempt,
  [Types.GET_ASSESSMENT_GUIDANCE_SUCCESS]: getAssessmentGuidanceSuccess,
  [Types.GET_ASSESSMENT_GUIDANCE_FAILURE]: getAssessmentGuidanceFailure,

  [Types.GET_ASSESSMENT_MEMBER_QUALIFICATION_ATTEMPT]: getAssessmentMemberQualificationAttempt,
  [Types.GET_ASSESSMENT_MEMBER_QUALIFICATION_SUCCESS]: getAssessmentMemberQualificationSuccess,
  [Types.GET_ASSESSMENT_MEMBER_QUALIFICATION_FAILURE]: getAssessmentMemberQualificationFailure,

  [Types.GET_ASSESSMENT_MEMBER_UNIT_ATTEMPT]: getAssessmentMemberUnitAttempt,
  [Types.GET_ASSESSMENT_MEMBER_UNIT_SUCCESS]: getAssessmentMemberUnitSuccess,
  [Types.GET_ASSESSMENT_MEMBER_UNIT_FAILURE]: getAssessmentMemberUnitFailure,

  [Types.GET_ASSESSMENT_MEMBER_EVIDENCES_ATTEMPT]: getAssessmentMemberEvidencesAttempt,
  [Types.GET_ASSESSMENT_MEMBER_EVIDENCES_SUCCESS]: getAssessmentMemberEvidencesSuccess,
  [Types.GET_ASSESSMENT_MEMBER_EVIDENCES_FAILURE]: getAssessmentMemberEvidencesFailure,

  [Types.GET_ASSESSMENT_MEMBER_EVIDENCE_DETAILS_ATTEMPT]: getAssessmentMemberEvidenceDetailsAttempt,
  [Types.GET_ASSESSMENT_MEMBER_EVIDENCE_DETAILS_SUCCESS]: getAssessmentMemberEvidenceDetailsSuccess,
  [Types.GET_ASSESSMENT_MEMBER_EVIDENCE_DETAILS_FAILURE]: getAssessmentMemberEvidenceDetailsFailure,

  [Types.GET_ASSESSMENT_ALL_CRITERIAS_ATTEMPT]: getAssessmentAllCriteriasAttempt,
  [Types.GET_ASSESSMENT_ALL_CRITERIAS_SUCCESS]: getAssessmentAllCriteriasSuccess,
  [Types.GET_ASSESSMENT_ALL_CRITERIAS_FAILURE]: getAssessmentAllCriteriasFailure,

  [Types.POST_ASSESSMENT_EVIDENCE_ATTEMPT]: postAssessmentEvidenceAttempt,
  [Types.POST_ASSESSMENT_EVIDENCE_SUCCESS]: postAssessmentEvidenceSuccess,
  [Types.POST_ASSESSMENT_EVIDENCE_FAILURE]: postAssessmentEvidenceFailure,

  [Types.POST_ASSESSMENT_UPDATE_EVIDENCE_ATTEMPT]: postAssessmentUpdateEvidenceAttempt,
  [Types.POST_ASSESSMENT_UPDATE_EVIDENCE_SUCCESS]: postAssessmentUpdateEvidenceSuccess,
  [Types.POST_ASSESSMENT_UPDATE_EVIDENCE_FAILURE]: postAssessmentUpdateEvidenceFailure,

  [Types.SET_ASSESSMENT_MEMBER]: setAssessmentMember,

  [Types.DELETE_ASSESSMENT_EVIDENCE_ATTEMPT]: deleteAssessmentEvidenceAttempt,
  [Types.DELETE_ASSESSMENT_EVIDENCE_SUCCESS]: deleteAssessmentEvidenceSuccess,

  [Types.POST_ASSESSMENT_EVIDENCE_COMMENT_ATTEMPT]: postAssessmentEvidenceCommentAttempt,
  [Types.POST_ASSESSMENT_EVIDENCE_COMMENT_SUCCESS]: postAssessmentEvidenceCommentSuccess,
  [Types.POST_ASSESSMENT_EVIDENCE_COMMENT_FAILURE]: postAssessmentEvidenceCommentFailure,

  [Types.GET_WORKBOOK_ACTIVITIES_ATTEMPT]: getWorkbookActivitiesAttempt,
  [Types.GET_WORKBOOK_ACTIVITIES_SUCCESS]: getWorkbookActivitiesSuccess,
  [Types.GET_WORKBOOK_ACTIVITIES_FAILURE]: getWorkbookActivitiesFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
