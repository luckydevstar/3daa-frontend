import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import {
  omit,
  isNil,
  clone,
  cond,
  always,
  T,
  identity,
  lte,
  gte,
  __
} from 'ramda';
import { Types } from 'app/workbooks/actions';
import { setActivityStatus } from '../util/helpers';

export const INITIAL_STATE = Immutable({
  workbooks: [],
  learnersModalOpen: false,
  gettingWorkbooks: false,
  workbooksErrorCode: null,
  savingWorkbook: false,
  settingCurrentModerator: false,
  clearingCurrentModerator: false,
  workbook: { title: '' },
  pageIndex: 0,
  currentChapterIndex: 0,
  gettingWorkbook: false,
  workbookErrorCode: null,
  attemptingGetActivity: null,
  activity: null,
  length: 0,
  textSize: 0,
  activeLearnerId: null, // For assessing workbooks,
  activityLoading: '',
  solution: {},
  approved: false,
  attempts: []
});
const changeChapterIndex = (state, { chapterIndex }) =>
  state.merge({ currentChapterIndex: chapterIndex });
/**
 * Saving workbook reducers
 */
const saveWorkbookAttempt = state =>
  state.merge({ savingWorkbook: true, workbooks: [], pageIndex: 0 });

const saveWorkbookSuccess = (state, action) => {
  const workbook = {
    ...state.workbook,
    ...action.workbook,

    // NOTE - HOTFIX
    activities: state.workbook.activities
  };

  return state.merge({
    savingWorkbook: false,
    workbook,
    unsavedChanges: false
  });
};

const saveWorkbookFailure = state =>
  state.merge({ savingWorkbook: false, workbooks: [] });

const getMockWorkbooksAttempt = state =>
  state.merge({ gettingWorkbooks: true, workbooks: [], pageIndex: 0 });

const getMockWorkbooksSuccess = (state, action) =>
  state.merge({ gettingWorkbooks: false, workbooks: action.workbooks });

const getMockWorkbooksFailure = (state, action) =>
  state.merge({
    gettingWorkbooks: false,
    workbooks: [],
    workbooksErrorCode: action.errorCode
  });

const getWorkbookAttempt = state =>
  state.merge({ gettingWorkbook: true, workbook: INITIAL_STATE.workbook });

const getWorkbookSuccess = (state, action) =>
  state.merge({ gettingWorkbook: false, workbook: action.workbook });

const getWorkbookFailure = (state, action) =>
  state.merge({
    gettingWorkbook: false,
    workbook: null,
    workbookErrorCode: action.errorCode
  });

const getWorkbookMemberAttempt = state =>
  state.merge({ gettingWorkbook: true, workbook: INITIAL_STATE.workbook });

const getWorkbookMemberSuccess = (state, action) =>
  state.merge({ gettingWorkbook: false, workbook: action.workbook });

const getWorkbookMemberFailure = (state, action) =>
  state.merge({
    gettingWorkbook: false,
    workbook: null,
    workbookErrorCode: action.errorCode
  });

// TODO errors/success for current moderator actions?
const setWorkbookCurrentModeratorAttempt = state =>
  state.merge({ settingCurrentModerator: true });

const setWorkbookCurrentModeratorSuccess = (state, action) =>
  state.merge({
    settingCurrentModerator: false,
    workbook: { ...state.workbook, current_moderator: action.current_moderator }
  });

const setWorkbookCurrentModeratorFailure = state =>
  state.merge({ settingCurrentModerator: false });

const clearWorkbookCurrentModeratorAttempt = state =>
  state.merge({ clearingCurrentModerator: true });

const clearWorkbookCurrentModeratorSuccess = state =>
  state.merge({
    clearingCurrentModerator: false,
    workbook: { ...state.workbook, current_moderator: null }
  });

const clearWorkbookCurrentModeratorFailure = state =>
  state.merge({ clearingCurrentModerator: false });

const getWorkbookActivityAttempt = state =>
  state.merge({ attemptingGetActivity: true, activity: null });

const getWorkbookActivitySuccess = (state, { data }) => {
  return state.merge({ attemptingGetActivity: false, ...data });
};

const getWorkbookActivityFailure = state =>
  state.merge({
    attemptingGetActivity: false,
    activity: INITIAL_STATE.activity
  });

const resetWorkbookActivity = state =>
  state.merge({ activity: INITIAL_STATE.activity });

const clearWorkbook = state => state.set('workbook', {});

const clearWorkbookTitle = state => {
  const updatedWorkbook = clone(state.workbook);
  Object.assign(updatedWorkbook, { title: '' });
  return state.merge({ workbook: updatedWorkbook });
};

const updateWorkbookTitle = (state, action) => {
  const updatedWorkbook = clone(state.workbook);
  Object.assign(updatedWorkbook, { title: action.title });
  return state.merge({ workbook: updatedWorkbook });
};

const resetWorkbookState = state => state.merge(INITIAL_STATE);

const setAssessWorkbooksActiveLearnerId = (state, action) =>
  state.merge({ activeLearnerId: action.member_id });

const setTextSize = (state, { size }) =>
  state.merge({
    textSize: size >= 0 && size <= 5 ? size : state.size
  });

const activityLoadingOn = (state, { save, status }) => {
  const modifier = !isNil(status) ? !status : save;
  return state.merge({ activityLoading: modifier ? 'save' : 'submit' });
};

const activityLoadingOff = state => state.merge({ activityLoading: '' });

const saveActivityData = (state, { data }) => {
  const userData = omit('activity', data);
  let newState = activityLoadingOff(state);
  if (!data.save) {
    newState = setActivityStatus(
      data.activity.activity_id,
      'submitted',
      newState
    );
  }
  return newState.merge({ ...userData });
};

// TODO: API should give us an updated activity & solution object back
const activityClearSolution = (state, { approved, activity_id }) => {
  let newState = activityLoadingOff(state);
  if (approved) {
    newState = setActivityStatus(activity_id, 'approved', newState);
  } else {
    newState = setActivityStatus(activity_id, 'rejected', newState);
    return newState.set('solution', {});
  }
  return newState;
};

const toggleLearnersModal = (state, { flag }) =>
  state.merge({
    learnersModalOpen: typeof flag !== 'undefined'
      ? flag
      : !state.learnersModalOpen
  });

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.TOGGLE_LEARNERS_MODAL]: toggleLearnersModal,
  [Types.SAVE_WORKBOOK_ATTEMPT]: saveWorkbookAttempt,
  [Types.SAVE_WORKBOOK_SUCCESS]: saveWorkbookSuccess,
  [Types.SAVE_WORKBOOK_FAILURE]: saveWorkbookFailure,
  [Types.GET_WORKBOOK_ATTEMPT]: getWorkbookAttempt,
  [Types.GET_WORKBOOK_SUCCESS]: getWorkbookSuccess,
  [Types.GET_WORKBOOK_FAILURE]: getWorkbookFailure,
  [Types.GET_WORKBOOK_MEMBER_ATTEMPT]: getWorkbookMemberAttempt,
  [Types.GET_WORKBOOK_MEMBER_SUCCESS]: getWorkbookMemberSuccess,
  [Types.GET_WORKBOOK_MEMBER_FAILURE]: getWorkbookMemberFailure,
  [Types.SET_WORKBOOK_CURRENT_MODERATOR_ATTEMPT]: setWorkbookCurrentModeratorAttempt,
  [Types.SET_WORKBOOK_CURRENT_MODERATOR_SUCCESS]: setWorkbookCurrentModeratorSuccess,
  [Types.SET_WORKBOOK_CURRENT_MODERATOR_FAILURE]: setWorkbookCurrentModeratorFailure,
  [Types.CLEAR_WORKBOOK_CURRENT_MODERATOR_ATTEMPT]: clearWorkbookCurrentModeratorAttempt,
  [Types.CLEAR_WORKBOOK_CURRENT_MODERATOR_SUCCESS]: clearWorkbookCurrentModeratorSuccess,
  [Types.CLEAR_WORKBOOK_CURRENT_MODERATOR_FAILURE]: clearWorkbookCurrentModeratorFailure,
  [Types.GET_MOCK_WORKBOOKS_ATTEMPT]: getMockWorkbooksAttempt,
  [Types.GET_MOCK_WORKBOOKS_SUCCESS]: getMockWorkbooksSuccess,
  [Types.GET_MOCK_WORKBOOKS_FAILURE]: getMockWorkbooksFailure,
  [Types.GET_WORKBOOK_ACTIVITY_ATTEMPT]: getWorkbookActivityAttempt,
  [Types.GET_WORKBOOK_ACTIVITY_SUCCESS]: getWorkbookActivitySuccess,
  [Types.GET_WORKBOOK_ACTIVITY_FAILURE]: getWorkbookActivityFailure,
  [Types.RESET_WORKBOOK_ACTIVITY]: resetWorkbookActivity,
  [Types.CLEAR_WORKBOOK]: clearWorkbook,
  [Types.CLEAR_WORKBOOK_TITLE]: clearWorkbookTitle,
  [Types.UPDATE_WORKBOOK_TITLE]: updateWorkbookTitle,
  [Types.RESET_WORKBOOK_STATE]: resetWorkbookState,
  [Types.SET_ASSESS_WORKBOOKS_ACTIVE_LEARNER_ID]: setAssessWorkbooksActiveLearnerId,
  [Types.SET_TEXT_SIZE]: setTextSize,
  [Types.SUBMIT_WORKBOOK_ACTIVITY_ATTEMPT]: activityLoadingOn,
  [Types.SUBMIT_WORKBOOK_ACTIVITY_SUCCESS]: saveActivityData,
  [Types.SUBMIT_WORKBOOK_ACTIVITY_FAILURE]: activityLoadingOff,
  [Types.SUBMIT_WORKBOOK_DECISION]: activityLoadingOn,
  [Types.SUBMIT_WORKBOOK_DECISION_SUCCESS]: activityClearSolution,
  [Types.SUBMIT_WORKBOOK_DECISION_FAILURE]: activityLoadingOff,
  [Types.CHANGE_CHAPTER_INDEX]: changeChapterIndex
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
