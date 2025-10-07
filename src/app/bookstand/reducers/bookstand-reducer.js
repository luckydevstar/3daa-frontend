import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {
  head,
  pipe,
  prop,
  propEq,
  map,
  merge,
  pickAll,
  filter,
  ifElse,
  assoc,
  length,
  flatten,
  identity,
  omit,
  sortWith,
  descend,
  ascend
} from 'ramda';
import { Types } from '../actions';

export const INITIAL_STATE = Immutable({
  uiGettingQualifications: false,
  uiGettingQualification: false,
  uiGettingAssessLearner: false,
  qualifications: null,
  qualification: null,
  activeLevel: 0, // 0 -> All Levels
  searchQuery: '',
  assessingLearner: null,
  errorCode: null
});

// helpers
const workbookUnitKeys = [
  'guided_learning_hours',
  'credit_value',
  'specification',
  'is_mandatory'
];
const hasWorkbooks = unit => pipe(prop('workbooks'), length)(unit);
const filterSelected = wb => propEq('workbook_selected', wb.workbook_id)(wb);
const extractAllWorkbooks = unit =>
  pipe(prop('workbooks'), map(merge(pickAll(workbookUnitKeys, unit))))(unit);
const extractSelectedWorkbooks = unit =>
  pipe(
    prop('workbooks'),
    map(merge(pickAll([...workbookUnitKeys, 'workbook_selected'], unit))),
    filter(filterSelected)
  )(unit);

// Sector qualifications
const getSectorQualificationsAttempt = state =>
  state.merge({
    uiGettingQualifications: true,
    qualifications: null,
    qualification: null,
    activeLevel: 0,
    searchQuery: '',
    errorCode: null
  });

const getSectorQualificationsSuccess = (state, { qualifications }) => {
  const newQualifications = qualifications.map(qualification =>
    Object.assign(
      {},
      omit('latest_issue', qualification),
      qualification.latest_issue
    )
  );
  return state.merge({
    uiGettingQualifications: false,
    qualifications: newQualifications
  });
};

const getSectorQualificationsFailure = (state, { errorCode }) =>
  state.merge({
    uiGettingQualifications: false,
    qualifications: [],
    errorCode
  });

const getSectorQualificationAttempt = state =>
  state.merge({
    uiGettingQualification: true,
    qualification: null,
    searchQuery: '',
    errorCode: null
  });

const getSectorQualificationSuccess = (state, { qualification }) => {
  // Get all workbooks from units
  const currentWorkbooks = pipe(
    prop('units'),
    filter(hasWorkbooks),
    ifElse(length, pipe(map(extractAllWorkbooks), flatten), identity),
    sortWith([descend(prop('is_mandatory')), ascend(prop('title'))])
  )(qualification);

  return state.merge({
    uiGettingQualification: false,
    qualification: pipe(assoc('workbooks', currentWorkbooks), omit('units'))(
      qualification
    )
  });
};

const getSectorQualificationFailure = (state, { errorCode }) =>
  state.merge({
    uiGettingQualification: false,
    qualification: {},
    errorCode
  });

// Centre (tutor) qualifications
const getCentreTutorQualificationsAttempt = state =>
  state.merge({
    uiGettingQualifications: true,
    qualifications: null,
    qualification: null,
    activeLevel: 0,
    searchQuery: '',
    errorCode: null
  });

const getCentreTutorQualificationsSuccess = (state, { qualifications }) =>
  state.merge({
    uiGettingQualifications: false,
    qualifications
  });

const getCentreTutorQualificationsFailure = (state, { errorCode }) =>
  state.merge({
    uiGettingQualifications: false,
    qualifications: [],
    errorCode
  });

const getCentreTutorQualificationAttempt = state =>
  state.merge({
    uiGettingQualification: true,
    qualification: null,
    searchQuery: '',
    errorCode: null
  });

const getCentreTutorQualificationSuccess = (state, { qualification }) => {
  // Get selected workbooks from units
  const selectedWorkbooks = pipe(
    prop('units'),
    filter(hasWorkbooks),
    ifElse(length, pipe(map(extractSelectedWorkbooks), flatten), identity),
    sortWith([descend(prop('is_mandatory')), ascend(prop('title'))])
  )(qualification);

  return state.merge({
    uiGettingQualification: false,
    qualification: pipe(assoc('workbooks', selectedWorkbooks), omit('units'))(
      qualification
    )
  });
};

const getCentreTutorQualificationFailure = (state, { errorCode }) =>
  state.merge({
    uiGettingQualification: false,
    qualification: {},
    errorCode
  });

// Assess learner
const getAssessLearnerAttempt = state =>
  state.merge({
    uiGettingAssessLearner: true,
    assessingLearner: null,
    errorCode: null
  });

const getAssessLearnerSuccess = (state, { member }) =>
  state.merge({
    uiGettingAssessLearner: false,
    assessingLearner: pickAll(
      ['member_id', 'first_name', 'last_name', 'screen_name'],
      member
    )
  });

const getAssessLearnerFailure = (state, { errorCode }) =>
  state.merge({
    uiGettingAssessLearner: false,
    errorCode
  });

// Learner qualifications
const getLearnerQualificationsAttempt = state =>
  state.merge({
    uiGettingQualifications: true,
    qualifications: null,
    qualification: null,
    activeLevel: 0,
    searchQuery: '',
    errorCode: null
  });

const getLearnerQualificationsSuccess = (state, { qualifications }) =>
  state.merge({
    uiGettingQualifications: false,
    qualifications
  });

const getLearnerQualificationsFailure = (state, { errorCode }) =>
  state.merge({
    uiGettingQualifications: false,
    qualifications: [],
    errorCode
  });

const getLearnerQualificationAttempt = state =>
  state.merge({
    uiGettingQualification: true,
    qualification: null,
    searchQuery: '',
    errorCode: null
  });

const getLearnerQualificationSuccess = (state, { qualification }) =>
  state.merge({
    uiGettingQualification: false,
    qualification
  });

const getLearnerQualificationFailure = (state, { errorCode }) =>
  state.merge({
    uiGettingQualification: false,
    qualification: {},
    errorCode
  });

// Filter
const setBookstandActiveLevel = (state, { level }) =>
  state.merge({
    qualification: null,
    activeLevel: level
  });

const setBookstandSearchQuery = (state, { query }) =>
  Immutable.set(state, 'searchQuery', query);

const ACTION_HANDLERS = {
  // Sector qualifications
  [Types.GET_SECTOR_QUALIFICATIONS_ATTEMPT]: getSectorQualificationsAttempt,
  [Types.GET_SECTOR_QUALIFICATIONS_SUCCESS]: getSectorQualificationsSuccess,
  [Types.GET_SECTOR_QUALIFICATIONS_FAILURE]: getSectorQualificationsFailure,
  [Types.GET_SECTOR_QUALIFICATION_ATTEMPT]: getSectorQualificationAttempt,
  [Types.GET_SECTOR_QUALIFICATION_SUCCESS]: getSectorQualificationSuccess,
  [Types.GET_SECTOR_QUALIFICATION_FAILURE]: getSectorQualificationFailure,
  // Centre (tutor) qualifications
  [Types.GET_CENTRE_TUTOR_QUALIFICATIONS_ATTEMPT]: getCentreTutorQualificationsAttempt,
  [Types.GET_CENTRE_TUTOR_QUALIFICATIONS_SUCCESS]: getCentreTutorQualificationsSuccess,
  [Types.GET_CENTRE_TUTOR_QUALIFICATIONS_FAILURE]: getCentreTutorQualificationsFailure,
  [Types.GET_CENTRE_TUTOR_QUALIFICATION_ATTEMPT]: getCentreTutorQualificationAttempt,
  [Types.GET_CENTRE_TUTOR_QUALIFICATION_SUCCESS]: getCentreTutorQualificationSuccess,
  [Types.GET_CENTRE_TUTOR_QUALIFICATION_FAILURE]: getCentreTutorQualificationFailure,
  // Assess learner
  [Types.GET_ASSESS_LEARNER_ATTEMPT]: getAssessLearnerAttempt,
  [Types.GET_ASSESS_LEARNER_SUCCESS]: getAssessLearnerSuccess,
  [Types.GET_ASSESS_LEARNER_FAILURE]: getAssessLearnerFailure,
  // Learner qualifications
  [Types.GET_LEARNER_QUALIFICATIONS_ATTEMPT]: getLearnerQualificationsAttempt,
  [Types.GET_LEARNER_QUALIFICATIONS_SUCCESS]: getLearnerQualificationsSuccess,
  [Types.GET_LEARNER_QUALIFICATIONS_FAILURE]: getLearnerQualificationsFailure,
  [Types.GET_LEARNER_QUALIFICATION_ATTEMPT]: getLearnerQualificationAttempt,
  [Types.GET_LEARNER_QUALIFICATION_SUCCESS]: getLearnerQualificationSuccess,
  [Types.GET_LEARNER_QUALIFICATION_FAILURE]: getLearnerQualificationFailure,
  // Filter
  [Types.SET_BOOKSTAND_ACTIVE_LEVEL]: setBookstandActiveLevel,
  [Types.SET_BOOKSTAND_SEARCH_QUERY]: setBookstandSearchQuery
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
