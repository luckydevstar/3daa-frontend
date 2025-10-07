import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import { Types } from '../actions';

export const INITIAL_STATE = Immutable({
  qualifications: [],
  qualificationsTotal: null,
  qualificationsLoading: false,
  qualificationsError: null,
  allQualificationsSelected: false,
  reportStatus: null,
  selectedQualifications: [],
  selectedCentre: null,
  csvData: null,
  createdDate: ''
});

// Community users
const searchQualificationsAttempt = state =>
  state.merge({
    qualificationsLoading: true
  });

const searchQualificationsSuccess = (state, { data }) =>
  state.merge({
    qualificationsLoading: false,
    qualifications: data ? data.qualifications : [],
    qualificationsTotal: data ? data.total : null
  });

const searchQualificationsFailure = (state, { error }) =>
  state.merge({
    qualificationsLoading: false,
    qualificationsError: error
  });

const selectQualification = (state, { qualification }) => {
  const selectedQualification = state.selectedQualifications.find(
    item => item.qualification_id === qualification.qualification_id
  );
  if (selectedQualification) {
    return state.merge({
      selectedQualifications: state.selectedQualifications.filter(
        item => item.qualification_id !== qualification.qualification_id
      )
    });
  }
  return state.merge({
    selectedQualifications: [...state.selectedQualifications, qualification]
  });
};

const selectReportStatus = (state, { reportStatus }) =>
  state.merge({
    reportStatus
  });

const selectAllQualifications = state =>
  state.merge({
    allQualificationsSelected: !state.allQualificationsSelected
  });

const selectCentre = (state, { centre }) =>
  state.merge({
    selectedCentre: centre
  });

const generateExportManagerReportAttempt = state =>
  state.merge({
    qualificationsLoading: true
  });

const generateExportManagerReportSuccess = (state, { csvData, createdDate }) =>
  state.merge({
    csvData,
    createdDate,
    qualificationsLoading: false
  });

const generateExportManagerReportFailure = state =>
  state.merge({
    qualificationsLoading: false
  });

export default createReducer(INITIAL_STATE, {
  [Types.SELECT_QUALIFICATION]: selectQualification,
  [Types.SELECT_REPORT_STATUS]: selectReportStatus,
  [Types.SELECT_ALL_QUALIFICATIONS]: selectAllQualifications,

  [Types.SEARCH_QUALIFICATIONS_ATTEMPT]: searchQualificationsAttempt,
  [Types.SEARCH_QUALIFICATIONS_SUCCESS]: searchQualificationsSuccess,
  [Types.SEARCH_QUALIFICATIONS_FAILURE]: searchQualificationsFailure,

  [Types.GENERATE_EXPORT_MANAGER_REPORT_ATTEMPT]: generateExportManagerReportAttempt,
  [Types.GENERATE_EXPORT_MANAGER_REPORT_SUCCESS]: generateExportManagerReportSuccess,
  [Types.GENERATE_EXPORT_MANAGER_REPORT_FAILURE]: generateExportManagerReportFailure,

  [Types.SELECT_CENTRE]: selectCentre
});
