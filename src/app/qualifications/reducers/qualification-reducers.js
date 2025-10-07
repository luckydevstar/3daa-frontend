import { LOCATION_CHANGE } from 'react-router-redux';
import Immutable from 'seamless-immutable';
import common from 'app/common';
import { createReducer } from 'reduxsauce';
import * as R from 'ramda';
import * as lodash from 'lodash';
import { append, omit, pipe, assoc, clone, concat, uniqBy, prop } from 'ramda';
import extractWorkbooksFromQualification from 'app/workbooks/util/helpers';
import { Types } from '../actions';

const {
  util: {
    helpers: { organiseQualificationsAndPathways }
  }
} = common;

// Add item to existing array and remove duplicates
const addList = (arr, field_name) => {
  return pipe(
    concat(arr ? arr : []),
    uniqBy(prop(field_name))
  );
};

export const INITIAL_STATE = Immutable({
  qualificationTypes: null,
  editedQualification: null,
  currentQualification: {
    qualification: null,
    units: []
  },
  currentQualificationDetails: {
    // [current, total]
    credits: [0, 0],
    mandatory: [0, 0],
    optional: [0, 0],
    selectedWorkbooks: [],
    specification: null,
    activePathway: null
  },

  currentLearningUnit: null,
  currentLearningWorkbook: null,

  activeLevel: 0, // 0 -> All Levels
  currentQualificationCategoryId: 3, // for editing
  qualificationEditMode: 1, // 1: read, 2: edit, 3: delete
  searchQuery: '',
  memberQualifications: null,
  centreQualifications: null,
  learningUnits: null,

  creatingWorkbook: false,
  workbookExists: false,
  showOutcomesTray: true,
  attemptingGetActivity: false,
  attemptingCreateActivity: false,
  attemptingUpdateActivity: false,
  attemptingGetActivityTypes: true,
  loadedActivity: null,
  cachedWorkbook: null,
  activityType: '',
  activityTypes: [],
  entityUpdateQueue: [],
  media: {
    images: null,
    videos: null,
    recentlyUploaded: null,
    attemptingGetWorkbookMedia: false,
    attemptingPostWorkbookMedia: false,
    attemptingDeleteWorkbookMedia: false,
    errorCode: null,
    total: 0
  },
  // Assign activity data here while API call in progress so we can assign an ID if successfully created
  pendingActivity: {},
  editorLoaded: false,
  lastSavedState: null,
  selectedActivity: {},

  attemptingGetAllQualifications: false,
  attemptingGetQualifications: false,
  attemptingGetQualification: false,
  attemptingGetQualificationTypes: false,

  attemptingPostQualification: false,
  attemptingPostQualificationPathway: false,
  attemptingToDeleteQualification: false,
  attemptingtoPostGroupsMapping: false,
  attemptingMapQualification: false,

  attemptingGetLearningUnits: false,
  attemptingGetLearningUnit: false,
  attemptingCreateLearningUnit: false,
  attemptingUpdateLearningUnit: false,
  attemptingDeleteLearningUnit: false,

  attemptingAddQualificationStore: false,
  createdPathwayId: null,
  errorCode: null,
  learingHours: null
});

// GET qualifications
const getQualificationTypesAttempt = state =>
  state.merge({
    attemptingGetQualificationTypes: true,
    errorCode: null,
    qualificationTypes: null
  });

const getQualificationTypesSuccess = (state, action) =>
  state.merge({
    attemptingGetQualificationTypes: false,
    errorCode: null,
    qualificationTypes: action.response.data
  });

const getQualificationTypesFailure = (state, action) =>
  state.merge({
    attemptingGetQualificationTypes: false,
    errorCode: action.errorCode
  });

// SINGLE qualification
const getQualificationAttempt = state => {
  return state.merge({
    attemptingGetQualification: true,
    currentQualification: null,
    currentQualificationUnit: null,
    currentQualificationWorkbook: null,
    errorCode: null
  });
};

const getQualificationSuccess = (state, action) => {
  // const unitKeys = ['guided_learning_hours', 'credit_value', 'specification'];
  // const hasWorkbooks = unit =>
  //   R.pipe(
  //     R.prop('workbooks'),
  //     R.length
  //   )(unit);
  // const extractWorkbooks = unit =>
  //   R.pipe(
  //     R.prop('workbooks'),
  //     R.map(R.merge(R.pickAll(unitKeys, unit)))
  //   )(unit);
  // const currentWorkbooks = R.pipe(
  //   R.prop('units'),
  //   R.filter(hasWorkbooks),
  //   R.ifElse(
  //     R.length,
  //     R.pipe(
  //       R.map(extractWorkbooks),
  //       R.flatten
  //     ),
  //     R.identity
  //   )
  // )(action.qualification);
  // const qualLens = R.lensProp('qualification');
  // const currentQualification = R.pipe(
  //   R.over(qualLens, R.assoc('workbooks', currentWorkbooks)),
  //   R.omit('units'),
  //   R.prop('qualification'),
  //   R.assoc('units', action.qualification.units)
  // )(action.qualification);
  return state.merge({
    attemptingGetQualification: false,
    currentQualification: action.qualification,
    currentQualificationCategoryId: action.qualification
      ? action.qualification.qualification.qualification_category_id
      : 2
  });
};

const getQualificationFailure = (state, action) =>
  state.merge({
    attemptingGetQualification: false,
    currentQualification: {},
    errorCode: action.errorCode
  });

// ALL qualification(s)
const getAllQualificationsAttempt = state =>
  state.merge({
    attemptingGetQualifications: true,
    centreQualifications: null,
    errorCode: null
  });

const getAllQualificationsSuccess = (state, { qualifications }) => {
  const newQualifications = qualifications.map(qualification =>
    Object.assign(
      {},
      omit('latest_issue', qualification),
      qualification.latest_issue
    )
  );
  return state.merge({
    attemptingGetQualifications: false,
    centreQualifications: newQualifications
  });
};

const getAllQualificationsFailure = (state, action) =>
  state.merge({
    attemptingGetQualifications: false,
    centreQualifications: [],
    errorCode: action.errorCode
  });

// MEMBER qualification(s)
const getMemberQualificationsAttempt = state =>
  state.merge({
    attemptingGetQualifications: true,
    memberQualifications: null,
    errorCode: null
  });

const getMemberQualificationsSuccess = (state, action) =>
  state.merge({
    attemptingGetQualifications: false,
    memberQualifications: action.qualifications
  });

const getMemberQualificationsFailure = (state, action) =>
  state.merge({
    attemptingGetMemberQualifications: false,
    memberQualifications: [],
    errorCode: action.errorCode
  });

// CENTRE qualification
const getCentreQualificationAttempt = state => {
  return state.merge({
    attemptingGetQualification: true,
    errorCode: null
  });
};

const getCentreQualificationSuccess = (state, action) => {
  const extractedWorkbooks = extractWorkbooksFromQualification(
    action.qualification
  );
  return state.merge({
    attemptingGetQualification: false,
    currentQualification: pipe(
      assoc('workbooks', extractedWorkbooks),
      omit('units')
    )(action.qualification)
  });
};

const getCentreQualificationFailure = (state, action) =>
  state.merge({
    attemptingGetQualification: false,
    errorCode: action.errorCode,
    currentQualification: {}
  });

// CENTRE qualification(s)
const getCentreQualificationsAttempt = state =>
  state.merge({
    attemptingGetQualifications: true,
    centreQualifications: null,
    errorCode: null
  });

const getCentreQualificationsSuccess = (state, action) => {
  const { qualifications } = action;
  const centreQualifications = organiseQualificationsAndPathways(
    qualifications
  );
  return state.merge({
    attemptingGetQualifications: false,
    centreQualifications
  });
};
const getCentreQualificationsFailure = (state, action) =>
  state.merge({
    attemptingGetQualifications: false,
    errorCode: action.errorCode,
    centreQualifications: []
  });

const createQualificationAttempt = state =>
  state.merge({ attemptingPostQualification: true, errorCode: null });

const createQualificationSuccess = (state, action) => {
  // const newQualifications = qualifications.map(qualification =>
  //   Object.assign(
  //     {},
  //     omit('latest_issue', qualification),
  //     qualification.latest_issue
  //   )
  // );
  // return state.merge({
  //   attemptingGetQualifications: false,

  // });
  //let newQualifications = [...state.centreQualifications, action.response.data];

  const newCentreQualifications = [
    ...state.centreQualifications,
    action.response.data.qualification
  ];

  return state.merge({
    attemptingPostQualification: false,
    errorCode: null,
    currentQualification: {
      qualification: action.response.data.qualification,
      units: []
    },
    editedQualification: action.response.data,
    centreQualifications: newCentreQualifications
  });
};

const createQualificationFailure = (state, action) =>
  state.merge({
    attemptingPostQualification: false,
    errorCode: action.errorCode
  });

const updateQualificationAttempt = state =>
  state.merge({ attemptingPostQualification: true, errorCode: null });

const updateQualificationSuccess = (state, action) => {
  let temp = clone(state.centreQualifications);
  if (temp) {
    const index = temp.findIndex(
      q =>
        q.qualification_id ==
        action.response.data.qualification.qualification_id
    );
    temp.splice(index, 1, action.response.data.qualification);
  }

  return state.merge({
    attemptingPostQualification: false,
    centreQualifications: temp,
    currentQualification: action.response.data
  });
};

const updateQualificationFailure = (state, action) =>
  state.merge({
    attemptingPostQualification: false,
    errorCode: action.errorCode
  });

const deleteQualificationAttempt = state =>
  state.merge({
    attemptingToDeleteQualification: true,
    errorCode: false
  });

const deleteQualificationSuccess = (state, action) => {
  const { qualification_id } = action;
  let centreQualifications = [];
  if (state.centreQualifications) {
    centreQualifications = state.centreQualifications.filter(
      q => q.qualification_id !== qualification_id
    );
  }
  // const pathwaysLens = R.lensProp('pathways');
  // const centreQualifications = R.map(
  //   R.over(pathwaysLens, R.filter(filterPathways))
  // )(state.centreQualifications);
  // const memberQualifications = R.map(
  //   R.over(pathwaysLens, R.filter(filterPathways))
  // )(state.memberQualifications);
  let currentQualification = state.currentQualification;
  let currentQualificationUnits = state.currentQualificationUnits;

  if (
    currentQualification &&
    currentQualification.qualification.qualification_id === qualification_id
  ) {
    currentQualification = null;
    currentQualificationUnits = [];
  }

  return state.merge({
    attemptingToDeleteQualification: false,
    centreQualifications: centreQualifications,
    currentQualification,
    currentQualificationUnits
  });
};

const deleteQualificationFailure = (state, action) =>
  state.merge({
    attemptingToDeleteQualification: false,
    errorCode: action.errorCode
  });

const setQualificationEditMode = (state, action) =>
  state.merge({
    qualificationEditMode: action.mode
  });

const postQualificationToGroupsMappingAttempt = state =>
  state.merge({
    errorCode: false,
    attemptingtoPostGroupsMapping: true
  });

const postQualificationToGroupsMappingSuccess = (state, action) => {
  // debugger;
  return state.merge({
    errorCode: false,
    attemptingtoPostGroupsMapping: false
  });
};

const postQualificationToGroupsMappingFailure = (state, { errorCode }) =>
  state.merge({
    errorCode,
    attemptingtoPostGroupsMapping: false
  });

const resetMemberQualifications = state =>
  state.merge({ memberQualifications: INITIAL_STATE.memberQualifications });

const postQualificationMappingAttempt = state =>
  state.merge({ attemptingMapQualification: true, errorCode: null });

const postQualificationMappingSuccess = (state, action) => {
  const extractedWorkbooks = extractWorkbooksFromQualification(
    action.qualification
  );
  const { qualification_id, pathway } = action.qualification;
  const { centreQualifications } = state;
  const qualificationIdProp = R.propEq('qualification_id', qualification_id);
  const editedQualificationIndex = R.findIndex(
    R.pipe(
      R.prop('pathways'),
      R.any(qualificationIdProp)
    )
  )(centreQualifications);
  const edtiedPathwayIndex = R.pipe(
    R.nth(editedQualificationIndex),
    R.prop('pathways'),
    R.findIndex(qualificationIdProp)
  )(centreQualifications);
  const editedPathwayLens = R.lensPath([
    editedQualificationIndex,
    'pathways',
    edtiedPathwayIndex
  ]);
  console.log('posting');
  return state.merge({
    attemptingMapQualification: false,
    currentQualification: pipe(
      assoc('workbooks', extractedWorkbooks),
      omit('units')
    )(action.qualification),
    centreQualifications: R.over(
      editedPathwayLens,
      R.assoc('pathway', pathway)
    )(centreQualifications)
  });
};

const postQualificationMappingFailure = (state, action) =>
  state.merge({
    attemptingMapQualification: false,
    errorCode: action.errorCode
  });

const postQualificationPathwayAttempt = state =>
  state.merge({
    attemptingPostQualificationPathway: true,
    errorCode: false
  });

const postQualificationPathwaySuccess = (state, action) => {
  const qualificationIndex = R.findIndex(
    R.propEq('reference', action.qualification.reference),
    state.centreQualifications
  );
  const centreQualifications = R.over(
    R.lensPath([qualificationIndex, 'pathways']),
    append(action.qualification)
  )(state.centreQualifications);
  return state.merge({
    attemptingPostQualificationPathway: false,
    centreQualifications,
    createdPathwayId: action.qualification.qualification_id
  });
};

const postQualificationPathwayFailure = (state, action) =>
  state.merge({
    attemptingPostQualificationPathway: false,
    errorCode: action.errorCode
  });

const clearCurrentQualification = state => {
  return state.merge({
    currentQualification: INITIAL_STATE.currentQualification,
    currentQualificationDetails: INITIAL_STATE.currentQualificationDetails
  });
};

const copyCurrentQualification = state => {
  let newQualification = clone(state.currentQualification);
  delete newQualification.qualification.qualification_id;
  return state.merge({
    currentQualification: newQualification
  });
};

const setCurrentQualification = (state, action) => {
  return state.merge({
    currentQualification: action.qualification
  });
};

const setCurrentLearningUnit = (state, action) => {
  return state.merge({
    currentLearningUnit: action.unit
  });
};

const setCurrentLearningWorkbook = (state, action) => {
  return state.merge({
    currentLearningWorkbook: action.workbook
  });
};

const setCurrentQualificationDetails = (
  state,
  { currentQualificationDetails }
) =>
  state.merge({
    currentQualificationDetails
  });

const resetCurrentQualificationDetails = state =>
  state.merge({
    currentQualificationDetails: INITIAL_STATE.currentQualificationDetails
  });

const incrementGroupCount = state =>
  state.merge({
    currentQualification: R.over(R.lensProp('groups'), R.inc)(
      state.currentQualification
    )
  });

const setQualificationsActiveLevel = (state, { level }) =>
  Immutable.set(state, 'activeLevel', level);

const setWorkbooksSearchQuery = (state, { query }) =>
  Immutable.set(state, 'searchQuery', query);

const resetQualifications = (state, action) => {
  const path = R.path(['payload', 'pathname'])(action);

  const isQualificationsManagerPath = R.indexOf(
    '/workbooks/qualification-manager',
    path
  );
  const isWorkbookPreviewPath = R.indexOf('/workbooks/preview', path);

  if (isQualificationsManagerPath === -1 && isWorkbookPreviewPath === -1) {
    return state.merge({
      // currentQualification: INITIAL_STATE.currentQualification,
      // currentQualificationDetails: INITIAL_STATE.currentQualificationDetails,
      activeLevel: INITIAL_STATE.activeLevel,
      searchQuery: INITIAL_STATE.searchQuery
    });
  }

  return state;
};

const setCurrentQualificationCategory = (state, action) => {
  return state.merge({
    currentQualificationCategoryId: action.category_id
  });
};

const addQualificationStoreAttempt = state => {
  return state.merge({
    attemptingAddQualificationStore: true,
    errorCode: null
  });
};

const addQualificationStoreSuccess = (state, action) => {
  return state.merge({
    attemptingAddQualificationStore: false
  });
};

const addQualificationStoreFailure = (state, action) => {
  return state.merge({
    attemptingAddQualificationStore: false,
    errorCode: action.errorCode
  });
};

const deleteQualificationStoreAttempt = state =>
  state.merge({ attemptingDeleteQualificationStore: true, errorCode: null });

const deleteQualificationStoreSuccess = (state, action) =>
  state.merge({
    attemptingDeleteQualificationStore: false,
    errorCode: null
  });

const deleteQualificationStoreFailure = (state, action) =>
  state.merge({
    attemptingDeleteQualificationStore: false,
    errorCode: action.errorCode
  });

const getLearningUnitsAttempt = state =>
  state.merge({
    attemptingGetLearningUnits: true,
    learningUnits: null,
    errorCode: null
  });

const getLearningUnitsSuccess = (state, action) => {
  return state.merge({
    attemptingGetLearningUnits: false,
    learningUnits: action.response.data
  });
};

const getLearningUnitsFailure = (state, action) => {
  return state.merge({
    attemptingGetLearningUnits: false,
    errorCode: action.errorCode
  });
};

const getLearningUnitAttempt = state =>
  state.merge({
    attemptingGetLearningUnit: true,
    currentLearningUnit: null,
    errorCode: null
  });

const getLearningUnitSuccess = (state, action) => {
  const unit =
    action.response.data.units && action.response.data.units.length > 0
      ? action.response.data.units[0]
      : null;
  return state.merge({
    attemptingGetLearningUnit: false,
    currentLearningUnit: unit
  });
};

const getLearningUnitFailure = (state, action) => {
  return state.merge({
    attemptingGetLearningUnit: false,
    errorCode: action.errorCode
  });
};

const createLearningUnitAttempt = state =>
  state.merge({
    attemptingCreateLearningUnit: true,
    errorCode: null
  });

const createLearningUnitSuccess = (state, action) => {
  let temp = clone(state.currentQualification);
  const unit = action.response.data;
  temp.units = [...temp.units, unit];

  return state.merge({
    attemptingCreateLearningUnit: false,
    currentQualification: temp,
    currentLearningUnit: unit
  });
};

const createLearningUnitFailure = (state, action) => {
  return state.merge({
    attemptingCreateLearningUnit: false,
    errorCode: action.errorCode
  });
};

const updateLearningUnitAttempt = state =>
  state.merge({
    attemptingUpdateLearningUnit: true,
    errorCode: null
  });

const updateLearningUnitSuccess = (state, action) => {
  let temp = clone(state.currentQualification);
  const unit = action.response.data;
  const index = temp.units.findIndex(u => u.unit_id == unit.unit_id);
  temp.units.splice(index, 1, unit);

  return state.merge({
    attemptingUpdateLearningUnit: false,
    currentQualification: temp,
    currentLearningUnit: unit
  });
};

const updateLearningUnitFailure = (state, action) => {
  console.log('update Learning Unit Failure', action);
  return state.merge({
    attemptingUpdateLearningUnit: false,
    errorCode: action.errorCode
  });
};

const deleteLearningUnitAttempt = state =>
  state.merge({
    attemptingDeleteLearningUnit: true,
    errorCode: null
  });

const deleteLearningUnitSuccess = (state, action) => {
  let temp = clone(state.currentQualification);
  let unit = state.currentLearningUnit;

  temp.units = temp.units.filter(u => u.unit_id != action.id);
  if (unit && unit.unit_id == action.unit_id) {
    unit = null;
  }

  return state.merge({
    attemptingDeleteLearningUnit: false,
    currentQualification: temp,
    currentLearningUnit: unit
  });
};

const deleteLearningUnitFailure = (state, action) => {
  return state.merge({
    attemptingDeleteLearningUnit: false,
    errorCode: action.errorCode
  });
};

const changeLearningUnitStatusAttempt = state =>
  state.merge({
    attemptingUpdateLearningUnit: true,
    errorCode: null
  });

const changeLearningUnitStatusSuccess = (state, action) => {
  console.log(action);
  let temp = clone(state.currentQualification);
  const index = temp.units.findIndex(u => u.unit_id == action.id);
  if (index >= 0) temp.units[index].status = action.status;

  return state.merge({
    attemptingUpdateLearningUnit: false,
    currentQualification: temp
  });
};

const changeLearningUnitStatusFailure = (state, action) => {
  console.log('update Learning Unit Failure', action);
  return state.merge({
    attemptingUpdateLearningUnit: false,
    errorCode: action.errorCode
  });
};

/**
 * Apply received workbook into the store
 */
const getWorkbookEditorContent = state => state.workbook;

/**
 * Creating workbook reducers
 */
const createWorkbookAttempt = state =>
  state.merge({
    creatingWorkbook: true,
    workbookExists: false,
    workbooks: [],
    pageIndex: 0
  });

const createWorkbookSuccess = (state, action) => {
  let qualification = state.currentQualification;
  if (qualification && qualification.units) {
    let unit = qualification.units.find(
      u => u.unit_id == action.workbook.unit_id
    );
    if (unit) {
      unit.workbooks = addList(unit.workbooks, 'workbook_id')([
        action.workbook
      ]);
    }
  }
  return state.merge({
    creatingWorkbook: false,
    workbookExists: true,
    workbook: action.workbook,
    currentQualification: qualification,
    lastCreatedWorkbookId: action.workbook.workbook_id
  });
};

const createWorkbookFailure = state =>
  state.merge({
    creatingWorkbook: false,
    workbookExists: false,
    workbooks: []
  });

/**
 * Toggle outcomes sidebar
 */
const toggleOutcomesTray = state =>
  state.merge({ showOutcomesTray: !state.showOutcomesTray });

/**
 * Apply received activity types to the store
 */

const getActivityTypesAttempt = state =>
  state.merge({ attemptingGetActivityTypes: true, activityTypes: [] });

const getActivityTypesSuccess = (state, action) =>
  state.merge({
    attemptingGetActivityTypes: false,
    activityTypes: action.activityTypes
  });

const getActivityTypesFailure = state =>
  state.merge({ attemptingGetActivityTypes: false, activityTypes: [] });

/**
 * Update editor block
 */
const editorUpdateEntity = (state, action) => {
  return state.merge({
    entityUpdateQueue: [
      {
        blockKey: action.blockKey,
        newData: action.newData
      },
      ...state.entityUpdateQueue
    ]
  });
};

/**
 * Clear block update queue
 */
const editorUpdateEntityQueueClear = state =>
  state.merge({
    entityUpdateQueue: [],
    editorLoaded: true
  });

const getWorkbookMediaAttempt = state =>
  state.merge(
    {
      media: {
        attemptingGetWorkbookMedia: true,
        errorCode: null,
        images: INITIAL_STATE.media.images
      }
    },
    { deep: true }
  );

const getWorkbookMediaSuccess = (state, action) => {
  const responseData = action.response.data.data;
  const mediaType = action.response.config.params.type;
  return state.merge(
    {
      media: {
        attemptingGetWorkbookMedia: false,
        errorCode: null,
        images: mediaType === 'photo' ? responseData.media : null,
        videos: mediaType === 'video' ? responseData.media : null,
        total: responseData.total
      }
    },
    { deep: true }
  );
};

const getWorkbookMediaFailure = (state, action) =>
  state.merge(
    {
      media: { attemptingGetWorkbookMedia: false, errorCode: action.errorCode }
    },
    { deep: true }
  );

const postWorkbookMediaAttempt = state =>
  state.merge(
    { media: { attemptingPostWorkbookMedia: true, errorCode: null } },
    { deep: true }
  );

const postWorkbookMediaSuccess = (state, action) =>
  state.merge(
    {
      media: {
        attemptingPostWorkbookMedia: false,
        errorCode: null,
        recentlyUploaded: action.response.data.data.cloudinary_file_id
      }
    },
    { deep: true }
  );

const postWorkbookMediaFailure = (state, action) =>
  state.merge(
    {
      media: { attemptingPostWorkbookMedia: false, errorCode: action.errorCode }
    },
    { deep: true }
  );

const deleteWorkbookMediaAttempt = state =>
  state.merge(
    { media: { attemptingDeleteWorkbookMedia: true, errorCode: null } },
    { deep: true }
  );

const deleteWorkbookMediaSuccess = state =>
  state.merge(
    { media: { attemptingDeleteWorkbookMedia: false, errorCode: null } },
    { deep: true }
  );

const deleteWorkbookMediaFailure = (state, action) =>
  state.merge(
    {
      media: {
        attemptingDeleteWorkbookMedia: false,
        errorCode: action.errorCode
      }
    },
    { deep: true }
  );

/**
 * Get activity
 */
const getActivityAttempt = state =>
  state.merge({ attemptingGetActivity: true, fetchedActivity: null });

const getActivitySuccess = (state, action) => {
  console.log('getActivitySuccess', action);
  return state.merge({
    attemptingGetActivity: false,
    fetchedActivity: action.activity
  });
};

const getActivityFailure = (state, action) => {
  console.log('getActivityFailure', action);
  return state.merge({ attemptingGetActivity: false, loadedActivity: null });
};

/**
 * Update activity
 */
const updateActivityAttempt = state => {
  console.log('updateActivityAttempt');
  return state.merge({
    attemptingUpdateActivity: true,
    hasUpdatedActivity: false
  });
};

const updateActivitySuccess = (state, action) =>
  state.merge({
    attemptingUpdateActivity: false,
    loadedActivity: action.updatedActivity,
    hasUpdatedActivity: true,
    unsavedChanges: false,
    hasAttemptedToCloseEditor: false
  });

const updateActivityFailure = state =>
  state.merge({ attemptingUpdateActivity: false });

/**
 * Create activity
 */
const createActivityAttempt = state =>
  state.merge({ loadedActivity: null, attemptingCreateActivity: true });

const createActivitySuccess = (state, action) =>
  state.merge({
    loadedActivity: action.activity,
    attemptingCreateActivity: false
  });

const createActivityFailure = state =>
  state.merge({ attemptingCreateActivity: false });

const mapToLearningOutcome = (state, action) =>
  state.merge({ selectedActivityId: action.activityId });

const clearMappedActivity = state => state.merge({ selectedActivityId: null });

const clearLoadedActivity = state => state.merge({ loadedActivity: null });

const onEditorChange = (state, { workbook }) => {
  // const hasChanged = !equals(state.lastSavedState, action.content);
  return state.merge({ cachedWorkbook: workbook });
};

const clearCachedWorkbook = state =>
  state.merge({ cachedWorkbook: INITIAL_STATE.cachedWorkbook });

const recordLastSavedState = (state, action) => {
  console.log(action);
  let qualification = lodash.cloneDeep(state.currentQualification);
  if (qualification && qualification.units) {
    let unit = qualification.units.find(
      u => u.unit_id == action.content.unit_id
    );
    if (unit) {
      let temp = unit.workbooks.findIndex(
        wb => wb.workbook_id == action.content.workbook_id
      );
      if (temp >= 0) {
        unit.workbooks[temp] = lodash.merge(
          unit.workbooks[temp],
          action.content
        );
      }
      // unit.workbooks = addList(unit.workbooks, 'workbook_id')([action.content]);
    }
  }

  return state.merge({
    currentQualification: qualification,
    lastSavedState: action.content,
    unsavedChanges: false
  });
};

const getLearingHoursAttempt = state => state.merge({});

const getLearingHoursSuccess = (state, action) =>
  state.merge({ learingHours: action.data });

const getLearingHoursFailure = state => state.merge({});

const deleteWorkbookFromUnitSuccess = (state, action) =>
  state.merge({
    currentQualification: R.merge(state.currentQualification, {
      units: R.map(unit => {
        if (R.equals(unit.unit_id.toString(), action.unit_id.toString())) {
          return R.merge(unit, {
            workbooks: R.filter(
              workbook =>
                R.not(
                  R.equals(
                    workbook.workbook_id.toString(),
                    action.workbook_id.toString()
                  )
                ),
              unit.workbooks
            )
          });
        }
        return unit;
      }, state.currentQualification.units)
    })
  });

const ACTION_HANDLERS = {
  [Types.GET_QUALIFICATION_ATTEMPT]: getQualificationAttempt,
  [Types.GET_QUALIFICATION_SUCCESS]: getQualificationSuccess,
  [Types.GET_QUALIFICATION_FAILURE]: getQualificationFailure,

  [Types.POST_QUALIFICATION_MAPPING_ATTEMPT]: postQualificationMappingAttempt,
  [Types.POST_QUALIFICATION_MAPPING_SUCCESS]: postQualificationMappingSuccess,
  [Types.POST_QUALIFICATION_MAPPING_FAILURE]: postQualificationMappingFailure,

  [Types.GET_ALL_QUALIFICATIONS_ATTEMPT]: getAllQualificationsAttempt,
  [Types.GET_ALL_QUALIFICATIONS_SUCCESS]: getAllQualificationsSuccess,
  [Types.GET_ALL_QUALIFICATIONS_FAILURE]: getAllQualificationsFailure,

  [Types.GET_QUALIFICATION_TYPES_ATTEMPT]: getQualificationTypesAttempt,
  [Types.GET_QUALIFICATION_TYPES_SUCCESS]: getQualificationTypesSuccess,
  [Types.GET_QUALIFICATION_TYPES_FAILURE]: getQualificationTypesFailure,

  [Types.GET_MEMBER_QUALIFICATIONS_ATTEMPT]: getMemberQualificationsAttempt,
  [Types.GET_MEMBER_QUALIFICATIONS_SUCCESS]: getMemberQualificationsSuccess,
  [Types.GET_MEMBER_QUALIFICATIONS_FAILURE]: getMemberQualificationsFailure,

  [Types.GET_CENTRE_QUALIFICATIONS_ATTEMPT]: getCentreQualificationsAttempt,
  [Types.GET_CENTRE_QUALIFICATIONS_SUCCESS]: getCentreQualificationsSuccess,
  [Types.GET_CENTRE_QUALIFICATIONS_FAILURE]: getCentreQualificationsFailure,

  [Types.GET_CENTRE_QUALIFICATION_ATTEMPT]: getCentreQualificationAttempt,
  [Types.GET_CENTRE_QUALIFICATION_SUCCESS]: getCentreQualificationSuccess,
  [Types.GET_CENTRE_QUALIFICATION_FAILURE]: getCentreQualificationFailure,

  [Types.CREATE_QUALIFICATION_ATTEMPT]: createQualificationAttempt,
  [Types.CREATE_QUALIFICATION_SUCCESS]: createQualificationSuccess,
  [Types.CREATE_QUALIFICATION_FAILURE]: createQualificationFailure,

  [Types.UPDATE_QUALIFICATION_ATTEMPT]: updateQualificationAttempt,
  [Types.UPDATE_QUALIFICATION_SUCCESS]: updateQualificationSuccess,
  [Types.UPDATE_QUALIFICATION_FAILURE]: updateQualificationFailure,

  [Types.DELETE_QUALIFICATION_ATTEMPT]: deleteQualificationAttempt,
  [Types.DELETE_QUALIFICATION_SUCCESS]: deleteQualificationSuccess,
  [Types.DELETE_QUALIFICATION_FAILURE]: deleteQualificationFailure,

  [Types.RESET_MEMBER_QUALIFICATIONS]: resetMemberQualifications,

  [Types.SET_QUALIFICATION_EDIT_MODE]: setQualificationEditMode,

  [Types.POST_QUALIFICATION_TO_GROUPS_MAPPING_ATTEMPT]: postQualificationToGroupsMappingAttempt,
  [Types.POST_QUALIFICATION_TO_GROUPS_MAPPING_SUCCESS]: postQualificationToGroupsMappingSuccess,
  [Types.POST_QUALIFICATION_TO_GROUPS_MAPPING_FAILURE]: postQualificationToGroupsMappingFailure,

  [Types.POST_QUALIFICATION_PATHWAY_ATTEMPT]: postQualificationPathwayAttempt,
  [Types.POST_QUALIFICATION_PATHWAY_SUCCESS]: postQualificationPathwaySuccess,
  [Types.POST_QUALIFICATION_PATHWAY_FAILURE]: postQualificationPathwayFailure,

  [Types.CLEAR_CURRENT_QUALIFICATION]: clearCurrentQualification,
  [Types.COPY_CURRENT_QUALIFICATION]: copyCurrentQualification,

  [Types.SET_CURRENT_QUALIFICATION_DETAILS]: setCurrentQualificationDetails,
  [Types.RESET_CURRENT_QUALIFICATION_DETAILS]: resetCurrentQualificationDetails,
  [Types.SET_QUALIFICATIONS_ACTIVE_LEVEL]: setQualificationsActiveLevel,
  [Types.SET_WORKBOOKS_SEARCH_QUERY]: setWorkbooksSearchQuery,
  [Types.INCREMENT_GROUP_COUNT]: incrementGroupCount,

  [LOCATION_CHANGE]: resetQualifications,
  [Types.SET_CURRENT_QUALIFICATION_CATEGORY]: setCurrentQualificationCategory,
  [Types.SET_CURRENT_QUALIFICATION]: setCurrentQualification,
  [Types.SET_CURRENT_LEARNING_UNIT]: setCurrentLearningUnit,
  [Types.SET_CURRENT_LEARNING_WORKBOOK]: setCurrentLearningWorkbook,

  [Types.ADD_QUALIFICATION_STORE_ATTEMPT]: addQualificationStoreAttempt,
  [Types.ADD_QUALIFICATION_STORE_SUCCESS]: addQualificationStoreSuccess,
  [Types.ADD_QUALIFICATION_STORE_FAILURE]: addQualificationStoreFailure,

  [Types.DELETE_QUALIFICATION_STORE_ATTEMPT]: deleteQualificationStoreAttempt,
  [Types.DELETE_QUALIFICATION_STORE_SUCCESS]: deleteQualificationStoreSuccess,
  [Types.DELETE_QUALIFICATION_STORE_FAILURE]: deleteQualificationStoreFailure,

  [Types.GET_LEARNING_UNITS_ATTEMPT]: getLearningUnitsAttempt,
  [Types.GET_LEARNING_UNITS_SUCCESS]: getLearningUnitsSuccess,
  [Types.GET_LEARNING_UNITS_FAILURE]: getLearningUnitsFailure,

  [Types.GET_LEARNING_UNIT_ATTEMPT]: getLearningUnitAttempt,
  [Types.GET_LEARNING_UNIT_SUCCESS]: getLearningUnitSuccess,
  [Types.GET_LEARNING_UNIT_FAILURE]: getLearningUnitFailure,

  [Types.CREATE_LEARNING_UNIT_ATTEMPT]: createLearningUnitAttempt,
  [Types.CREATE_LEARNING_UNIT_SUCCESS]: createLearningUnitSuccess,
  [Types.CREATE_LEARNING_UNIT_FAILURE]: createLearningUnitFailure,

  [Types.UPDATE_LEARNING_UNIT_ATTEMPT]: updateLearningUnitAttempt,
  [Types.UPDATE_LEARNING_UNIT_SUCCESS]: updateLearningUnitSuccess,
  [Types.UPDATE_LEARNING_UNIT_FAILURE]: updateLearningUnitFailure,

  [Types.DELETE_LEARNING_UNIT_ATTEMPT]: deleteLearningUnitAttempt,
  [Types.DELETE_LEARNING_UNIT_SUCCESS]: deleteLearningUnitSuccess,
  [Types.DELETE_LEARNING_UNIT_FAILURE]: deleteLearningUnitFailure,

  [Types.CHANGE_LEARNING_UNIT_STATUS_ATTEMPT]: changeLearningUnitStatusAttempt,
  [Types.CHANGE_LEARNING_UNIT_STATUS_SUCCESS]: changeLearningUnitStatusSuccess,
  [Types.CHANGE_LEARNING_UNIT_STATUS_FAILURE]: changeLearningUnitStatusFailure,

  [Types.CLEAR_LOADED_ACTIVITY]: clearLoadedActivity,
  [Types.GET_ACTIVITY_ATTEMPT]: getActivityAttempt,
  [Types.GET_ACTIVITY_SUCCESS]: getActivitySuccess,
  [Types.GET_ACTIVITY_FAILURE]: getActivityFailure,
  [Types.UPDATE_ACTIVITY_ATTEMPT]: updateActivityAttempt,
  [Types.UPDATE_ACTIVITY_SUCCESS]: updateActivitySuccess,
  [Types.UPDATE_ACTIVITY_FAILURE]: updateActivityFailure,
  [Types.CREATE_ACTIVITY_ATTEMPT]: createActivityAttempt,
  [Types.CREATE_ACTIVITY_SUCCESS]: createActivitySuccess,
  [Types.CREATE_ACTIVITY_FAILURE]: createActivityFailure,

  [Types.GET_WORKBOOK_EDITOR_CONTENT]: getWorkbookEditorContent,
  [Types.CREATE_WORKBOOK_ATTEMPT]: createWorkbookAttempt,
  [Types.CREATE_WORKBOOK_SUCCESS]: createWorkbookSuccess,
  [Types.CREATE_WORKBOOK_FAILURE]: createWorkbookFailure,
  [Types.TOGGLE_OUTCOMES_TRAY]: toggleOutcomesTray,
  [Types.GET_ACTIVITY_TYPES_ATTEMPT]: getActivityTypesAttempt,
  [Types.GET_ACTIVITY_TYPES_SUCCESS]: getActivityTypesSuccess,
  [Types.GET_ACTIVITY_TYPES_FAILURE]: getActivityTypesFailure,
  [Types.GET_WORKBOOK_MEDIA_ATTEMPT]: getWorkbookMediaAttempt,
  [Types.GET_WORKBOOK_MEDIA_SUCCESS]: getWorkbookMediaSuccess,
  [Types.GET_WORKBOOK_MEDIA_FAILURE]: getWorkbookMediaFailure,
  [Types.POST_WORKBOOK_MEDIA_ATTEMPT]: postWorkbookMediaAttempt,
  [Types.POST_WORKBOOK_MEDIA_SUCCESS]: postWorkbookMediaSuccess,
  [Types.POST_WORKBOOK_MEDIA_FAILURE]: postWorkbookMediaFailure,
  [Types.DELETE_WORKBOOK_MEDIA_ATTEMPT]: deleteWorkbookMediaAttempt,
  [Types.DELETE_WORKBOOK_MEDIA_SUCCESS]: deleteWorkbookMediaSuccess,
  [Types.DELETE_WORKBOOK_MEDIA_FAILURE]: deleteWorkbookMediaFailure,
  [Types.EDITOR_UPDATE_ENTITY]: editorUpdateEntity,
  [Types.EDITOR_UPDATE_ENTITY_QUEUE_CLEAR]: editorUpdateEntityQueueClear,
  [Types.MAP_TO_LEARNING_OUTCOME]: mapToLearningOutcome,
  [Types.CLEAR_MAPPED_ACTIVITY]: clearMappedActivity,
  [Types.CLEAR_CACHED_WORKBOOK]: clearCachedWorkbook,
  [Types.ON_EDITOR_CHANGE]: onEditorChange,
  [Types.RECORD_LAST_SAVED_STATE]: recordLastSavedState,
  [Types.GET_LEARING_HOURS_ATTEMPT]: getLearingHoursAttempt,
  [Types.GET_LEARING_HOURS_SUCCESS]: getLearingHoursSuccess,
  [Types.GET_LEARING_HOURS_FAILURE]: getLearingHoursFailure,

  [Types.DELETE_WORKBOOK_FROM_UNIT_SUCCESS]: deleteWorkbookFromUnitSuccess
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
