import React from 'react';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { Types, Creators as Actions } from '../actions';
import common from 'app/common';
import { path, map, filter, indexOf, split, forEach } from 'ramda';
import { translate } from 'app/intl';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifyError, notifySuccess },
  sagaSelectors: { getUserCentres, getActiveSector }
} = common.util;

export default api => {
  function* getAllQualificationsInStoreAttempt(params) {
    try {
      const resp = yield call(api.getAllQualificationsInStore, params);
      const data = yield checkResponse(resp);
      yield put(Actions.getAllQualificationsInStoreSuccess(data));
    } catch (err) {
      yield put(Actions.getAllQualificationsInStoreFailure(err));
    }
  }

  function* getAllQualificationsInStoreSuccess(data) {}

  function* getAllQualificationsInStoreFailure(errorCode) {
    yield put(
      notifyError(yield translate('get_qualifications'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getQualificationInStoreAttempt(action) {
    try {
      const resp = yield call(
        api.getQualificationInStore,
        action.qualification_id
      );
      // console.log(resp.data.data.qualification);
      const unitsResp = yield call(api.getAllUnits);
      const data = yield checkResponse(resp);
      const unitsData = yield checkResponse(unitsResp);

      const units = path(['data', 'units'], unitsData);
      const qualification = path(['data', 'qualification'], data);
      const units_in_store = path(['units_in_store'], qualification);
      let storeUnits = '';
      if (units_in_store && units_in_store.toString().indexOf(',') !== -1) {
        storeUnits = split(',', units_in_store);
      } else if (units_in_store) {
        storeUnits = [units_in_store.toString()];
      }
      let selectedUnits = [];
      forEach(unit => {
        if (indexOf(unit.unit_id.toString(), storeUnits) !== -1) {
          selectedUnits.push(unit);
        }
      }, units);

      yield put(
        Actions.getQualificationInStoreSuccess({
          qualification: {
            ...qualification,
            units: selectedUnits
          }
        })
      );
    } catch (err) {
      yield put(Actions.getQualificationInStoreFailure(err, action.view_error));
    }
  }

  function* getQualificationInStoreSuccess(data) {}

  function* getQualificationInStoreFailure(action) {
    if (action.view_error) {
      yield put(
        notifyError(yield translate('qualification_get_failed_in_store'), {
          duration: 1000,
          canDimiss: true,
          icon: <i className="fa fa-exclamation" />
        })
      );
    }
  }

  function* getCentreMembersNotQualificationAttempt(action) {
    try {
      const resp = yield call(
        api.getCentreMembers,
        action.centre_id,
        action.params
      );
      const data = yield checkResponse(resp);
      yield put(Actions.getCentreMembersNotQualificationSuccess(data));
    } catch (err) {
      yield put(Actions.getCentreMembersNotQualificationFailure(err));
    }
  }

  function* getCentreMembersNotQualificationSuccess(data) {}

  function* getCentreMembersNotQualificationFailure(errorCode) {
    yield put(
      notifyError(yield translate('qualification_get_failed_in_store'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* postQualificationPurchaseLicencesCentreAttempt(action) {
    try {
      const resp = yield call(
        api.postQualificationPurchaseLicencesCentre,
        action.qualification_id,
        action.centre_id,
        action.params
      );
      const data = yield checkResponse(resp);
      yield put(Actions.postQualificationPurchaseLicencesCentreSuccess(data));
    } catch (err) {
      yield put(Actions.postQualificationPurchaseLicencesCentreFailure(err));
    }
  }

  function* postQualificationPurchaseLicencesCentreSuccess(data) {
    yield put(
      notifySuccess(yield translate('licences_purchased'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* postQualificationPurchaseLicencesCentreFailure(errorCode) {
    yield put(
      notifyError(yield translate('qualification_get_failed_in_store'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getOrdersInAccountAttempt(action) {
    try {
      const resp = yield call(api.getOrders, action.centre_id, action.params);
      const data = yield checkResponse(resp);
      yield put(Actions.getOrdersInAccountSuccess(data));
    } catch (err) {
      yield put(Actions.getOrdersInAccountFailure(err));
    }
  }

  function* getOrdersInAccountFailure(errorCode) {
    yield put(
      notifyError(yield translate('qualification_get_failed_in_store'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getQualificationOrderAttempt(action) {
    try {
      console.log(action);
      const resp = yield call(
        api.getQualificationOrder,
        action.centre_id,
        action.transaction_id
      );
      const data = yield checkResponse(resp);
      yield put(Actions.getQualificationOrderSuccess(data));
    } catch (err) {
      yield put(Actions.getQualificationOrderFailure(err));
    }
  }

  function* getQualificationOrderFailure(errorCode) {
    yield put(
      notifyError(yield translate('qualification_get_failed_in_store'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getQualificationLicensesAttempt(action) {
    try {
      const resp = yield call(api.getCentreLicenses, action.centre_id, null);
      const data = yield checkResponse(resp);
      yield put(Actions.getQualificationLicensesSuccess(data));
    } catch (err) {
      yield put(Actions.getQualificationLicensesFailure(err));
    }
  }

  function* getQualificationLicensesFailure(errorCode) {
    yield put(
      notifyError(yield translate('qualification_get_failed_in_store'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getQualificationLicenseAttempt(action) {
    try {
      const resp = yield call(
        api.getCentreLicense,
        action.centre_id,
        action.qualification_license_id
      );
      const data = yield checkResponse(resp);
      yield put(Actions.getQualificationLicenseSuccess(data));
    } catch (err) {
      yield put(Actions.getQualificationLicenseFailure(err));
    }
  }

  function* getQualificationLicenseFailure(errorCode) {
    yield put(
      notifyError(yield translate('qualification_get_failed_in_store'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* postPurchaseLicencesCentreAttempt(action) {
    try {
      const resp = yield call(
        api.postPurchaseLicencesCentre,
        action.centre_id,
        action.params
      );
      const data = yield checkResponse(resp);
      yield put(Actions.postPurchaseLicencesCentreSuccess(data));
      browserHistory.push('/store/accounts');
    } catch (err) {
      yield put(Actions.postPurchaseLicencesCentreFailure(err));
    }
  }

  function* postPurchaseLicencesCentreSuccess(data) {
    yield put(
      notifySuccess(yield translate('licences_purchased'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* postPurchaseLicencesCentreFailure(errorCode) {
    yield put(
      notifyError(yield translate('qualification_get_failed_in_store'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* postAssignQualificationLicencesLearnersAttempt(action) {
    try {
      const resp = yield call(
        api.postAssignQualificationLicencesLearners,
        action.qualification_id,
        action.centre_id,
        action.params
      );
      const data = yield checkResponse(resp);
      yield put(Actions.postAssignQualificationLicencesLearnersSuccess(data));
      browserHistory.push(`/store/accounts`);
    } catch (err) {
      yield put(Actions.postAssignQualificationLicencesLearnersFailure(err));
    }
  }

  function* postAssignQualificationLicencesLearnersFailure(errorCode) {
    yield put(
      notifyError(yield translate('assign_licenses_failed'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* startWatchers() {
    yield takeEvery(
      Types.GET_ALL_QUALIFICATIONS_IN_STORE_ATTEMPT,
      getAllQualificationsInStoreAttempt
    );
    yield takeEvery(
      Types.GET_ALL_QUALIFICATIONS_IN_STORE_SUCCESS,
      getAllQualificationsInStoreSuccess
    );
    yield takeEvery(
      Types.GET_ALL_QUALIFICATIONS_IN_STORE_FAILURE,
      getAllQualificationsInStoreFailure
    );

    yield takeEvery(
      Types.GET_QUALIFICATION_IN_STORE_ATTEMPT,
      getQualificationInStoreAttempt
    );
    yield takeEvery(
      Types.GET_QUALIFICATION_IN_STORE_SUCCESS,
      getQualificationInStoreSuccess
    );
    yield takeEvery(
      Types.GET_QUALIFICATION_IN_STORE_FAILURE,
      getQualificationInStoreFailure
    );

    yield takeEvery(
      Types.GET_CENTRE_MEMBERS_NOT_QUALIFICATION_ATTEMPT,
      getCentreMembersNotQualificationAttempt
    );
    yield takeEvery(
      Types.GET_CENTRE_MEMBERS_NOT_QUALIFICATION_SUCCESS,
      getCentreMembersNotQualificationSuccess
    );
    yield takeEvery(
      Types.GET_CENTRE_MEMBERS_NOT_QUALIFICATION_FAILURE,
      getCentreMembersNotQualificationFailure
    );

    yield takeEvery(
      Types.GET_ORDERS_IN_ACCOUNT_ATTEMPT,
      getOrdersInAccountAttempt
    );
    yield takeEvery(
      Types.GET_ORDERS_IN_ACCOUNT_FAILURE,
      getOrdersInAccountFailure
    );

    yield takeEvery(
      Types.GET_QUALIFICATION_ORDER_ATTEMPT,
      getQualificationOrderAttempt
    );
    yield takeEvery(
      Types.GET_QUALIFICATION_ORDER_FAILURE,
      getQualificationOrderFailure
    );

    yield takeEvery(
      Types.GET_QUALIFICATION_LICENSES_ATTEMPT,
      getQualificationLicensesAttempt
    );
    yield takeEvery(
      Types.GET_QUALIFICATION_LICENSES_FAILURE,
      getQualificationLicensesFailure
    );

    yield takeEvery(
      Types.GET_QUALIFICATION_LICENSE_ATTEMPT,
      getQualificationLicenseAttempt
    );
    yield takeEvery(
      Types.GET_QUALIFICATION_LICENSE_FAILURE,
      getQualificationLicenseFailure
    );

    yield takeEvery(
      Types.POST_QUALIFICATION_PURCHASE_LICENCES_CENTRE_ATTEMPT,
      postQualificationPurchaseLicencesCentreAttempt
    );
    yield takeEvery(
      Types.POST_QUALIFICATION_PURCHASE_LICENCES_CENTRE_SUCCESS,
      postQualificationPurchaseLicencesCentreSuccess
    );
    yield takeEvery(
      Types.POST_QUALIFICATION_PURCHASE_LICENCES_CENTRE_FAILURE,
      postQualificationPurchaseLicencesCentreFailure
    );

    yield takeEvery(
      Types.POST_PURCHASE_LICENCES_CENTRE_ATTEMPT,
      postPurchaseLicencesCentreAttempt
    );
    yield takeEvery(
      Types.POST_PURCHASE_LICENCES_CENTRE_SUCCESS,
      postPurchaseLicencesCentreSuccess
    );
    yield takeEvery(
      Types.POST_PURCHASE_LICENCES_CENTRE_FAILURE,
      postPurchaseLicencesCentreFailure
    );

    yield takeEvery(
      Types.POST_ASSIGN_QUALIFICATION_LICENCES_LEARNERS_ATTEMPT,
      postAssignQualificationLicencesLearnersAttempt
    );
    yield takeEvery(
      Types.POST_ASSIGN_QUALIFICATION_LICENCES_LEARNERS_FAILURE,
      postAssignQualificationLicencesLearnersFailure
    );
  }

  return {
    startWatchers,

    getAllQualificationsInStoreAttempt,
    getAllQualificationsInStoreSuccess,
    getAllQualificationsInStoreFailure,

    getCentreMembersNotQualificationAttempt,
    getCentreMembersNotQualificationSuccess,
    getCentreMembersNotQualificationFailure,

    postQualificationPurchaseLicencesCentreAttempt,
    postQualificationPurchaseLicencesCentreSuccess,
    postQualificationPurchaseLicencesCentreFailure,

    postPurchaseLicencesCentreAttempt,
    postPurchaseLicencesCentreSuccess,
    postPurchaseLicencesCentreFailure,

    getOrdersInAccountAttempt,
    getOrdersInAccountFailure,

    getQualificationOrderAttempt,
    getQualificationOrderFailure,

    getQualificationLicensesAttempt,
    getQualificationLicensesFailure,

    getQualificationLicenseAttempt,
    getQualificationLicenseFailure,

    postAssignQualificationLicencesLearnersAttempt,
    postAssignQualificationLicencesLearnersFailure
  };
};
