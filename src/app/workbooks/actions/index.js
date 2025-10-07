import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  toggleLearnersModal: ['flag'],

  saveWorkbookAttempt: ['formData', 'workbook', 'unitId', 'workbookId'],
  saveWorkbookSuccess: ['workbook'],
  saveWorkbookFailure: ['errorCode'],

  getWorkbooksAttempt: ['user'],
  getWorkbooksSuccess: ['workbooks'],
  getWorkbooksFailure: ['errorCode'],

  getMockWorkbooksAttempt: null,
  getMockWorkbooksSuccess: ['workbooks'],
  getMockWorkbooksFailure: ['errorCode'],

  getWorkbookAttempt: ['member_id', 'unit_id', 'workbook_id'],
  getWorkbookSuccess: ['workbook'],
  getWorkbookFailure: ['errorCode'],

  getWorkbookMemberAttempt: ['member_id', 'unit_id', 'workbook_id'],
  getWorkbookMemberSuccess: ['workbook'],
  getWorkbookMemberFailure: ['errorCode'],

  setWorkbookCurrentModeratorAttempt: [
    'unit_id',
    'workbook_id',
    'current_moderator'
  ],
  setWorkbookCurrentModeratorSuccess: ['current_moderator'],
  setWorkbookCurrentModeratorFailure: ['errorCode'],

  clearWorkbookCurrentModeratorAttempt: ['unit_id', 'workbook_id'],
  clearWorkbookCurrentModeratorSuccess: null,
  clearWorkbookCurrentModeratorFailure: ['errorCode'],

  getWorkbookActivityMemberAttempt: ['member_id', 'activity_id'],
  getWorkbookActivityAttempt: [
    'unit_id',
    'workbook_id',
    'activity_code',
    'activity_id',
    'member_id'
  ],
  getWorkbookActivitySuccess: ['data'],
  getWorkbookActivityFailure: ['errorCode'],

  submitWorkbookActivityAttempt: [
    'member_id',
    'workbook_id',
    'activity_id',
    'evidence',
    'save'
  ],
  submitWorkbookActivitySuccess: ['data'],
  submitWorkbookActivityFailure: ['errorCode'],

  submitWorkbookDecision: ['member_id', 'activity_id', 'status'],
  submitWorkbookDecisionSuccess: ['approved', 'activity_id'],
  submitWorkbookDecisionFailure: ['errorCode'],

  resetWorkbookActivity: null,

  clearWorkbook: null,
  clearWorkbookTitle: null,
  updateWorkbookTitle: ['title'],
  resetWorkbookState: null,
  setAssessWorkbooksActiveLearnerId: ['member_id'],
  setTextSize: ['size'],
  changeChapterIndex: ['chapterIndex']
});
