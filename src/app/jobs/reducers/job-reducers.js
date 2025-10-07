import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import { pipe, prop, concat, uniqBy } from 'ramda';
import { Types } from '../actions';

// Add jobs to existing array and remove duplicates
const addJob = arr =>
  pipe(
    concat(arr),
    uniqBy(prop('job_id'))
  );

export const INITIAL_STATE = Immutable({
  uiLoadingJobs: false,
  uiLoadingSavedJobs: false,
  uiLoadingJobApplications: false,
  learnerJobApplyAttempting: false,
  learnerJobsLoaded: false,
  jobs: [],
  savedJobs: [],
  applications: [],
  jobLocationCoords: null,
  qualifications: []
});

const getSavedJobsAttempt = state => state.merge({ uiLoadingSavedJobs: true });

const getSavedJobsSuccess = (state, { jobs }) =>
  state.merge({
    savedJobs: jobs,
    uiLoadingSavedJobs: false
  });

const getSavedJobsFailure = state => state.merge({ uiLoadingSavedJobs: true });

const getJobsAttempt = state => state.merge({ uiLoadingJobs: true });

const getJobsSuccess = (state, { jobs }) =>
  state.merge({
    uiLoadingJobs: false,
    jobs
  });

const getJobsFailure = state => state.merge({ uiLoadingJobs: false });

const getCoordsByLocationSuccess = (state, { coords }) =>
  state.merge({ jobLocationCoords: coords });

const getCoordsByLocationFailure = state =>
  state.merge({ jobLocationCoords: null });

const getJobQualificationsSuccess = (state, { qualifications }) =>
  state.merge({
    qualifications
  });

const getLearnerJobsAttempt = state => state.merge({ uiLoadingJobs: true });

const getLearnerJobsSuccess = (state, { jobs }) =>
  state.merge({
    jobs,
    uiLoadingJobs: false,
    learnerJobsLoaded: true
  });

const getLearnerJobsFailure = state => state.merge({ uiLoadingJobs: false });

const applyLearnerJobAttempt = state =>
  state.merge({ learnerJobApplyAttempting: true });

const applyLearnerJobSuccess = state =>
  state.merge({ learnerJobApplyAttempting: false });

const applyLearnerJobFailure = state =>
  state.merge({ learnerJobApplyAttempting: false });

const getJobApplicationsAttempt = state =>
  state.merge({ uiLoadingJobApplications: true });

const getJobApplicationsSuccess = (state, { applications }) =>
  state.merge({ applications, uiLoadingJobApplications: false });

const getJobApplicationsFailure = state =>
  state.merge({ uiLoadingJobApplications: false });

const ACTION_HANDLERS = {
  [Types.APPLY_LEARNER_JOB_ATTEMPT]: applyLearnerJobAttempt,
  [Types.APPLY_LEARNER_JOB_SUCCESS]: applyLearnerJobSuccess,
  [Types.APPLY_LEARNER_JOB_FAILURE]: applyLearnerJobFailure,

  [Types.GET_JOB_QUALIFICATIONS_SUCCESS]: getJobQualificationsSuccess,

  [Types.GET_SAVED_JOBS_ATTEMPT]: getSavedJobsAttempt,
  [Types.GET_SAVED_JOBS_SUCCESS]: getSavedJobsSuccess,
  [Types.GET_SAVED_JOBS_FAILURE]: getSavedJobsFailure,

  [Types.GET_LEARNER_JOBS_ATTEMPT]: getLearnerJobsAttempt,
  [Types.GET_LEARNER_JOBS_SUCCESS]: getLearnerJobsSuccess,
  [Types.GET_LEARNER_JOBS_FAILURE]: getLearnerJobsFailure,

  [Types.GET_JOB_APPLICATIONS_ATTEMPT]: getJobApplicationsAttempt,
  [Types.GET_JOB_APPLICATIONS_SUCCESS]: getJobApplicationsSuccess,
  [Types.GET_JOB_APPLICATIONS_FAILURE]: getJobApplicationsFailure,

  [Types.GET_JOBS_ATTEMPT]: getJobsAttempt,
  [Types.GET_JOBS_FAILURE]: getJobsFailure,
  [Types.GET_JOBS_SUCCESS]: getJobsSuccess,

  [Types.GET_COORDS_BY_LOCATION_SUCCESS]: getCoordsByLocationSuccess,
  [Types.GET_COORDS_BY_LOCATION_FAILURE]: getCoordsByLocationFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
