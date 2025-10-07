/* eslint-disable no-restricted-syntax, no-prototype-builtins */
import React from 'react';
import { takeLatest, put, call } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { Types, Creators } from '../actions';
import { translate } from 'app/intl';
import common from 'app/common';

const {
  notify: { notifyError }
} = common.util;

export default api => {
  function* editCustomerAttempt(action) {
    const { params, platform_customer_id } = action;
    const res = yield call(api.editCustomer, params, platform_customer_id);
    console.log(res);
    if (res.data.status === 'success') {
      yield put(Creators.editCustomerSuccess());
    } else {
      yield put(Creators.getCustomersFailure(res.data.message));
      yield put(Creators.editCustomerFailure());
    }
  }

  function* deleteCustomerAttempt(action) {
    const { customers, platform_customer_id } = action;
    const res = yield call(api.deleteCustomer, platform_customer_id);
    if (res.data.status === 'success') {
      const filteredCustomers = customers.filter(
        customer => customer.platform_customer_id !== platform_customer_id
      );
      yield put(Creators.deleteCustomerSuccess(filteredCustomers));
    } else {
      yield put(Creators.getCustomersFailure(res.data.message));
    }
  }

  function* createCustomerAttempt(action) {
    const { params } = action;
    const res = yield call(api.createCustomer, params);
    if (res.data.status === 'success') {
      yield put(Creators.createCustomerSuccess());
    } else {
      yield put(Creators.createCustomerFailure(res.data.message));
    }
  }

  function* createCustomerSuccess() {
    browserHistory.push('/customer');
  }

  function* getCustomersAttempt() {
    const res = yield call(api.getCustomers);
    if (res.data.status === 'success') {
      yield put(Creators.getCustomersSuccess(res.data.data.platform_customers));
    } else {
      yield put(Creators.getCustomersFailure(res.data.message));
    }
  }

  function* getCustomersFailure({ customerErrorCode }) {
    yield put(
      notifyError(yield translate(customerErrorCode), {
        icon: <i className="fa fa-times" />
      })
    );
  }

  function* startWatchers() {
    yield takeLatest(Types.EDIT_CUSTOMER_ATTEMPT, editCustomerAttempt);
    yield takeLatest(Types.EDIT_CUSTOMER_SUCCESS, createCustomerSuccess);

    yield takeLatest(Types.DELETE_CUSTOMER_ATTEMPT, deleteCustomerAttempt);

    yield takeLatest(Types.CREATE_CUSTOMER_ATTEMPT, createCustomerAttempt);
    yield takeLatest(Types.CREATE_CUSTOMER_SUCCESS, createCustomerSuccess);
    yield takeLatest(Types.CREATE_CUSTOMER_FAILURE, getCustomersFailure);

    yield takeLatest(Types.GET_CUSTOMERS_ATTEMPT, getCustomersAttempt);
    yield takeLatest(Types.GET_CUSTOMERS_FAILURE, getCustomersFailure);
  }

  return {
    startWatchers
  };
};
