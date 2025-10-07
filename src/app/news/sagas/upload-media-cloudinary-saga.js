import React from 'react';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import { compose, prop, head } from 'ramda';
import { Types, Creators as Actions } from '../actions';
import common from 'app/common';
import { translate } from 'app/intl';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifyError, notifySuccess },
  sagaSelectors: { getUserCentres, getActiveSector }
} = common.util;

export default api => {
  function* uploadMediaCloudinaryAttempt(action) {
    try {
      const resp = yield call(api.cloudinaryUpload, action.file);
      const data = yield checkResponse(resp);
      yield put(Actions.uploadMediaCloudinarySuccess(data));
    } catch (err) {
      console.log('ppppp', err);
      yield put(Actions.uploadMediaCloudinaryFailure(err));
    }
  }

  function* uploadMediaCloudinarySuccess() {
    yield put(
      notifySuccess(yield translate('media_uploaded'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* uploadMediaCloudinaryFailure() {
    yield put(
      notifyError(yield translate('media_upload_failed'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* startWatchers() {
    yield takeEvery(
      Types.UPLOAD_MEDIA_CLOUDINARY_ATTEMPT,
      uploadMediaCloudinaryAttempt
    );
    yield takeEvery(
      Types.UPLOAD_MEDIA_CLOUDINARY_SUCCESS,
      uploadMediaCloudinarySuccess
    );
    yield takeEvery(
      Types.UPLOAD_MEDIA_CLOUDINARY_FAILURE,
      uploadMediaCloudinaryFailure
    );
  }

  return {
    startWatchers,
    uploadMediaCloudinaryAttempt,
    uploadMediaCloudinarySuccess,
    uploadMediaCloudinaryFailure
  };
};
