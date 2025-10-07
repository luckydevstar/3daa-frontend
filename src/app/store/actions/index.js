import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  setCourses: ['courses'],
  addToCart: ['qualification_id', 'count'],
  removeFromCart: ['qualification_id'],
  setItemCount: ['index', 'count'],

  cleanSelectedCentreMembers: null,
  selectCentreMember: ['member'],
  deselectCentreMember: ['member'],

  setActiveQualification: ['qualification'],

  getAllQualificationsInStoreAttempt: ['params'],
  getAllQualificationsInStoreSuccess: ['response'],
  getAllQualificationsInStoreFailure: ['errorCode'],

  getQualificationInStoreAttempt: ['qualification_id', 'view_error'],
  getQualificationInStoreSuccess: ['response'],
  getQualificationInStoreFailure: ['errorCode', 'view_error'],

  getCentreMembersNotQualificationAttempt: ['centre_id', 'params'],
  getCentreMembersNotQualificationSuccess: ['response'],
  getCentreMembersNotQualificationFailure: ['errorCode'],

  getOrdersInAccountAttempt: ['centre_id', 'params'],
  getOrdersInAccountSuccess: ['response'],
  getOrdersInAccountFailure: ['errorCode'],

  getQualificationOrderAttempt: ['centre_id', 'transaction_id'],
  getQualificationOrderSuccess: ['response'],
  getQualificationOrderFailure: ['errorCode'],

  getQualificationLicensesAttempt: ['centre_id'],
  getQualificationLicensesSuccess: ['response'],
  getQualificationLicensesFailure: ['errorCode'],

  getQualificationLicenseAttempt: ['centre_id', 'qualification_license_id'],
  getQualificationLicenseSuccess: ['response'],
  getQualificationLicenseFailure: ['errorCode'],

  postCentreMembersWithCSVAttempt: ['params'],
  postCentreMembersWithCSVSuccess: ['response'],
  postCentreMembersWithCSVFailure: ['errorCode'],

  postQualificationPurchaseLicencesCentreAttempt: [
    'qualification_id',
    'centre_id',
    'params'
  ],
  postQualificationPurchaseLicencesCentreSuccess: ['response'],
  postQualificationPurchaseLicencesCentreFailure: ['errorCode'],

  postPurchaseLicencesCentreAttempt: ['centre_id', 'params'],
  postPurchaseLicencesCentreSuccess: ['response'],
  postPurchaseLicencesCentreFailure: ['errorCode'],

  postAssignQualificationLicencesLearnersAttempt: [
    'qualification_id',
    'centre_id',
    'params'
  ],
  postAssignQualificationLicencesLearnersSuccess: ['response'],
  postAssignQualificationLicencesLearnersFailure: ['errorCode']
});
