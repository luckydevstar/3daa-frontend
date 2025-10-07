import { Types } from '../actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  units: [],
  unit: [],
  searchTerm: '',
  errorCode: null,
  total: 0,
  attemptingToGetUnits: false
});

/**
* Units reducers
*/

const unitFilterChanged = (state, { newFilter: searchTerm }) =>
  state.merge({
    searchTerm
  });

// GET
const getUnitsAttempt = state =>
  state.merge({
    attemptingToGetUnits: true,
    errorCode: null
  });

const getUnitsSuccess = (state, action) =>
  state.merge({
    attemptingToGetUnits: false,
    errorCode: null,
    units: action.response.data.units,
    total: action.response.data.total
  });

const getUnitsFailure = (state, action) =>
  state.merge({ attemptingToGetUnits: false, errorCode: action.errorCode });

const getUnitAttempt = state =>
  state.merge({
    attemptingToGetUnit: true,
    errorCode: null,
    unit: INITIAL_STATE.unit
  });

const getUnitSuccess = (state, action) =>
  state.merge({
    attemptingToGetUnit: false,
    errorCode: null,
    unit: action.response.data.units
  });

const getUnitFailure = (state, action) =>
  state.merge({ attemptingToGetUnit: false, errorCode: action.errorCode });

// POST
const postUnitsAttempt = state =>
  state.merge({ attemptingToPostUnits: true, errorCode: null });

const postUnitsSuccess = state =>
  state.merge({ attemptingToPostUnits: false, errorCode: null });

const postUnitsFailure = (state, action) =>
  state.merge({ attemptingToPostUnits: false, errorCode: action.errorCode });

// PUT
const putUnitsAttempt = state =>
  state.merge({ attemptingToPutUnits: true, errorCode: null });

const putUnitsSuccess = (state, action) =>
  state.merge({
    attemptingToPutUnits: false,
    errorCode: null,
    unit: action.response.data.units
  });

const putUnitsFailure = (state, action) =>
  state.merge({ attemptingToPutUnits: false, errorCode: action.errorCode });

// DELETE
const deleteUnitsAttempt = state =>
  state.merge({ attemptingToDeleteUnits: true, errorCode: null });

const deleteUnitsSuccess = (state, action) =>
  state.merge({
    attemptingToDeleteUnits: false,
    errorCode: null,
    data: action.response.data
  });

const deleteUnitsFailure = (state, action) =>
  state.merge({ attemptingToDeleteUnits: false, errorCode: action.errorCode });

// map our types to our handlers
const ACTION_HANDLERS = {
  // GET
  [Types.GET_UNITS_ATTEMPT]: getUnitsAttempt,
  [Types.GET_UNITS_SUCCESS]: getUnitsSuccess,
  [Types.GET_UNITS_FAILURE]: getUnitsFailure,

  [Types.GET_UNIT_ATTEMPT]: getUnitAttempt,
  [Types.GET_UNIT_SUCCESS]: getUnitSuccess,
  [Types.GET_UNIT_FAILURE]: getUnitFailure,
  // POST
  [Types.POST_UNITS_ATTEMPT]: postUnitsAttempt,
  [Types.POST_UNITS_SUCCESS]: postUnitsSuccess,
  [Types.POST_UNITS_FAILURE]: postUnitsFailure,
  // PUT
  [Types.PUT_UNITS_ATTEMPT]: putUnitsAttempt,
  [Types.PUT_UNITS_SUCCESS]: putUnitsSuccess,
  [Types.PUT_UNITS_FAILURE]: putUnitsFailure,
  // DELETE
  [Types.DELETE_UNITS_ATTEMPT]: deleteUnitsAttempt,
  [Types.DELETE_UNITS_SUCCESS]: deleteUnitsSuccess,
  [Types.DELETE_UNITS_FAILURE]: deleteUnitsFailure,

  [Types.UNIT_FILTER_CHANGED]: unitFilterChanged
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
