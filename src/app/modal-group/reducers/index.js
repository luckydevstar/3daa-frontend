import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import { Types } from '../actions';

export const INITIAL_STATE = Immutable({
  uiSearching: false,
  uiSaving: false,
  uiShowSelected: true,
  uiCloseModal: false,
  uiGettingQualifications: false,
  qualifications: null,
  searchResults: null,
  searchTerm: ''
});

/**
 * Search for group members
 */
const searchForGroupMembersAttempt = (state, { searchTerm }) =>
  state.merge({ uiSearching: true, searchTerm });

const searchForGroupMembersSuccess = (state, { members }) =>
  state.merge({ searchResults: members, uiSearching: false });

const searchForGroupMembersFailure = state =>
  state.merge({ searchResults: [], uiSearching: false });

/**
 * Save group
 */
const saveGroupAttempt = state => state.merge({ uiSaving: true });

const saveGroupSuccess = state => state.merge({ uiSaving: false });

const saveGroupFailure = state => state.merge({ uiSaving: false });

/**
 * Get qualifications
 */
const getGroupQualificationsAttempt = state =>
  state.merge({ uiGettingQualifications: true });

const getGroupQualificationsSuccess = (state, { qualifications }) =>
  state.merge({ uiGettingQualifications: false, qualifications });

const getGroupQualificationsFailure = state =>
  state.merge({ uiGettingQualifications: false });

/**
 * Show selected
 */
const setShowSelected = (state, { flag }) =>
  state.merge({ uiShowSelected: flag });

/**
 * Close modal
 */

const setCloseModal = (state, { flag }) =>
  state.merge({ uiCloseModal: flag, qualifications: null });

const resetGroupModalSearch = state =>
  state.merge({
    searchTerm: INITIAL_STATE.searchTerm,
    searchResults: INITIAL_STATE.searchResults
  });

const ACTION_HANDLERS = {
  [Types.SEARCH_FOR_GROUP_MEMBERS_ATTEMPT]: searchForGroupMembersAttempt,
  [Types.SEARCH_FOR_GROUP_MEMBERS_SUCCESS]: searchForGroupMembersSuccess,
  [Types.SEARCH_FOR_GROUP_MEMBERS_FAILURE]: searchForGroupMembersFailure,
  [Types.GET_GROUP_QUALIFICATIONS_ATTEMPT]: getGroupQualificationsAttempt,
  [Types.GET_GROUP_QUALIFICATIONS_SUCCESS]: getGroupQualificationsSuccess,
  [Types.GET_GROUP_QUALIFICATIONS_FAILURE]: getGroupQualificationsFailure,
  [Types.SAVE_GROUP_ATTEMPT]: saveGroupAttempt,
  [Types.SAVE_GROUP_SUCCESS]: saveGroupSuccess,
  [Types.SAVE_GROUP_FAILURE]: saveGroupFailure,
  [Types.SET_SHOW_SELECTED]: setShowSelected,
  [Types.SET_CLOSE_MODAL]: setCloseModal,
  [Types.RESET_GROUP_MODAL_SEARCH]: resetGroupModalSearch
};

export default {
  modalGroup: createReducer(INITIAL_STATE, ACTION_HANDLERS)
};
