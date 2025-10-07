import { LOCATION_CHANGE } from 'react-router-redux';
import Immutable from 'seamless-immutable';
import common from 'app/common';
import { createReducer } from 'reduxsauce';
import * as R from 'ramda';
import { Types } from '../actions';

const {
  util: {
    helpers: { organiseQualificationsAndPathways }
  }
} = common;

export const INITIAL_STATE = Immutable({
  unitTypes: [],
  qualificationUnits: null,
  currentQualificationUnit: null,

  attemptingGetQualificationUnits: false,
  attemptingGetQualificationUnitTypes: false,

  attemptingGetQualificationUnit: false,
  attemptingCreateQualificationUnit: false,
  attemptingUpdateQualificationUnit: false,
  attemptingDeleteQualificationUnit: false,
  attemptingDeleteWorkbookFromUnit: false,

  searchTerm: null,
  errorCode: null
});

const getQualificationUnitTypesAttempt = state =>
  state.merge({
    attemptingGetQualificationUnitTypes: true,
    errorCode: null,
    unitTypes: []
  });

const getQualificationUnitTypesSuccess = (state, action) =>
  state.merge({
    attemptingGetQualificationUnitTypes: false,
    errorCode: null,
    unitTypes: action.response.data
  });

const getQualificationUnitTypesFailure = (state, action) =>
  state.merge({
    attemptingGetQualificationUnitTypes: false,
    errorCode: action.errorCode
  });

const getQualificationUnitAttempt = state =>
  state.merge({
    attemptingGetQualificationUnit: true,
    currentQualificationUnit: null,
    errorCode: null
  });

const getQualificationUnitSuccess = (state, action) => {
  const unit = action.response.data.units[0]
    ? action.response.data.units[0]
    : null;
  return state.merge({
    attemptingGetQualificationUnit: false,
    currentQualificationUnit: unit
  });
};

const getQualificationUnitFailure = (state, action) => {
  console.log('opopopop', action);
  return state.merge({
    attemptingGetQualificationUnit: false,
    errorCode: action.errorCode
  });
};

const createQualificationUnitAttempt = state =>
  state.merge({ attemptingCreateQualificationUnit: true, errorCode: null });

const createQualificationUnitSuccess = (state, action) =>
  state.merge({
    attemptingCreateQualificationUnit: false,
    errorCode: null,
    currentQualificationUnit: action.response.data
  });

const createQualificationUnitFailure = (state, action) =>
  state.merge({
    attemptingCreateQualificationUnit: false,
    errorCode: action.errorCode
  });

const updateQualificationUnitAttempt = state =>
  state.merge({ attemptingUpdateQualificationUnit: true, errorCode: null });

const updateQualificationUnitSuccess = (state, action) =>
  state.merge({
    attemptingUpdateQualificationUnit: false,
    errorCode: null,
    currentQualificationUnit: action.response.data
  });

const updateQualificationUnitFailure = (state, action) =>
  state.merge({
    attemptingUpdateQualificationUnit: false,
    errorCode: action.errorCode
  });

const deleteQualificationUnitAttempt = state =>
  state.merge({
    attemptingDeleteQualificationUnit: true,
    errorCode: false
  });

const deleteQualificationUnitSuccess = (state, action) => {
  const { unit_id } = action;
  const filterPathways = qual => qual.unit_id !== unit_id;
  const pathwaysLens = R.lensProp('pathways');
  const units = R.map(R.over(pathwaysLens, R.filter(filterPathways)))(
    state.units
  );
  return state.merge({
    attemptingDeleteQualificationUnit: false,
    units
  });
};

const deleteQualificationUnitFailure = (state, action) =>
  state.merge({
    attemptingDeleteQualificationUnit: false,
    errorCode: action.errorCode
  });

const setCurrentQualificationUnit = (state, action) =>
  state.merge({
    currentQualificationUnit: action.unit
  });

const updateCurrentQualificationUnit = (state, action) =>
  state.merge({
    currentQualificationUnit: action.unit
  });

const deleteWorkbookFromUnitAttempt = state =>
  state.merge({
    attemptingDeleteWorkbookFromUnit: true
  });

const deleteWorkbookFromUnitSuccess = state =>
  state.merge({
    attemptingDeleteWorkbookFromUnit: false
  });

const deleteWorkbookFromUnitFailure = state =>
  state.merge({
    attemptingDeleteWorkbookFromUnit: false
  });

const ACTION_HANDLERS = {
  [Types.GET_QUALIFICATION_UNIT_TYPES_ATTEMPT]: getQualificationUnitTypesAttempt,
  [Types.GET_QUALIFICATION_UNIT_TYPES_SUCCESS]: getQualificationUnitTypesSuccess,
  [Types.GET_QUALIFICATION_UNIT_TYPES_FAILURE]: getQualificationUnitTypesFailure,

  [Types.GET_QUALIFICATION_UNIT_ATTEMPT]: getQualificationUnitAttempt,
  [Types.GET_QUALIFICATION_UNIT_SUCCESS]: getQualificationUnitSuccess,
  [Types.GET_QUALIFICATION_UNIT_FAILURE]: getQualificationUnitFailure,

  [Types.CREATE_QUALIFICATION_UNIT_ATTEMPT]: createQualificationUnitAttempt,
  [Types.CREATE_QUALIFICATION_UNIT_SUCCESS]: createQualificationUnitSuccess,
  [Types.CREATE_QUALIFICATION_UNIT_FAILURE]: createQualificationUnitFailure,

  [Types.UPDATE_QUALIFICATION_UNIT_ATTEMPT]: updateQualificationUnitAttempt,
  [Types.UPDATE_QUALIFICATION_UNIT_SUCCESS]: updateQualificationUnitSuccess,
  [Types.UPDATE_QUALIFICATION_UNIT_FAILURE]: updateQualificationUnitFailure,

  [Types.DELETE_QUALIFICATION_UNIT_ATTEMPT]: deleteQualificationUnitAttempt,
  [Types.DELETE_QUALIFICATION_UNIT_SUCCESS]: deleteQualificationUnitSuccess,
  [Types.DELETE_QUALIFICATION_UNIT_FAILURE]: deleteQualificationUnitFailure,

  [Types.DELETE_WORKBOOK_FROM_UNIT_ATTEMPT]: deleteWorkbookFromUnitAttempt,
  [Types.DELETE_WORKBOOK_FROM_UNIT_SUCCESS]: deleteWorkbookFromUnitSuccess,
  [Types.DELETE_WORKBOOK_FROM_UNIT_FAILURE]: deleteWorkbookFromUnitFailure,

  [Types.SET_CURRENT_QUALIFICATION_UNIT]: setCurrentQualificationUnit,
  [Types.UPDATE_CURRENT_QUALIFICATION_UNIT]: updateCurrentQualificationUnit
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
