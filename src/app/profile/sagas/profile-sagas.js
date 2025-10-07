// prettier-ignore
import { head, prop, find, omit, isNil } from 'ramda';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import { Types, Creators } from '../actions';
import common from 'app/common';
import { translate } from 'app/intl';
import { takeLatest } from '../../../../node_modules/redux-saga/effects';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifyError, notifySuccess }
} = common.util;

export default api => {
  function* getMemberAttempt(action) {
    try {
      const resp = yield call(api.getMember, action.id);
      const { data } = yield checkResponse(resp);
      yield put(Creators.getMemberSuccess(data));
    } catch (err) {
      yield put(Creators.getMemberFailure(err));
    }
  }

  function* getMemberSuccess(action) {
    console.log('getMemberSuccess', action.response);
  }

  function* getMemberFailure(action) {
    console.log('getMemberFailure', action);
  }

  function* getMemberBioAttempt(action) {
    try {
      const resp = yield call(api.getMemberBio, action.id);
      const data = yield checkResponse(resp);
      yield put(Creators.getMemberBioSuccess(data));
    } catch (err) {
      yield put(Creators.getMemberBioFailure(err));
    }
  }

  function* getMemberBioSuccess(action) {
    console.log('getMemberBioSuccess', action.response);
  }

  function* getMemberBioFailure(action) {
    console.log('getMemberBioFailure', action);
  }

  function* getMemberCommunityAttempt(action) {
    try {
      const resp = yield call(api.getMemberCommunity, action.id);
      const { data } = yield checkResponse(resp);
      yield put(Creators.getMemberCommunitySuccess(data));
    } catch (err) {
      yield put(Creators.getMemberCommunityFailure(err));
    }
  }

  function* getMemberCommunitySuccess(action) {
    console.log('getMemberCommunitySuccess', action.response);
  }

  function* getMemberCommunityFailure(action) {
    console.log('getMemberCommunityFailure', action);
  }

  function* getMemberMutualConnectionsAttempt(action) {
    try {
      const resp = yield call(api.getMemberMutualConnections, action.id);
      const { data } = yield checkResponse(resp);
      yield put(Creators.getMemberMutualConnectionsSuccess(data));
    } catch (err) {
      yield put(Creators.getMemberMutualConnectionsFailure(err));
    }
  }

  function* getMemberMutualConnectionsSuccess(action) {
    console.log('getMemberMutualConnectionsSuccess', action.response);
  }

  function* getMemberMutualConnectionsFailure(action) {
    console.log('getMemberMutualConnectionsFailure', action);
  }

  function* getMemberPhotosAttempt(action) {
    try {
      const resp = yield call(api.getMemberPhotos, action.id);
      console.log(resp);
      const data = yield checkResponse(resp);
      yield put(Creators.getMemberPhotosSuccess(data));
    } catch (err) {
      yield put(Creators.getMemberPhotosFailure(err));
    }
  }

  function* getMemberPhotosSuccess(action) {
    console.log('getMemberPhotosSuccess', action.response);
  }

  function* getMemberPhotosFailure(action) {
    console.log('getMemberPhotosFailure', action);
  }

  function* getMemberVideosAttempt(action) {
    try {
      const response = yield call(api.getMemberVideos, action.id);
      const data = yield checkResponse(response);
      yield put(Creators.getMemberVideosSuccess(data));
    } catch (err) {
      yield put(Creators.getMemberVideosFailure(err));
    }
  }

  function* getMemberVideosSuccess(action) {
    console.log('getMemberVideosSuccess:', action.response);
  }

  function* getMemberVideosFailure(action) {
    console.log('getMemberVideosFailure:', action);
  }

  function* getExtendedReference(references) {
    return yield references.map(reference =>
      call(api.getMember, reference.sender_id, { fields: 'photo,screen_name' })
    );
  }

  function* getMemberReferenceAttempt(action) {
    try {
      const resp = yield call(api.getMemberReference, action.id);
      const data = yield checkResponse(resp);

      // Getting more user details
      const setExtendedDetails = (ref, key) => {
        data.data[key].photo = ref.data.data.photo;
        data.data[key].screen_name = ref.data.data.screen_name;
      };

      const extendedReference = yield getExtendedReference(data.data);
      extendedReference.map((ref, key) => setExtendedDetails(ref, key));
      yield put(Creators.getMemberReferenceSuccess(data));
    } catch (err) {
      yield put(Creators.getMemberReferenceFailure(err));
    }
  }

  function* getMemberReferenceSuccess(action) {
    console.log('getMemberReferenceSuccess', action.response);
  }

  function* getMemberReferenceFailure(action) {
    console.log('getMemberReferenceFailure', action);
  }

  function* postMemberBioAttempt(action) {
    const {
      member_id,
      form,
      form: { cloudinary_file_id: file }
    } = action;
    try {
      const resp = yield call(api.postMemberBio, {
        member_id,
        form: convertToFormData({
          ...omit('cloudinary_file_id', form),
          ...(file && { cloudinary_file_id: head(file) })
        })
      });
      yield checkResponse(resp);
      yield put(Creators.postMemberBioSuccess(resp));
    } catch (err) {
      yield put(Creators.postMemberBioFailure(err));
    }
  }

  function* postMemberBioSuccess(action) {
    const {
      data: { member_id }
    } = action.response.data;
    yield put(Creators.getMemberBioAttempt(member_id));
    yield put(Creators.toggleNewBio());
    yield put(notifySuccess(yield translate('cv_updated')));
    console.log('postMemberBioSuccess', action.response);
  }

  function* postMemberBioFailure(action) {
    console.log('postMemberBioFailure', action);
    yield put(notifyError(yield translate('cv_update_failed')));
  }

  function* editMemberBioAttempt(action) {
    const {
      member_id,
      member_bio_id,
      form,
      form: { cloudinary_file_id: file }
    } = action;

    const isNewImage = !isNil(file) && typeof file === 'object';
    const isPersisted = typeof file === 'string';

    const formData = {
      ...omit('cloudinary_file_id', form),
      ...(isNewImage && { cloudinary_file_id: find(prop('preview'))(file) }),
      ...(isPersisted && { cloudinary_file_id: file })
    };

    try {
      const resp = yield call(api.editMemberBio, {
        member_id,
        member_bio_id,
        form: convertToFormData(formData)
      });
      yield checkResponse(resp);
      yield put(Creators.editMemberBioSuccess(resp));
    } catch (err) {
      yield put(Creators.editMemberBioFailure(err));
    }
  }

  function* editMemberBioSuccess(action) {
    const {
      data: { member_id }
    } = action.response.data;
    yield put(Creators.getMemberBioAttempt(member_id));
    yield put(Creators.toggleEditBio());
    yield put(notifySuccess(yield translate('cv_updated')));
    console.log('editMemberBioSuccess', action.response);
  }

  function* editMemberBioFailure(action) {
    console.log('editMemberBioFailure', action);
    yield put(notifyError(yield translate('cv_update_failed')));
  }

  function* deleteMemberBioAttempt(action) {
    const { member_id, member_bio_id } = action;
    try {
      const resp = yield call(api.deleteMemberBio, {
        member_id,
        member_bio_id
      });
      yield checkResponse(resp);
      yield put(Creators.deleteMemberBioSuccess({ ...resp, member_id }));
    } catch (err) {
      yield put(Creators.deleteMemberBioFailure(err));
    }
  }

  function* deleteMemberBioSuccess(action) {
    const { member_id } = action.response;
    yield put(Creators.getMemberBioAttempt(member_id));
    yield put(notifySuccess(yield translate('cv_updated')));
    console.log('deleteMemberBioSuccess:', action);
  }

  function* deleteMemberBioFailure(action) {
    yield put(notifyError(yield translate('cv_update_failed')));
    console.log('deleteMemberBioFailure:', action);
  }

  function* postMemberPhotoAttempt(action) {
    const {
      data: { member_id, payload, progressCallback }
    } = action;
    try {
      console.log(payload);
      const resp = yield call(api.postMemberPhoto, {
        member_id,
        payload: convertToFormData({
          file: payload.file,
          ...omit('file', payload)
        }),
        onUploadProgress: progressCallback
      });
      yield checkResponse(resp);
      yield put(Creators.postMemberPhotoSuccess(resp));
      yield put(Creators.getMemberMediaAttempt(member_id, true));
    } catch (err) {
      yield put(Creators.postMemberPhotoFailure(err));
    }
  }

  function* postMemberPhotoSuccess(action) {
    yield put(notifySuccess(yield translate('photo_added')));
    console.log('postMemberPhotoSuccess:', action);
  }

  function* postMemberPhotoFailure(action) {
    yield put(notifyError(yield translate('photo_add_failed')));
    console.log('failure:', action);
  }

  function* postMemberVideoAttempt(action) {
    const {
      data: { member_id, payload, progressCallback }
    } = action;
    try {
      const resp = yield call(api.postMemberVideo, {
        member_id,
        payload: convertToFormData({
          file: head(payload.file),
          ...omit('file', payload)
        }),
        onUploadProgress: progressCallback
      });
      yield checkResponse(resp);
      yield put(Creators.postMemberVideoSuccess(resp));
      yield put(Creators.getMemberMediaAttempt(member_id, true));
    } catch (err) {
      yield put(Creators.postMemberVideoFailure(err));
    }
  }

  function* postMemberVideoSuccess(action) {
    yield put(notifySuccess(yield translate('video_added')));
    console.log('postMemberVideoSuccess:', action);
  }

  function* postMemberVideoFailure(action) {
    yield put(notifyError(yield translate('video_add_failed')));
    console.log('postMemberVideoFailure:', action);
  }

  function* editMemberPhotoAttempt(action) {
    const { member_id, media_id, form } = action;

    try {
      const resp = yield call(api.editMemberPhoto, {
        member_id,
        media_id,
        params: form
      });
      yield checkResponse(resp);
      yield put(Creators.editMemberPhotoSuccess(resp));
      yield put(Creators.getMemberPhotosAttempt(member_id, true));
    } catch (err) {
      yield put(Creators.editMemberPhotoFailure(err));
    }
  }

  function* editMemberPhotoSuccess(action) {
    yield put(notifySuccess(yield translate('photo_updated')));
    console.log('editMemberPhotoSuccess:', action);
  }

  function* editMemberPhotoFailure(action) {
    yield put(notifyError(yield translate('photo_update_failed')));
    console.log('editMemberPhotoFailure:', action);
  }

  function* editMemberVideoAttempt(action) {
    const { member_id, media_id, form } = action;

    try {
      const resp = yield call(api.editMemberVideo, {
        member_id,
        media_id,
        params: form
      });
      yield checkResponse(resp);
      yield put(Creators.editMemberVideoSuccess(resp));
      yield put(Creators.getMemberVideosAttempt(member_id, true));
    } catch (err) {
      yield put(Creators.editMemberVideoFailure(err));
    }
  }

  function* editMemberVideoSuccess(action) {
    yield put(notifySuccess(yield translate('video_updated')));
    console.log('editMemberVideoSuccess:', action);
  }

  function* editMemberVideoFailure(action) {
    yield put(notifyError(yield translate('video_update_failed')));
    console.log('editMemberVideoFailure:', action);
  }

  function* deleteMemberPhotoAttempt(action) {
    const { member_id, media_id } = action;
    try {
      const resp = yield call(api.deleteMemberPhoto, { member_id, media_id });
      yield checkResponse(resp);
      yield put(Creators.deleteMemberPhotoSuccess(resp));
      yield put(Creators.getMemberPhotosAttempt(member_id, true));
    } catch (err) {
      yield put(Creators.deleteMemberPhotoFailure(err));
    }
  }

  function* deleteMemberPhotoSuccess(action) {
    yield put(Creators.viewMedia());

    yield put(notifySuccess(yield translate('photo_deleted')));
    console.log('deleteMemberPhotoSuccess:', action);
  }

  function* deleteMemberPhotoFailure(action) {
    yield put(notifyError(yield translate('photo_delete_failed')));
    console.log('deleteMemberPhotoFailure:', action);
  }

  function* deleteMemberVideoAttempt(action) {
    const { member_id, media_id } = action;
    try {
      const resp = yield call(api.deleteMemberVideo, { member_id, media_id });
      yield checkResponse(resp);
      yield put(Creators.deleteMemberVideoSuccess(resp));
      yield put(Creators.getMemberVideosAttempt(member_id, true));
    } catch (err) {
      yield put(Creators.deleteMemberVideoFailure(err));
    }
  }

  function* deleteMemberVideoSuccess(action) {
    yield put(Creators.viewMedia());

    yield put(notifySuccess(yield translate('video_deleted')));
    console.log('deleteMemberVideoSuccess:', action);
  }

  function* deleteMemberVideoFailure(action) {
    yield put(notifyError(yield translate('video_delete_failed')));
    console.log('deleteMemberVideoFailure:', action);
  }

  function* getMemberBadgeAttempt(action) {
    try {
      const resp = yield call(api.getMemberBadge, action.id);
      const data = yield checkResponse(resp);
      yield put(Creators.getMemberBadgeSuccess(data.data));
    } catch (err) {
      yield put(Creators.getMemberBadgeFailure(err));
    }
  }

  function* getMemberBadgeSuccess(action) {
    console.log('getMemberBadgeSuccess', action.response);
  }

  function* getMemberBadgeFailure(action) {
    console.log('getMemberBadgeFailure', action);
  }

  function* getMemberCvAttempt(action) {
    try {
      const resp = yield call(api.getMemberCv, action.id);
      const data = yield checkResponse(resp);
      yield put(Creators.getMemberCvSuccess(data.data));
    } catch (err) {
      yield put(Creators.getMemberCvFailure(err));
    }
  }

  function* getMemberCvSuccess(action) {
    console.log('getMemberCvSuccess', action.response);
  }

  function* getMemberCvFailure(action) {
    console.log('getMemberCvFailure', action);
  }

  function* getMemberMediaAttempt({ member_id, is_new_media }) {
    try {
      const resp = yield call(api.getMemberMedia, member_id);
      console.log(resp);
      const data = yield checkResponse(resp);
      const {
        data: { media }
      } = data;
      yield put(Creators.getMemberMediaSuccess(media));
      if (is_new_media) {
        yield put(Creators.openUpdateMediaModal());
      }
    } catch (err) {
      console.log(err);
      yield put(Creators.getMemberMediaFailure(err));
    }
  }

  function* deleteMemberMediaAttempt({ member_id, media_id }) {
    try {
      const resp = yield call(api.deleteMemberMedia, member_id, media_id);
      yield checkResponse(resp);
      yield put(Creators.deleteMemberMediaSuccess());
      yield put(Creators.getMemberMediaAttempt(member_id));
    } catch (err) {
      console.log(err);
      yield put(Creators.deleteMemberMediaFailure(err));
    }
  }

  // -----------
  // The Main Watcher function
  // -----------
  function* startWatchers() {
    yield takeEvery(Types.GET_MEMBER_ATTEMPT, getMemberAttempt);
    yield takeEvery(Types.GET_MEMBER_SUCCESS, getMemberSuccess);
    yield takeEvery(Types.GET_MEMBER_FAILURE, getMemberFailure);
    yield takeEvery(Types.GET_MEMBER_BIO_ATTEMPT, getMemberBioAttempt);
    yield takeEvery(Types.GET_MEMBER_BIO_SUCCESS, getMemberBioSuccess);
    yield takeEvery(Types.GET_MEMBER_BIO_FAILURE, getMemberBioFailure);
    yield takeEvery(
      Types.GET_MEMBER_COMMUNITY_ATTEMPT,
      getMemberCommunityAttempt
    );
    yield takeEvery(
      Types.GET_MEMBER_COMMUNITY_SUCCESS,
      getMemberCommunitySuccess
    );
    yield takeEvery(
      Types.GET_MEMBER_COMMUNITY_FAILURE,
      getMemberCommunityFailure
    );

    yield takeEvery(
      Types.GET_MEMBER_MUTUAL_CONNECTIONS_ATTEMPT,
      getMemberMutualConnectionsAttempt
    );
    yield takeEvery(
      Types.GET_MEMBER_MUTUAL_CONNECTIONS_SUCCESS,
      getMemberMutualConnectionsSuccess
    );
    yield takeEvery(
      Types.GET_MEMBER_MUTUAL_CONNECTIONS_FAILURE,
      getMemberMutualConnectionsFailure
    );

    yield takeEvery(Types.GET_MEMBER_PHOTOS_ATTEMPT, getMemberPhotosAttempt);
    yield takeEvery(Types.GET_MEMBER_PHOTOS_SUCCESS, getMemberPhotosSuccess);
    yield takeEvery(Types.GET_MEMBER_PHOTOS_FAILURE, getMemberPhotosFailure);

    yield takeEvery(Types.GET_MEMBER_VIDEOS_ATTEMPT, getMemberVideosAttempt);
    yield takeEvery(Types.GET_MEMBER_VIDEOS_SUCCESS, getMemberVideosSuccess);
    yield takeEvery(Types.GET_MEMBER_VIDEOS_FAILURE, getMemberVideosFailure);

    yield takeEvery(Types.GET_MEMBER_MEDIA_ATTEMPT, getMemberMediaAttempt);
    // yield takeEvery(Types.GET_MEMBER_MEDIA_SUCCESS, getMemberMediaSuccess);
    // yield takeEvery(Types.GET_MEMBER_MEDIA_FAILURE, getMemberMediaFailure);

    yield takeEvery(
      Types.GET_MEMBER_REFERENCE_ATTEMPT,
      getMemberReferenceAttempt
    );
    yield takeEvery(
      Types.GET_MEMBER_REFERENCE_SUCCESS,
      getMemberReferenceSuccess
    );
    yield takeEvery(
      Types.GET_MEMBER_REFERENCE_FAILURE,
      getMemberReferenceFailure
    );

    yield takeEvery(Types.POST_MEMBER_BIO_ATTEMPT, postMemberBioAttempt);
    yield takeEvery(Types.POST_MEMBER_BIO_SUCCESS, postMemberBioSuccess);
    yield takeEvery(Types.POST_MEMBER_BIO_FAILURE, postMemberBioFailure);

    yield takeEvery(Types.EDIT_MEMBER_BIO_ATTEMPT, editMemberBioAttempt);
    yield takeEvery(Types.EDIT_MEMBER_BIO_SUCCESS, editMemberBioSuccess);
    yield takeEvery(Types.EDIT_MEMBER_BIO_FAILURE, editMemberBioFailure);

    yield takeEvery(Types.POST_MEMBER_PHOTO_ATTEMPT, postMemberPhotoAttempt);
    yield takeEvery(Types.POST_MEMBER_PHOTO_SUCCESS, postMemberPhotoSuccess);
    yield takeEvery(Types.POST_MEMBER_PHOTO_FAILURE, postMemberPhotoFailure);

    yield takeEvery(Types.POST_MEMBER_VIDEO_ATTEMPT, postMemberVideoAttempt);
    yield takeEvery(Types.POST_MEMBER_VIDEO_SUCCESS, postMemberVideoSuccess);
    yield takeEvery(Types.POST_MEMBER_VIDEO_FAILURE, postMemberVideoFailure);

    yield takeEvery(Types.EDIT_MEMBER_PHOTO_ATTEMPT, editMemberPhotoAttempt);
    yield takeEvery(Types.EDIT_MEMBER_PHOTO_SUCCESS, editMemberPhotoSuccess);
    yield takeEvery(Types.EDIT_MEMBER_PHOTO_FAILURE, editMemberPhotoFailure);

    yield takeEvery(Types.EDIT_MEMBER_VIDEO_ATTEMPT, editMemberVideoAttempt);
    yield takeEvery(Types.EDIT_MEMBER_VIDEO_SUCCESS, editMemberVideoSuccess);
    yield takeEvery(Types.EDIT_MEMBER_VIDEO_FAILURE, editMemberVideoFailure);

    yield takeEvery(Types.DELETE_MEMBER_BIO_ATTEMPT, deleteMemberBioAttempt);
    yield takeEvery(Types.DELETE_MEMBER_BIO_SUCCESS, deleteMemberBioSuccess);
    yield takeEvery(Types.DELETE_MEMBER_BIO_FAILURE, deleteMemberBioFailure);

    yield takeEvery(
      Types.DELETE_MEMBER_PHOTO_ATTEMPT,
      deleteMemberPhotoAttempt
    );
    yield takeEvery(
      Types.DELETE_MEMBER_PHOTO_SUCCESS,
      deleteMemberPhotoSuccess
    );
    yield takeEvery(
      Types.DELETE_MEMBER_PHOTO_FAILURE,
      deleteMemberPhotoFailure
    );

    yield takeEvery(
      Types.DELETE_MEMBER_VIDEO_ATTEMPT,
      deleteMemberVideoAttempt
    );
    yield takeEvery(
      Types.DELETE_MEMBER_VIDEO_SUCCESS,
      deleteMemberVideoSuccess
    );
    yield takeEvery(
      Types.DELETE_MEMBER_VIDEO_FAILURE,
      deleteMemberVideoFailure
    );

    yield takeEvery(Types.GET_MEMBER_BADGE_ATTEMPT, getMemberBadgeAttempt);
    yield takeEvery(Types.GET_MEMBER_BADGE_SUCCESS, getMemberBadgeSuccess);
    yield takeEvery(Types.GET_MEMBER_BADGE_FAILURE, getMemberBadgeFailure);

    yield takeEvery(Types.GET_MEMBER_CV_ATTEMPT, getMemberCvAttempt);
    yield takeEvery(Types.GET_MEMBER_CV_SUCCESS, getMemberCvSuccess);
    yield takeEvery(Types.GET_MEMBER_CV_FAILURE, getMemberCvFailure);

    yield takeLatest(
      Types.DELETE_MEMBER_MEDIA_ATTEMPT,
      deleteMemberMediaAttempt
    );
  }

  return {
    startWatchers,

    getMemberAttempt,
    getMemberSuccess,
    getMemberFailure,

    getMemberBioAttempt,
    getMemberBioSuccess,
    getMemberBioFailure,

    getMemberPhotosAttempt,
    getMemberPhotosSuccess,
    getMemberPhotosFailure,

    getMemberVideosAttempt,
    getMemberVideosSuccess,
    getMemberVideosFailure,

    getMemberCommunityAttempt,
    getMemberCommunitySuccess,
    getMemberCommunityFailure,

    getMemberMutualConnectionsAttempt,
    getMemberMutualConnectionsSuccess,
    getMemberMutualConnectionsFailure,

    getMemberReferenceAttempt,
    getMemberReferenceSuccess,
    getMemberReferenceFailure,

    postMemberBioAttempt,
    postMemberBioSuccess,
    postMemberBioFailure,

    editMemberBioAttempt,
    editMemberBioSuccess,
    editMemberBioFailure,

    postMemberPhotoAttempt,
    postMemberPhotoSuccess,
    postMemberPhotoFailure,

    postMemberVideoAttempt,
    postMemberVideoSuccess,
    postMemberVideoFailure,

    editMemberPhotoAttempt,
    editMemberPhotoSuccess,
    editMemberPhotoFailure,

    editMemberVideoAttempt,
    editMemberVideoSuccess,
    editMemberVideoFailure,

    deleteMemberBioAttempt,
    deleteMemberBioSuccess,
    deleteMemberBioFailure,

    deleteMemberPhotoAttempt,
    deleteMemberPhotoSuccess,
    deleteMemberPhotoFailure,

    deleteMemberVideoAttempt,
    deleteMemberVideoSuccess,
    deleteMemberVideoFailure,

    getMemberBadgeAttempt,
    getMemberBadgeSuccess,
    getMemberBadgeFailure,

    getMemberCvAttempt,
    getMemberCvSuccess,
    getMemberCvFailure
  };
};
