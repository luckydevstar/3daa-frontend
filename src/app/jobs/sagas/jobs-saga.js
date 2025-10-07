import { takeLatest, put, call, select } from 'redux-saga/effects';
import { checkResponse } from 'app/common/util/helpers';
import { pickAll, pick, filter } from 'ramda';
import { browserHistory } from 'react-router';
import { Types, Creators } from '../actions';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import axios from 'axios';

import common from 'app/common';

const {
  helpers: { convertToFormData }
} = common.util;

window.pickAll = pickAll;
window.pick = pick;

export default api => {
  // function* getJobsAttempt({ query }) {
  //   try {
  //     // const response = yield call(api.getJobs, query);
  //     // const { data: { jobs } } = yield checkResponse(response);
  //     const search = pickAll(['what', 'where'], query);
  //     const jobs = [{ a: 'as', b: 'bd', q: search }];
  //     yield put(Creators.getJobsSuccess(jobs));
  //     browserHistory.push(`/jobs/learner/all`);
  //   } catch (err) {
  //     yield put(Creators.getJobsFailure(err));
  //   }
  // }

  function* saveJobAttempt({ centre_id, params }) {
    const job_res = yield call(api.createJob, centre_id, params);
    if (job_res.data.status === 'success') {
      const res = yield call(
        api.saveJob,
        centre_id,
        job_res.data.data.job.job_id
      );
      if (res.data.status === 'success') {
        browserHistory.push('/jobs/admin/draft');
        yield put(Creators.saveJobSuccess());
        yield put(Creators.getJobsAttempt(centre_id));
      } else {
        yield put(Creators.saveJobFailure());
      }
    } else {
      yield put(Creators.saveJobFailure());
    }
  }

  function* interviewJobApplicationAttempt({
    centre_id,
    job_id,
    application_id,
    params
  }) {
    const res = yield call(
      api.interviewJobApplication,
      centre_id,
      job_id,
      application_id,
      params
    );
    if (res.data.status === 'success') {
      yield put(Creators.interviewJobApplicationSuccess());
      yield put(Creators.getJobApplicationsAttempt(centre_id, job_id));
    } else {
      yield put(Creators.interviewJobApplicationFailure());
    }
  }

  function* declineJobApplicationAttempt({
    centre_id,
    job_id,
    application_id,
    params
  }) {
    const res = yield call(
      api.declineJobApplication,
      centre_id,
      job_id,
      application_id,
      params
    );
    if (res.data.status === 'success') {
      yield put(Creators.declineJobApplicationSuccess());
      yield put(Creators.getJobApplicationsAttempt(centre_id, job_id));
    } else {
      yield put(Creators.declineJobApplicationFailure());
    }
  }

  function* applyLearnerJobAttempt({ job_id, onSuccessCb }) {
    const res = yield call(api.applyLearnerJob, job_id);
    const findValues = yield select(state => state.form['jobs-find'].values);
    if (res.data.status === 'success') {
      yield put(Creators.getLearnerJobsAttempt(findValues));
      yield put(Creators.applyLearnerJobSuccess());
      if (onSuccessCb) {
        onSuccessCb();
      }
      browserHistory.push('/jobs/learner/applied');
    } else {
      yield put(Creators.applyLearnerJobFailure());
    }
  }

  function* unsaveLearnerJobAttempt({ job_id }) {
    const res = yield call(api.unsaveLearnerJob, job_id);
    const findValues = yield select(state => state.form['jobs-find'].values);
    if (res.data.status === 'success') {
      yield put(Creators.unsaveLearnerJobSuccess());
      yield put(Creators.getLearnerJobsAttempt(findValues));
    } else {
      yield put(Creators.unsaveLearnerJobFailure());
    }
  }

  function* saveLearnerJobAttempt({ job_id }) {
    const res = yield call(api.saveLearnerJob, job_id);
    const findValues = yield select(state => state.form['jobs-find'].values);
    if (res.data && res.data.status === 'success') {
      yield put(Creators.getLearnerJobsAttempt(findValues));
    }
  }

  function* getLearnerJobsAttempt({ findValues, redirect }) {
    const res = yield call(api.getLearnerJobs);
    if (res.data && res.data.status === 'success') {
      const searchedJobs = filter(job => {
        if (!findValues) return true;
        let titleMatch = findValues.what ? false : true;
        let addressMatch = findValues.where ? false : true;
        let sectorMatch = findValues.sector ? false : true;
        let typeMatch = findValues.contractType ? false : true;
        if (
          findValues.what &&
          `${job.title} ${job.description}`
            .toLowerCase()
            .indexOf(findValues.what.toLowerCase()) !== -1
        )
          titleMatch = true;
        if (
          findValues.where &&
          job.address.toLowerCase().indexOf(findValues.where.toLowerCase()) !==
            -1
        )
          addressMatch = true;
        if (findValues.sector && job.abstract_sector_id === +findValues.sector)
          sectorMatch = true;
        if (
          findValues.contractType &&
          job.job_type_id === +findValues.contractType
        )
          typeMatch = true;
        return titleMatch && addressMatch && sectorMatch && typeMatch;
      }, res.data.data.jobs);
      yield put(Creators.getLearnerJobsSuccess(searchedJobs));
      if (redirect) {
        browserHistory.push('jobs/learner/all');
      }
    } else {
      yield put(Creators.getLearnerJobsFailure());
    }
  }

  function* getJobsAttempt({ centre_id }) {
    const res = yield call(api.getJobs, centre_id);
    if (res.data.status === 'success') {
      yield put(Creators.getJobsSuccess(res.data.data.jobs));
    } else {
      yield put(Creators.getJobsFailure(res.data.message));
    }
  }

  function* getJobApplicationsAttempt({ centre_id, job_id }) {
    const res = yield call(api.getJobApplications, centre_id, job_id);
    if (res.data.status === 'success') {
      yield put(Creators.getJobApplicationsSuccess(res.data.data.applications));
    } else {
      yield put(Creators.getJobApplicationsFailure());
    }
  }

  function* deleteJobAttempt({ centre_id, job_id }) {
    const res = yield call(api.deleteJob, centre_id, job_id);
    if (res.data.status === 'success') {
      browserHistory.push('/jobs');
      yield put(Creators.deleteJobSuccess());
      yield put(Creators.getJobsAttempt(centre_id));
    } else {
      yield put(Creators.deleteJobFailure());
    }
  }

  function* updateJobAttempt(action) {
    const { job_id, params } = action;
    const centre_id = 1301;
    console.log(job_id, convertToFormData(params));
    const res = yield call(api.updateJob, centre_id, job_id, params);
    console.log(res);
    if (res.data.status === 'success') {
      browserHistory.push('/jobs');
      yield put(Creators.updateJobSuccess());
      yield put(Creators.getJobsAttempt(centre_id));
    } else {
      yield put(Creators.updateJobFailure());
    }
  }

  function* getSavedJobsAttempt() {
    const res = yield call(api.getSavedJobs);
    if (res.data.status === 'success') {
      yield put(Creators.getSavedJobsSuccess(res.data.data.jobs));
    } else {
      yield put(Creators.getSavedJobsFailure());
    }
  }

  function* createJobAttempt({ centre_id, params }) {
    const res = yield call(api.createJob, centre_id, convertToFormData(params));
    if (res.data.status === 'success') {
      browserHistory.push('/jobs');
      yield put(Creators.createJobSuccess());
      yield put(Creators.getJobsAttempt(centre_id));
    } else {
      yield put(Creators.createJobFailure());
    }
  }

  function* getJobQualificationsAttempt({ sector_id }) {
    const res = yield call(api.getAllQualifications, sector_id);
    if (res.data.status === 'success') {
      yield put(
        Creators.getJobQualificationsSuccess(res.data.data.qualifications)
      );
    } else {
      yield put(Creators.getJobQualificationsFailure);
    }
  }

  function* getCoordsByLocationAttempt({ locationString }) {
    try {
      const res = yield call(geocodeByAddress, locationString);
      const coords = yield call(getLatLng, res[0]);
      if (coords) {
        yield put(Creators.getCoordsByLocationSuccess(coords));
      }
    } catch (e) {
      yield put(Creators.getCoordsByLocationFailure());
    }
  }

  function* startWatchers() {
    yield takeLatest(Types.GET_JOBS_ATTEMPT, getJobsAttempt);
    yield takeLatest(Types.GET_LEARNER_JOBS_ATTEMPT, getLearnerJobsAttempt);
    yield takeLatest(Types.SAVE_LEARNER_JOB_ATTEMPT, saveLearnerJobAttempt);
    yield takeLatest(Types.UNSAVE_LEARNER_JOB_ATTEMPT, unsaveLearnerJobAttempt);
    yield takeLatest(Types.APPLY_LEARNER_JOB_ATTEMPT, applyLearnerJobAttempt);
    yield takeLatest(Types.CREATE_JOB_ATTEMPT, createJobAttempt);
    yield takeLatest(Types.SAVE_JOB_ATTEMPT, saveJobAttempt);
    yield takeLatest(Types.GET_SAVED_JOBS_ATTEMPT, getSavedJobsAttempt);
    yield takeLatest(
      Types.GET_JOB_APPLICATIONS_ATTEMPT,
      getJobApplicationsAttempt
    );
    yield takeLatest(
      Types.DECLINE_JOB_APPLICATION_ATTEMPT,
      declineJobApplicationAttempt
    );
    yield takeLatest(
      Types.INTERVIEW_JOB_APPLICATION_ATTEMPT,
      interviewJobApplicationAttempt
    );
    yield takeLatest(
      Types.GET_COORDS_BY_LOCATION_ATTEMPT,
      getCoordsByLocationAttempt
    );
    yield takeLatest(
      Types.GET_JOB_QUALIFICATIONS_ATTEMPT,
      getJobQualificationsAttempt
    );
    yield takeLatest(Types.DELETE_JOB_ATTEMPT, deleteJobAttempt);
    yield takeLatest(Types.UPDATE_JOB_ATTEMPT, updateJobAttempt);
  }

  return {
    startWatchers,
    getJobsAttempt
  };
};
