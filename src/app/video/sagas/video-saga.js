import { takeEvery, put, call, select } from 'redux-saga/effects';
import { omit, head, pickAll } from 'ramda';
import common from 'app/common';
import { translate, translatef } from 'app/intl';
import { log } from 'app/common/util/logger';
import { Types, Creators } from '../actions';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifyError, notifySuccess }
} = common.util;

export default api => {
  function* getVideosAttempt({ categoryId }) {
    try {
      const response = yield call(api.getVideos, categoryId);
      const {
        data: { videos }
      } = yield checkResponse(response);
      yield put(Creators.getVideosSuccess(videos));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getVideosFailure(err));
    }
  }

  function* getAllVideosAttempt() {
    const {
      video: { selectedSector }
    } = yield select();

    try {
      const response = yield call(api.getAllVideos, selectedSector);
      const {
        data: { videos }
      } = yield checkResponse(response);

      yield put(Creators.getAllVideosSuccess(videos));
    } catch (err) {
      yield put(notifyError(yield translate(err)));
      yield put(Creators.getAllVideosFailure(err));
    }
  }

  function* reportVideoFlag({ videoId, user }) {
    log({ user, videoId });
  }

  function* createVideo({ data }) {
    const {
      video: { selectedSubCategory }
    } = yield select();

    const formData = convertToFormData({
      video: head(data.file || []),
      thumbnail: head(data.thumbnail || []),
      ...omit(['file', 'thumbnail'], data)
    });
    try {
      const resp = yield call(api.createVideo, selectedSubCategory, formData);
      const newVideo = yield checkResponse(resp);
      yield put(Creators.createVideoSuccess(newVideo.data));
      yield put(notifySuccess(yield translate('video_created')));
      // yield put(Creators.selectCategory(data.category));
    } catch (err) {
      yield put(
        notifyError(yield translatef('video_upload_failed', [err.toString()]))
      );
      yield put(Creators.createVideoFailure(err));
    }
  }

  // Update video in the API
  function* updateVideo({ data }) {
    const {
      video: { selectedSubCategory }
    } = yield select();
    const postData = convertToFormData({
      ...omit(['thumbnail'], data),
      thumbnail:
        typeof data.thumbnail === 'string' || data.thumbnail === null
          ? data.thumbnail
          : head(data.thumbnail || [])
    });

    try {
      const resp = yield call(
        api.updateVideo,
        selectedSubCategory,
        data.media_id,
        postData
      );
      const { data: video } = yield checkResponse(resp);
      yield put(Creators.updateVideoSuccess(video));
      yield put(notifySuccess(yield translate('video_updated')));
      yield put(Creators.editVideo(0));
    } catch (err) {
      yield put(
        notifyError(
          yield translatef('video_upload_failed_reason', [err.toString()])
        )
      );
      yield put(Creators.updateVideoFailure(err));
    }
  }

  function* deleteVideo({ categoryId, videoId }) {
    try {
      const resp = yield call(api.deleteVideo, categoryId, videoId);
      yield checkResponse(resp);
      yield put(Creators.deleteVideoSuccess(videoId));
      yield put(notifySuccess(yield translate('video_deleted')));
    } catch (err) {
      yield put(
        notifyError(
          yield translatef('video_delete_failed_reason', [err.toString()])
        )
      );
      yield put(Creators.deleteVideoFailure(err));
    }
  }

  function* likeVideo({ videoId }) {
    const {
      profile: {
        user: { member_id }
      }
    } = yield select();
    try {
      const resp = yield call(api.likeMedia, member_id, videoId);
      yield checkResponse(resp);
    } catch (err) {
      yield put(
        notifyError(yield translatef('video_like_failed', [err.toString()]))
      );
    }
  }

  function* unlikeVideo({ videoId }) {
    const {
      profile: {
        user: { member_id }
      }
    } = yield select();
    try {
      const resp = yield call(api.unlikeMedia, member_id, videoId);
      yield checkResponse(resp);
    } catch (err) {
      yield put(
        notifyError(yield translatef('video_unlike_failed', [err.toString()]))
      );
    }
  }

  function* viewVideo({ videoId }) {
    const {
      profile: {
        user: { member_id }
      }
    } = yield select();
    try {
      const resp = yield call(api.viewMedia, member_id, videoId);
      yield checkResponse(resp);
    } catch (err) {
      yield put(
        notifyError(
          yield translatef('Could not set this video as viewed.', [
            err.toString()
          ])
        )
      );
    }
  }

  function* startWatchers() {
    yield takeEvery(Types.CREATE_VIDEO, createVideo);
    yield takeEvery(Types.DELETE_VIDEO, deleteVideo);
    yield takeEvery(Types.GET_VIDEOS_ATTEMPT, getVideosAttempt);
    yield takeEvery(Types.REPORT_VIDEO_FLAG, reportVideoFlag);
    yield takeEvery(Types.UPDATE_VIDEO, updateVideo);
    yield takeEvery(Types.LIKE_VIDEO, likeVideo);
    yield takeEvery(Types.UNLIKE_VIDEO, unlikeVideo);
    yield takeEvery(Types.GET_ALL_VIDEOS_ATTEMPT, getAllVideosAttempt);
    yield takeEvery(Types.VIEW_VIDEO, viewVideo);
  }

  return {
    startWatchers,
    getVideosAttempt,
    reportVideoFlag
  };
};
