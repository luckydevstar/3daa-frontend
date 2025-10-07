/* global xdescribe, define, it, describe, FormData */
import React from 'react';
import { expect } from 'chai';
import { put, call } from 'redux-saga/effects';
import WorkbookSagas from 'app/workbooks/sagas/workbooks-saga';
import { notifySuccess, notifyError } from 'app/common/util/notify';
import API from 'app/core/services/api';

const api = API.wla();

describe('WORKBOOKS: SAGAS', () => {
  const sagas = WorkbookSagas(api);

  describe('WorkSave workbook', () => {
    const args = {
      formData: new FormData(),
      workbook: {},
      unitId: 3,
      workbookId: 25
    };

    const generator = sagas.saveWorkbookAttempt(args);

    it('should create an instruction to call the workbook save endpoint', () => {
      const expected = call(api.saveWorkbook, new FormData(), {}, 3, 25);
      expect(generator.next().value).to.eql(expected);
    });
    // xdescribe('API saved workbook response is succesful', () => {
    //   const success = {
    //     message: 'Workbook saved.',
    //     duration: 1000,
    //     canDimiss: true
    //   };
    //   const generator2 = sagas.saveWorkbookSuccess(success);
    //
    //   it('should create an instruction to call the workbook success notification', () => {
    //     const expected = put(notifySuccess('', success));
    //     expect(generator2.next(success).value).to.eql(expected);
    //   });
    // });

    /**
     * This test should pass an error object, not a notification config, in to the iterator.
     */
    // xdescribe('API saved workbook response is failure', () => {
    //   const failure = {
    //     message: 'There has been a problem saving the workbook. Please try again later.',
    //     duration: 1000,
    //     canDimiss: true,
    //     icon: <i className="fa fa-exclamation" />
    //   };
    //   const generator3 = sagas.saveWorkbookFailure(failure);
    //
    //   it('should create an instruction to call the workbook failure notification', () => {
    //     const expected = put(notifyError('', failure));
    //     expect(generator3.next(failure).value).to.eql(expected);
    //   });
    // });
  });

  // getWorkbooksAttempt
  describe('Get workbooks', () => {
    const args = {
      formData: new FormData(),
      workbook: {},
      unitId: 3,
      workbookId: 25
    };
    const generator = sagas.getWorkbooksAttempt(args);

    it('should create an instruction to call the get workbook endpoint', () => {
      const expected = call(api.getMockWorkbooks);
      expect(generator.next().value).to.eql(expected);
    });
  });
});
