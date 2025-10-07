import { Types } from '../actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  chartsToAdd: {},
  dialog: 1, // 1: Choose chart, 2: Pick data
  userSummary: null,
  uiLoadingUserSummary: false,
  topCentres: null,
  uiLoadingTopCentres: false,
  errorCode: null,
  monthlyLearningHours: null,
  uiLoadingMonthlyLearningHours: false,
  dailyLogins: null,
  uiLoadingDailyLogins: false,
  topQualifications: null,
  uiLoadingTopQualifications: false,
  monthlyTopQualifications: null,
  uiLoadingMonthlyTopQualifications: false,
  adminOrders: null,
  uiLoadingAdminOrders: false,
  adminOrdersMonthly: null,
  uiLoadingAdminOrdersMonthly: false
});

const toggleChartsToAdd = (state, { ctype }) =>
  state.merge({
    chartsToAdd: {
      ...state.chartsToAdd,
      [ctype]: !state.chartsToAdd[ctype]
    }
  });

const changeDialog = (state, { dtype }) =>
  state.merge({
    dialog: dtype
  });

const getUserSummaryAttempt = state =>
  state.merge({ uiLoadingUserSummary: true });

const getUserSummarySuccess = (state, { data }) =>
  state.merge({
    uiLoadingUserSummary: false,
    userSummary: data
  });

const getUserSummaryFailure = (state, { errorCode }) =>
  state.merge({
    uiLoadingUserSummary: false,
    errorCode
  });

const getReportingTopCentresAttempt = state =>
  state.merge({ uiLoadingTopCentres: true });

const getReportingTopCentresSuccess = (state, { data }) =>
  state.merge({
    uiLoadingTopCentres: false,
    topCentres: data
  });

const getReportingTopCentresFailure = (state, { errorCode }) =>
  state.merge({
    uiLoadingTopCentres: false,
    errorCode
  });

const getReportingMonthlyLearningHoursAttempt = state =>
  state.merge({ uiLoadingMonthlyLearningHours: true });

const getReportingMonthlyLearningHoursSuccess = (state, { data }) =>
  state.merge({
    uiLoadingMonthlyLearningHours: false,
    monthlyLearningHours: data
  });

const getReportingMonthlyLearningHoursFailure = (state, { errorCode }) =>
  state.merge({
    uiLoadingMonthlyLearningHours: false,
    errorCode
  });

const getReportingDailyLoginsAttempt = state =>
  state.merge({ uiLoadingDailyLogins: true });

const getReportingDailyLoginsSuccess = (state, { data }) =>
  state.merge({
    uiLoadingDailyLogins: false,
    dailyLogins: data
  });

const getReportingDailyLoginsFailure = (state, { errorCode }) =>
  state.merge({
    uiLoadingDailyLogins: false,
    errorCode
  });

const getReportingTopQualificationsAttempt = state =>
  state.merge({ uiLoadingTopQualifications: true });

const getReportingTopQualificationsSuccess = (state, { data }) =>
  state.merge({
    uiLoadingTopQualifications: false,
    topQualifications: data
  });

const getReportingTopQualificationsFailure = (state, { errorCode }) =>
  state.merge({
    uiLoadingTopQualifications: false,
    errorCode
  });

const getReportingMonthlyTopQualificationsAttempt = state =>
  state.merge({ uiLoadingTopQualifications: true });

const getReportingMonthlyTopQualificationsSuccess = (state, { data }) =>
  state.merge({
    uiLoadingMonthlyTopQualifications: false,
    monthlyTopQualifications: data
  });

const getReportingMonthlyTopQualificationsFailure = (state, { errorCode }) =>
  state.merge({
    uiLoadingMonthlyTopQualifications: false,
    errorCode
  });

const getReportingOrdersAttempt = state =>
  state.merge({ uiLoadingAdminOrders: true });

const getReportingOrdersSuccess = (state, { data }) =>
  state.merge({
    uiLoadingAdminOrders: false,
    adminOrders: data
  });

const getReportingOrdersFailure = (state, { errorCode }) =>
  state.merge({
    uiLoadingAdminOrders: false,
    errorCode
  });

const getReportingOrdersMonthlyAttempt = state =>
  state.merge({ uiLoadingAdminOrdersMonthly: true });

const getReportingOrdersMonthlySuccess = (state, { data }) =>
  state.merge({
    uiLoadingAdminOrdersMonthly: false,
    adminOrdersMonthly: data
  });

const getReportingOrdersMonthlyFailure = (state, { errorCode }) =>
  state.merge({
    uiLoadingAdminOrdersMonthly: false,
    errorCode
  });  
export default createReducer(INITIAL_STATE, {
  [Types.TOGGLE_CHARTS_TO_ADD]: toggleChartsToAdd,
  [Types.CHANGE_DASHBOARD_DIALOG]: changeDialog,
  [Types.GET_USER_SUMMARY_ATTEMPT]: getUserSummaryAttempt,
  [Types.GET_USER_SUMMARY_SUCCESS]: getUserSummarySuccess,
  [Types.GET_USER_SUMMARY_FAILURE]: getUserSummaryFailure,

  [Types.GET_REPORTING_TOP_CENTRES_ATTEMPT]: getReportingTopCentresAttempt,
  [Types.GET_REPORTING_TOP_CENTRES_SUCCESS]: getReportingTopCentresSuccess,
  [Types.GET_REPORTING_TOP_CENTRES_FAILURE]: getReportingTopCentresFailure,

  [Types.GET_REPORTING_MONTHLY_LEARNING_HOURS_ATTEMPT]: getReportingMonthlyLearningHoursAttempt,
  [Types.GET_REPORTING_MONTHLY_LEARNING_HOURS_SUCCESS]: getReportingMonthlyLearningHoursSuccess,
  [Types.GET_REPORTING_MONTHLY_LEARNING_HOURS_FAILURE]: getReportingMonthlyLearningHoursFailure,

  [Types.GET_REPORTING_DAILY_LOGINS_ATTEMPT]: getReportingDailyLoginsAttempt,
  [Types.GET_REPORTING_DAILY_LOGINS_SUCCESS]: getReportingDailyLoginsSuccess,
  [Types.GET_REPORTING_DAILY_LOGINS_FAILURE]: getReportingDailyLoginsFailure,

  [Types.GET_REPORTING_TOP_QUALIFICATIONS_ATTEMPT]: getReportingTopQualificationsAttempt,
  [Types.GET_REPORTING_TOP_QUALIFICATIONS_SUCCESS]: getReportingTopQualificationsSuccess,
  [Types.GET_REPORTING_TOP_QUALIFICATIONS_FAILURE]: getReportingTopQualificationsFailure,

  [Types.GET_REPORTING_MONTHLY_TOP_QUALIFICATIONS_ATTEMPT]: getReportingMonthlyTopQualificationsAttempt,
  [Types.GET_REPORTING_MONTHLY_TOP_QUALIFICATIONS_SUCCESS]: getReportingMonthlyTopQualificationsSuccess,
  [Types.GET_REPORTING_MONTHLY_TOP_QUALIFICATIONS_FAILURE]: getReportingMonthlyTopQualificationsFailure,

  [Types.GET_REPORTING_ORDERS_ATTEMPT]: getReportingOrdersAttempt,
  [Types.GET_REPORTING_ORDERS_SUCCESS]: getReportingOrdersSuccess,
  [Types.GET_REPORTING_ORDERS_FAILURE]: getReportingOrdersFailure,

  [Types.GET_REPORTING_ORDERS_MONTHLY_ATTEMPT]: getReportingOrdersMonthlyAttempt,
  [Types.GET_REPORTING_ORDERS_MONTHLY_SUCCESS]: getReportingOrdersMonthlySuccess,
  [Types.GET_REPORTING_ORDERS_MONTHLY_FAILURE]: getReportingOrdersMonthlyFailure
});
