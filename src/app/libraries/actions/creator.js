import Type from './type';

const getActivitiesAttempt = payload =>
  ({ type: Type.GET_ACTIVITIES_ATTEMPT, payload });

const getActivitiesSuccess = payload =>
  ({ type: Type.GET_ACTIVITIES_SUCCESS, payload });

const getActivitiesFailure = errorCode =>
  ({ type: Type.GET_ACTIVITIES_FAILURE, errorCode });

export default {
  getActivitiesAttempt,
  getActivitiesSuccess,
  getActivitiesFailure
};
