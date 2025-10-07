import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Type from '../actions/type';

export const INITIAL_STATE = Immutable({
  totalActivities: null,
  attemptingGetActivities: false,
  activities: [],
  errorCode: null
});

const getActivitiesAttempt = (state, action) => state.merge({
  attemptingGetActivities: true,
  errorCode: null
});

const getActivitiesSuccess = (state, action) => state.merge({
  activities: action.payload.activities,
  totalActivities: action.payload.total,
  attemptingGetActivities: false,
  errorCode: null
});

const getActivitiesFailure = (state, action) => state.merge({
  activities: [],
  totalActivities: null,
  attemptingGetActivities: false,
  errorCode: action.errorCode
});

// map our types to our handlers
const ACTION_HANDLERS = {
  [Type.GET_ACTIVITIES_ATTEMPT]: getActivitiesAttempt,
  [Type.GET_ACTIVITIES_SUCCESS]: getActivitiesSuccess,
  [Type.GET_ACTIVITIES_FAILURE]: getActivitiesFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
