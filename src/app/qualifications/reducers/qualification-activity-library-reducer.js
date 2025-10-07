// import { LOCATION_CHANGE } from 'react-router-redux';
// import Immutable from 'seamless-immutable';
// import common from 'app/common';
// import { createReducer } from 'reduxsauce';
// import { Types } from '../actions';

// const {
//   util: {
//     helpers: { organiseQualificationsAndPathways }
//   }
// } = common;

// export const INITIAL_STATE = Immutable({
//   qualificationActivities: [],
//   qualificationCustomActivity: null,

//   attemptingGetQualificationActivities: false,
//   attemptingCreateQualificationActivity: false,
//   attemptingUpdateQualificationActivity: false,
//   attemptingDeleteQualificationActivity: false,

//   searchQuery: null,
//   errorCode: null
// });

// const getQualificationActivitiesAttempt = state =>
//   state.merge({
//     attemptingGetQualificationActivities: true,
//     qualificationActivities: [],
//     errorCode: null
//   });

// const getQualificationActivitiesSuccess = (state, action) => {
//   return state.merge({
//     attemptingGetQualificationActivities: false,
//     qualificationActivities: action.response.data
//   });
// };

// const getQualificationActivitiesFailure = (state, action) =>
//   state.merge({
//     attemptingGetQualificationActivities: false,
//     qualificationActivities: [],
//     errorCode: action.errorCode
//   });

// const createQualificationActivityAttempt = state =>
//   state.merge({ attemptingCreateQualificationUnit: true, errorCode: null });

// const createQualificationActivitySuccess = (state, action) =>
//   state.merge({
//     currentQualificationUnit: action.response.data,
//     attemptingCreateQualificationActivity: false,
//     errorCode: null
//   });

// const createQualificationActivityFailure = (state, action) =>
//   state.merge({
//     attemptingCreateQualificationUnit: false,
//     errorCode: action.errorCode
//   });

// const updateQualificationUnitAttempt = state =>
//   state.merge({ attemptingUpdateQualificationUnit: true, errorCode: null });

// const updateQualificationUnitSuccess = (state, action) =>
//   state.merge({
//     attemptingUpdateQualificationUnit: false,
//     errorCode: null,
//     currentQualificationUnit: action.response.data
//   });

// const updateQualificationUnitFailure = (state, action) =>
//   state.merge({
//     attemptingUpdateQualificationUnit: false,
//     errorCode: action.errorCode
//   });

// const deleteQualificationUnitAttempt = state =>
//   state.merge({
//     attemptingDeleteQualificationUnit: true,
//     errorCode: false
//   });

// const deleteQualificationUnitSuccess = (state, action) => {
//   const { unit_id } = action;
//   const filterPathways = qual => qual.unit_id !== unit_id;
//   const pathwaysLens = R.lensProp('pathways');
//   const units = R.map(R.over(pathwaysLens, R.filter(filterPathways)))(
//     state.units
//   );

//   return state.merge({
//     attemptingDeleteQualificationUnit: false,
//     units
//   });
// };

// const deleteQualificationUnitFailure = (state, action) =>
//   state.merge({
//     attemptingDeleteQualificationUnit: false,
//     errorCode: action.errorCode
//   });

// const ACTION_HANDLERS = {
//   [Types.GET_QUALIFICATION_UNITS_ATTEMPT]: getQualificationUnitsAttempt,
//   [Types.GET_QUALIFICATION_UNITS_SUCCESS]: getQualificationUnitsSuccess,
//   [Types.GET_QUALIFICATION_UNITS_FAILURE]: getQualificationUnitsFailure,

//   [Types.GET_QUALIFICATION_UNIT_ATTEMPT]: getQualificationUnitAttempt,
//   [Types.GET_QUALIFICATION_UNIT_SUCCESS]: getQualificationUnitSuccess,
//   [Types.GET_QUALIFICATION_UNIT_FAILURE]: getQualificationUnitFailure,

//   [Types.CREATE_QUALIFICATION_UNIT_ATTEMPT]: createQualificationUnitAttempt,
//   [Types.CREATE_QUALIFICATION_UNIT_SUCCESS]: createQualificationUnitSuccess,
//   [Types.CREATE_QUALIFICATION_UNIT_FAILURE]: createQualificationUnitFailure,

//   [Types.UPDATE_QUALIFICATION_UNIT_ATTEMPT]: updateQualificationUnitAttempt,
//   [Types.UPDATE_QUALIFICATION_UNIT_SUCCESS]: updateQualificationUnitSuccess,
//   [Types.UPDATE_QUALIFICATION_UNIT_FAILURE]: updateQualificationUnitFailure,

//   [Types.DELETE_QUALIFICATION_UNIT_ATTEMPT]: deleteQualificationUnitAttempt,
//   [Types.DELETE_QUALIFICATION_UNIT_SUCCESS]: deleteQualificationUnitSuccess,
//   [Types.DELETE_QUALIFICATION_UNIT_FAILURE]: deleteQualificationUnitFailure
// };

// export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
