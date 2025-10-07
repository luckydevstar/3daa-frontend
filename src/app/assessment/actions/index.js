import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  // Sector qualifications
  getSectorQualificationsAttempt: ['sectorId'],

  getHoursMemberActivityAttempt: ['member_id'],
  getHoursMemberActivitySuccess: ['data'],
  getHoursMemberActivityFailure: ['errorCode'],

  getHoursMemberActivityQualificationAttempt: ['member_id', 'qualification_id'],
  getHoursMemberActivityQualificationSuccess: ['data'],
  getHoursMemberActivityQualificationFailure: ['errorCode'],

  getElearningHoursAttempt: ['centre_id', 'parmas'],
  getElearningHoursSuccess: ['data'],
  getElearningHoursFailure: ['errorCode'],

  getAssessmentGuidanceAttempt: ['parmas'],
  getAssessmentGuidanceSuccess: ['data'],
  getAssessmentGuidanceFailure: ['errorCode'],

  getAssessmentMemberQualificationAttempt: [
    'member_id',
    'qualification_id',
    'parmas'
  ],
  getAssessmentMemberQualificationSuccess: ['data'],
  getAssessmentMemberQualificationFailure: ['errorCode'],

  getAssessmentMemberUnitAttempt: ['member_id', 'qualification_id', 'unit_id'],
  getAssessmentMemberUnitSuccess: ['data'],
  getAssessmentMemberUnitFailure: ['errorCode'],

  setAssessmentMember: ['member'],

  getAssessmentMemberEvidencesAttempt: [
    'member_id',
    'qualification_id',
    'parmas'
  ],
  getAssessmentMemberEvidencesSuccess: ['data'],
  getAssessmentMemberEvidencesFailure: ['errorCode'],

  getAssessmentMemberEvidenceDetailsAttempt: [
    'member_id',
    'qualification_id',
    'evidence_id'
  ],
  getAssessmentMemberEvidenceDetailsSuccess: ['data'],
  getAssessmentMemberEvidenceDetailsFailure: ['errorCode'],

  getAssessmentAllCriteriasAttempt: ['member_id', 'qualification_id'],
  getAssessmentAllCriteriasSuccess: ['data'],
  getAssessmentAllCriteriasFailure: ['errorCode'],

  postAssessmentEvidenceAttempt: [
    'member_id',
    'qualification_id',
    'onUploadProgress',
    'payload'
  ],
  postAssessmentEvidenceSuccess: ['data'],
  postAssessmentEvidenceFailure: ['errorCode'],

  postAssessmentUpdateEvidenceAttempt: [
    'member_id',
    'qualification_id',
    'evidence_id',
    'payload'
  ],
  postAssessmentUpdateEvidenceSuccess: ['data'],
  postAssessmentUpdateEvidenceFailure: ['errorCode'],

  deleteAssessmentEvidenceAttempt: [
    'member_id',
    'qualification_id',
    'evidence_id'
  ],
  deleteAssessmentEvidenceSuccess: ['evidence_id'],
  deleteAssessmentEvidenceFailure: ['errorCode'],

  getAssessmentMediaCommentsAttempt: ['media_id'],
  getAssessmentMediaCommentsSuccess: ['comments'],
  getAssessmentMediaCommentsFailure: ['errorCode'],

  postAssessmentMediaCommentAttempt: ['media_id', 'params'],
  postAssessmentMediaCommentSuccess: [],
  postAssessmentMediaCommentFailure: ['errorCode'],

  postAssessmentEvidenceCommentAttempt: [
    'member_id',
    'qualification_id',
    'evidence_id',
    'params'
  ],
  postAssessmentEvidenceCommentSuccess: [],
  postAssessmentEvidenceCommentFailure: [],

  getWorkbookActivitiesAttempt: [
    'workbooks',
    'member_id',
    'qualification_id',
    'assessment_criteria'
  ],
  getWorkbookActivitiesSuccess: ['activities'],
  getWorkbookActivitiesFailure: ['errorCode'],

  addActivitiesToEvidences: []
});
