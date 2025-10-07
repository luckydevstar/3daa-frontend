import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  financeGetAllCentresAttempt: ['params'],
  financeGetAllCentresSuccess: ['data'],
  financeGetAllCentresFailure: ['errorCode'],

  financeGetCentreLicensesAttempt: ['centre_id', 'params'],
  financeGetCentreLicensesSuccess: ['data'],
  financeGetCentreLicensesFailure: ['errorCode'],

  financeSuspendCentreAttempt: ['centre_id'],
  financeSuspendCentreSuccess: ['data'],
  financeSuspendCentreFailure: ['errorCode'],

  financeRestoreCentreAttempt: ['centre_id'],
  financeRestoreCentreSuccess: ['data'],
  financeRestoreCentreFailure: ['errorCode'],

  financeSuspendCentreLicensesAttempt: ['centre_id'],
  financeSuspendCentreLicensesSuccess: ['data'],
  financeSuspendCentreLicensesFailure: ['errorCode'],

  financeRestoreCentreLicensesAttempt: ['centre_id'],
  financeRestoreCentreLicensesSuccess: ['data'],
  financeRestoreCentreLicensesFailure: ['errorCode'],

  financeSuspendCentreLicenseAttempt: ['centre_id', 'qualification_license_id'],
  financeSuspendCentreLicenseSuccess: ['data'],
  financeSuspendCentreLicenseFailure: ['errorCode'],

  financeRestoreCentreLicenseAttempt: ['centre_id', 'qualification_license_id'],
  financeRestoreCentreLicenseSuccess: ['data'],
  financeRestoreCentreLicenseFailure: ['errorCode'],

  financeAddCentreQualificationLicensesAttempt: ['centre_id', 'params'],
  financeAddCentreQualificationLicensesSuccess: ['data'],
  financeAddCentreQualificationLicensesFailure: ['errorCode'],

  financeSetActiveLayout: ['layout'],
  financeSetActiveCentre: ['centre'],
  financeSetSearchTerm: ['term'],
  financeUpdateOrderSettings: ['orderProp', 'order']
});
