import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  uploadMediaCloudinaryAttempt: ['file'],
  uploadMediaCloudinarySuccess: ['cloudinary_id'],
  uploadMediaCloudinaryFailure: ['errorCode'],

  getQualificationTypesAttempt: ['id'],
  getQualificationTypesSuccess: ['response'],
  getQualificationTypesFailure: ['errorCode'],

  getQualificationAttempt: ['qualification_id'],
  getQualificationSuccess: ['qualification'],
  getQualificationFailure: ['errorCode'],

  getAllQualificationsAttempt: null,
  getAllQualificationsSuccess: ['qualifications'],
  getAllQualificationsFailure: ['errorCode'],

  getMemberQualificationsAttempt: ['member_id'],
  getMemberQualificationsSuccess: ['qualifications'],
  getMemberQualificationsFailure: ['errorCode'],

  createQualificationAttempt: ['payload'],
  createQualificationSuccess: ['response'],
  createQualificationFailure: ['errorCode'],

  updateQualificationAttempt: ['payload', 'id'],
  updateQualificationSuccess: ['response'],
  updateQualificationFailure: ['errorCode'],

  deleteQualificationAttempt: ['qualification_id'],
  deleteQualificationSuccess: ['qualification_id'],
  deleteQualificationFailure: ['errorCode'],

  getCentreQualificationsAttempt: ['centre_id'],
  getCentreQualificationsSuccess: ['qualifications'],
  getCentreQualificationsFailure: ['errorCode'],
  getCentreQualificationAttempt: ['centre_id', 'qualification_id'],
  getCentreQualificationSuccess: ['qualification'],
  getCentreQualificationFailure: ['errorCode'],
  resetMemberQualifications: null,
  postQualificationMappingAttempt: ['centre_id', 'qualification_id', 'params'],
  postQualificationMappingSuccess: ['qualification'],
  postQualificationMappingFailure: ['errorCode'],
  postQualificationToGroupsMappingAttempt: [
    'centre_id',
    'qualification_id',
    'groups'
  ],
  postQualificationToGroupsMappingSuccess: ['qualification'],
  postQualificationToGroupsMappingFailure: ['errorCode'],
  postQualificationPathwayAttempt: ['centre_id', 'qualification_id', 'payload'],
  postQualificationPathwaySuccess: ['qualification'],
  postQualificationPathwayFailure: ['errorCode'],

  clearCurrentQualification: null,
  copyCurrentQualification: null,
  setCurrentQualificationDetails: ['currentQualificationDetails'],
  resetCurrentQualificationDetails: null,
  setQualificationEditMode: ['mode'], // 1: read: 2: edit, 3: delete

  setQualificationsActiveLevel: ['level'],
  setWorkbooksSearchQuery: ['query'],
  incrementGroupCount: null,

  setCurrentQualificationCategory: ['category_id'],
  setCurrentQualification: ['qualification'],
  setCurrentLearningUnit: ['unit'],
  setCurrentLearingWorkbook: ['workbook'],

  getQualificationUnitTypesAttempt: ['params'],
  getQualificationUnitTypesSuccess: ['response'],
  getQualificationUnitTypesFailure: ['errorCode'],

  getQualificationUnitAttempt: ['id'],
  getQualificationUnitSuccess: ['response'],
  getQualificationUnitFailure: ['errorCode'],

  createQualificationUnitAttempt: ['unit'],
  createQualificationUnitSuccess: ['response'],
  createQualificationUnitFailure: ['errorCode'],

  updateQualificationUnitAttempt: ['unit', 'id'],
  updateQualificationUnitSuccess: ['response'],
  updateQualificationUnitFailure: ['errorCode'],

  deleteQualificationUnitAttempt: ['id', 'params'],
  deleteQualificationUnitSuccess: ['response', 'params'],
  deleteQualificationUnitFailure: ['errorCode'],

  getLearningUnitsAttempt: ['params'],
  getLearningUnitsSuccess: ['response'],
  getLearningUnitsFailure: ['errorCode'],

  getLearningUnitAttempt: ['qualification_id', 'unit_id'],
  getLearningUnitSuccess: ['response'],
  getLearningUnitFailure: ['errorCode'],

  createLearningUnitAttempt: ['unit'],
  createLearningUnitSuccess: ['response'],
  createLearningUnitFailure: ['errorCode'],

  updateLearningUnitAttempt: ['unit', 'id'],
  updateLearningUnitSuccess: ['response'],
  updateLearningUnitFailure: ['errorCode'],

  deleteLearningUnitAttempt: ['id'],
  deleteLearningUnitSuccess: ['id'],
  deleteLearningUnitFailure: ['errorCode'],

  changeLearningUnitStatusAttempt: ['status', 'id'],
  changeLearningUnitStatusSuccess: ['status', 'id'],
  changeLearningUnitStatusFailure: ['errorCode'],

  unitFilterChanged: ['newFilter'],

  addQualificationStoreAttempt: ['payload', 'qualification_id'],
  addQualificationStoreSuccess: ['response'],
  addQualificationStoreFailure: ['errorCode'],

  deleteQualificationFromStoreAttempt: ['id', 'params'],
  deleteQualificationFromStoreSuccess: ['response', 'params'],
  deleteQualificationFromStoreFailure: ['errorCode'],

  getMockWorkbooksAttempt: ['user'],
  getMockWorkbooksSuccess: ['workbooks'],
  getMockWorkbooksFailure: ['errorCode'],

  // Provide object literal and FormData object to createWorkbookAttempt because we can't put a FormData object in the store
  createWorkbookAttempt: ['formData', 'workbook', 'unit_id', 'sector_id'],
  createWorkbookSuccess: ['workbook'],
  createWorkbookFailure: ['error'],

  getWorkbookAttempt: ['unit_id', 'workbook_id'],
  getWorkbookSuccess: ['workbook'],
  getWorkbookFailure: ['err'],

  deleteWorkbookFromUnitAttempt: ['unit_id', 'workbook_id', 'sector_title'],
  deleteWorkbookFromUnitSuccess: ['unit_id', 'workbook_id'],
  deleteWorkbookFromUnitFailure: ['err'],

  getWorkbookEditorContent: null,

  toggleOutcomesTray: null,

  getActivityTypesAttempt: null,
  getActivityTypesSuccess: ['activityTypes'],
  getActivityTypesFailure: ['errorCode'],

  editorUpdateEntity: ['blockKey', 'newData'],
  editorUpdateEntityQueueClear: null,

  getWorkbookMediaAttempt: ['params'],
  getWorkbookMediaSuccess: ['response'],
  getWorkbookMediaFailure: ['errorCode'],

  postWorkbookMediaAttempt: ['payload'],
  postWorkbookMediaSuccess: ['response'],
  postWorkbookMediaFailure: ['errorCode'],

  deleteWorkbookMediaAttempt: ['media_id'],
  deleteWorkbookMediaSuccess: ['response'],
  deleteWorkbookMediaFailure: ['errorCode'],

  getActivityAttempt: ['activityId'],
  getActivitySuccess: ['activity'],
  getActivityFailure: ['errorCode'],

  updateActivityAttempt: ['activityObject', 'formData', 'activity_id'],
  updateActivitySuccess: ['updatedActivity'],
  updateActivityFailure: ['errorCode'],

  createActivityAttempt: ['activityObject', 'formData'],
  createActivitySuccess: ['activity'],
  createActivityFailure: ['errorCode'],

  mapToLearningOutcome: ['activityId'],
  clearCachedWorkbook: [],
  clearMappedActivity: null,
  clearLoadedActivity: null,

  onEditorChange: ['workbook'],

  recordLastSavedState: ['content'],

  unitFilterChanged: ['newFilter'],

  getLearingHoursAttempt: ['params'],
  getLearingHoursSuccess: ['data'],
  getLearingHoursFailure: ['error']
});
