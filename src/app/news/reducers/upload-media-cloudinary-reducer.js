import { LOCATION_CHANGE } from 'react-router-redux';
import Immutable from 'seamless-immutable';
import common from 'app/common';
import { createReducer } from 'reduxsauce';
import { Types } from '../actions';

export const INITIAL_STATE = Immutable({
  uploadMediaPreview: null,
  uploadedMedia: null,
  attemptingUploadMediaCloudinary: false,
  errorCode: null
});

// POST uploadMediaCloudnary
const uploadMediaCloudinaryAttempt = (state, action) => {
  return state.merge({
    attemptingUploadMediaCloudinary: true,
    uploadMediaPreview:
      action.file && action.file.preview ? action.file.preview : null,
    errorCode: null,
    uploadedMedia: null
  });
};

const uploadMediaCloudinarySuccess = (state, action) => {
  console.log('success', action);
  return state.merge({
    attemptingUploadMediaCloudinary: false,
    uploadedMedia: action.cloudinary_id,
    errorCode: null
  });
};

const uploadMediaCloudinaryFailure = (state, action) => {
  console.log('failed', action);
  return state.merge({
    attemptingUploadMediaCloudinary: false,
    errorCode: action.errorCode
  });
};

const ACTION_HANDLERS = {
  [Types.UPLOAD_MEDIA_CLOUDINARY_ATTEMPT]: uploadMediaCloudinaryAttempt,
  [Types.UPLOAD_MEDIA_CLOUDINARY_SUCCESS]: uploadMediaCloudinarySuccess,
  [Types.UPLOAD_MEDIA_CLOUDINARY_FAILURE]: uploadMediaCloudinaryFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
