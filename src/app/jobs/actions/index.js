import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  interviewJobApplicationAttempt: [
    'centre_id',
    'job_id',
    'application_id',
    'params'
  ],
  interviewJobApplicationSuccess: null,
  interviewJobApplicationFailure: null,

  declineJobApplicationAttempt: [
    'centre_id',
    'job_id',
    'application_id',
    'params'
  ],
  declineJobApplicationSuccess: null,
  declineJobApplicationFailure: null,

  getJobApplicationsAttempt: ['centre_id', 'job_id'],
  getJobApplicationsSuccess: ['applications'],
  getJobApplicationsFailure: null,

  getJobQualificationsAttempt: ['sector_id'],
  getJobQualificationsSuccess: ['qualifications'],
  getJobQualificationsFailure: null,

  getSavedJobsAttempt: [],
  getSavedJobsSuccess: ['jobs'],
  getSavedJobsFailure: null,

  unsaveLearnerJobAttempt: ['job_id'],
  unsaveLearnerJobSuccess: null,
  unsaveLearnerJobFailure: null,

  saveLearnerJobAttempt: ['job_id'],

  applyLearnerJobAttempt: ['job_id', 'onSuccessCb'],
  applyLearnerJobSuccess: null,
  applyLearnerJobFailure: null,

  getLearnerJobsAttempt: ['findValues', 'redirect'],
  getLearnerJobsSuccess: ['jobs'],
  getLearnerJobsFailure: null,

  getJobsAttempt: ['centre_id'],
  getJobsSuccess: ['jobs'],
  getJobsFailure: null,

  updateJobAttempt: ['job_id', 'params'],
  updateJobSuccess: null,
  updateJobFailure: null,

  saveJobAttempt: ['centre_id', 'params'],
  saveJobSuccess: null,
  saveJobFailure: null,

  deleteJobAttempt: ['centre_id', 'job_id'],
  deleteJobSuccess: null,
  deleteJobFailure: null,

  createJobAttempt: ['centre_id', 'params'],
  createJobSuccess: null,
  createJobFailure: null,

  getCoordsByLocationAttempt: ['locationString'],
  getCoordsByLocationSuccess: ['coords'],
  getCoordsByLocationFailure: null
});
