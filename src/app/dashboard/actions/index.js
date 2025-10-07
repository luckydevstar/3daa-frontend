import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  // Dashboard Reporting
  toggleChartsToAdd: ['ctype'],
  changeDashboardDialog: ['dtype'],

  getUserSummaryAttempt: null,
  getUserSummarySuccess: ['data'],
  getUserSummaryFailure: ['errorCode'],

  getReportingTopCentresAttempt: null,
  getReportingTopCentresSuccess: ['data'],
  getReportingTopCentresFailure: ['errorCode'],

  getReportingMonthlyLearningHoursAttempt: null,
  getReportingMonthlyLearningHoursSuccess: ['data'],
  getReportingMonthlyLearningHoursFailure: ['errorCode'],

  getReportingDailyLoginsAttempt: null,
  getReportingDailyLoginsSuccess: ['data'],
  getReportingDailyLoginsFailure: ['errorCode'],

  getReportingTopQualificationsAttempt: null,
  getReportingTopQualificationsSuccess: ['data'],
  getReportingTopQualificationsFailure: ['errorCode'],

  getReportingMonthlyTopQualificationsAttempt: null,
  getReportingMonthlyTopQualificationsSuccess: ['data'],
  getReportingMonthlyTopQualificationsFailure: ['errorCode'],

  getReportingOrdersAttempt: null,
  getReportingOrdersSuccess: ['data'],
  getReportingOrdersFailure: ['errorCode'],

  getReportingOrdersMonthlyAttempt: null,
  getReportingOrdersMonthlySuccess: ['data'],
  getReportingOrdersMonthlyFailure: ['errorCode']
});
