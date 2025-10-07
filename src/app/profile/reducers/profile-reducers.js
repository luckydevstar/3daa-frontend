import { Types } from '../actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import { prepend, filter, or, propEq } from 'ramda';
import { LOCATION_CHANGE } from 'react-router-redux';

export const INITIAL_STATE = Immutable({
  profile: null,
  bio: [],
  references: [],
  photos: null,
  coverPhotos: null,
  videos: null,
  mediaItems: [],
  mediaDocuments: [],
  community: [],
  communityTotal: null,
  mutualConnections: [],
  gettingMember: false,
  gettingMemberBio: false,
  gettingReferences: false,
  gettingAllMedia: false,
  gettingPhotos: false,
  gettingVideos: false,
  gettingCommunity: false,
  gettingMutualConnections: false,
  postingMemberPhoto: false,
  postingMemberVideo: false,
  postingMemberBio: false,
  editingMemberBio: false,
  deletingMemberBio: false,
  errorCode: null,
  recentlyUploaded: null,
  addingPhoto: false,
  editingPhoto: false,
  editingVideo: false,
  deletingPhoto: false,
  deletingVideo: false,
  deletingFile: false,
  viewingMedia: null,
  addingBio: false,
  editingBio: false,
  editingStatement: false,
  badges: null,
  gettingBadges: false,
  cv: null,
  gettingCV: false,
  location: null,
  updateMediaModal: true
});

/**
 * Member Profile (attempt, success, failure)
 */

const getMemberAttempt = state => state.merge({ gettingMember: true });

const getMemberSuccess = (state, action) =>
  state.merge({
    gettingMember: false,
    profile: action.response || action.data.data
  });

const getMemberFailure = (state, action) =>
  state.merge({
    gettingMember: false,
    errorCode: action.errorCode
  });

/**
 * Member Bio (attempt, success, failure)
 */

const getMemberBioAttempt = state =>
  state.merge({
    gettingMemberBio: true
  });

const getMemberBioSuccess = (state, action) =>
  state.merge({
    gettingMemberBio: false,
    bio: action.response.data
  });

const getMemberBioFailure = (state, action) =>
  state.merge({
    gettingMemberBio: false,
    errorCode: action.errorCode
  });

/**
 * Member Photos (attempt, success, failure)
 */

const getMemberPhotosAttempt = state =>
  state.merge({
    gettingPhotos: true
  });

const getMemberPhotosSuccess = (state, action) => {
  const {
    response: {
      data: { photos }
    }
  } = action;

  return state.merge({
    gettingPhotos: false,
    photos,
    coverPhotos: photos.filter(photo => photo.cover === 1)
  });
};

const getMemberPhotosFailure = (state, action) =>
  state.merge({
    gettingPhotos: false,
    errorCode: action.errorCode
  });

/**
 * Member videos (attempt, success, failure)
 */

const getMemberVideosAttempt = state =>
  state.merge({
    gettingVideos: true,
    errorCode: null,
    videos: INITIAL_STATE.videos
  });

const getMemberVideosSuccess = (state, action) => {
  const {
    response: {
      data: { videos }
    }
  } = action;

  return state.merge({
    gettingVideos: false,
    errorCode: null,
    videos
  });
};

const getMemberVideosFailure = (state, action) =>
  state.merge({
    gettingVideos: false,
    errorCode: action.errorCode
  });

/**
 * Member References (attempt, success, failure)
 */

const getMemberReferenceAttempt = state =>
  state.merge({
    gettingReferences: true
  });

const getMemberReferenceSuccess = (state, action) =>
  state.merge({
    gettingReferences: false,
    references: action.response.data
  });

const getMemberReferenceFailure = (state, action) =>
  state.merge({
    gettingReferences: false,
    errorCode: action.errorCode
  });

/**
 * Member Bio (Post/Edit)
 */

const postMemberBioAttempt = state =>
  state.merge({ postingMemberBio: true, errorCode: null });

const postMemberBioSuccess = state =>
  state.merge({ postingMemberBio: false, errorCode: null });

const postMemberBioFailure = (state, action) =>
  state.merge({ postingMemberBio: false, errorCode: action.errorCode });

const editMemberBioAttempt = state =>
  state.merge({ editingMemberBio: true, errorCode: null });

const editMemberBioSuccess = state =>
  state.merge({ editingMemberBio: false, errorCode: null });

const editMemberBioFailure = (state, action) =>
  state.merge({ editingMemberBio: false, errorCode: action.errorCode });

const deleteMemberBioAttempt = state =>
  state.merge({ deletingMemberBio: true, errorCode: null });

const deleteMemberBioSuccess = state =>
  state.merge({ deletingMemberBio: false, errorCode: null });

const deleteMemberBioFailure = (state, action) =>
  state.merge({ deletingMemberBio: false, errorCode: action.errorCode });

/**
 * Member Community (attempt, success, failure)
 */

const getMemberCommunityAttempt = state =>
  state.merge({
    gettingCommunity: true,
    communityTotal: INITIAL_STATE.communityTotal,
    community: INITIAL_STATE.community
  });

const getMemberCommunitySuccess = (state, action) => {
  const {
    counts: { friends: totalFriends },
    friends
  } = action.response;
  return state.merge({
    gettingCommunity: false,
    communityTotal: totalFriends || 0,
    community: friends || []
  });
};

const getMemberCommunityFailure = (state, action) =>
  state.merge({
    gettingCommunity: false,
    errorCode: action.errorCode
  });

const getMemberMutualConnectionsAttempt = state =>
  state.merge({
    gettingMutualConnections: true,
    mutualConnections: INITIAL_STATE.mutualConnections
  });

const getMemberMutualConnectionsSuccess = (state, action) => {
  const { mutual } = action.response;
  return state.merge({
    gettingMutualConnections: false,
    mutualConnections: mutual || []
  });
};

const getMemberMutualConnectionsFailure = (state, action) =>
  state.merge({
    gettingMutualConnections: false,
    errorCode: action.errorCode
  });

/**
 * Member Photos - Add, Edit, View
 */

const postMemberPhotoAttempt = state =>
  state.merge({ postingMemberPhoto: true, errorCode: null });

const postMemberPhotoSuccess = (state, action) => {
  const {
    response: {
      data: { data }
    }
  } = action;

  return state.merge({
    postingMemberPhoto: false,
    errorCode: null,
    recentlyUploaded: data.cloudinary_file_id,
    photos: prepend(data, state.photos),
    coverPhotos: prepend(data, state.coverPhotos)
  });
};

const postMemberPhotoFailure = (state, action) =>
  state.merge({
    postingMemberPhoto: false,
    errorCode: action.errorCode
  });

const postMemberVideoAttempt = state =>
  state.merge({ postingMemberVideo: true, errorCode: null });

const postMemberVideoSuccess = (state, action) => {
  const {
    response: {
      data: { data }
    }
  } = action;

  return state.merge({
    postingMemberVideo: false,
    errorCode: null,
    recentlyUploaded: data.cloudinary_file_id,
    videos: prepend(data, state.videos)
  });
};

const postMemberVideoFailure = (state, action) =>
  state.merge({
    postingMemberVideo: false,
    errorCode: action.errorCode
  });

const editMemberPhotoAttempt = state =>
  state.merge({ editingPhoto: true, errorCode: null });

const editMemberPhotoSuccess = state => state.merge({ editingPhoto: false });

const editMemberPhotoFailure = (state, action) =>
  state.merge({
    editingPhoto: false,
    errorCode: action.errorCode
  });

const editMemberVideoAttempt = state =>
  state.merge({ editingVideo: true, errorCode: null });

const editMemberVideoSuccess = state => state.merge({ editingVideo: false });

const editMemberVideoFailure = (state, action) =>
  state.merge({
    editingVideo: false,
    errorCode: action.errorCode
  });

const deleteMemberPhotoAttempt = state =>
  state.merge({ deletingPhoto: true, errorCode: null });

const deleteMemberPhotoSuccess = state => state.merge({ deletingPhoto: false });

const deleteMemberPhotoFailure = (state, action) =>
  state.merge({
    deletingPhoto: false,
    errorCode: action.errorCode
  });

const deleteMemberVideoAttempt = state =>
  state.merge({ deletingVideo: true, errorCode: null });

const deleteMemberVideoSuccess = state => state.merge({ deletingVideo: false });

const deleteMemberVideoFailure = (state, action) =>
  state.merge({
    deletingVideo: false,
    errorCode: action.errorCode
  });

const viewMedia = (state, action) =>
  state.merge({
    viewingMedia: !state.viewingMedia
      ? action.media
      : INITIAL_STATE.viewingMedia
  });

const toggleAddPhoto = state =>
  state.merge({ addingPhoto: !state.addingPhoto });

const toggleAddVideo = state =>
  state.merge({ addingVideo: !state.addingVideo });

const toggleNewBio = (state, action) =>
  state.merge({
    addingBio: !state.addingBio ? action.bioType : INITIAL_STATE.addingBio
  });

const toggleEditBio = (state, action) =>
  state.merge({
    editingBio: !state.editingBio ? action.bio : INITIAL_STATE.editingBio
  });

const updateLocalProfile = (state, action) => {
  const newProfileState = {
    ...state.profile,
    ...action.profile
  };
  return state.merge({ profile: newProfileState });
};

const toggleEditStatement = state =>
  state.merge({ editingStatement: !state.editingStatement });

const getMemberBadgeAttempt = state => state.merge({ gettingBadges: true });

const getMemberBadgeSuccess = (state, action) =>
  state.merge({
    gettingBadges: false,
    badges: action.response || action.data.data
  });

const getMemberBadgeFailure = (state, action) =>
  state.merge({
    gettingBadges: false,
    errorCode: action.errorCode
  });

const getMemberCvAttempt = state => state.merge({ gettingCV: true });

const getMemberCvSuccess = (state, action) =>
  state.merge({
    gettingCV: false,
    cv: action.response || action.data.data
  });

const getMemberCvFailure = (state, action) =>
  state.merge({
    gettingCV: false,
    errorCode: action.errorCode
  });

const routerLocations = (state, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return state.merge({
        location: action.payload
      });
    default:
      return state;
  }
};

const getMemberMediaAttempt = state =>
  state.merge({
    gettingAllMedia: true
  });

const getMemberMediaSuccess = (state, { media }) =>
  state.merge({
    mediaItems: filter(mediaItem =>
      or(propEq('type', 'photo')(mediaItem), propEq('type', 'video')(mediaItem))
    )(media),
    gettingAllMedia: false
  });

const getMemberMediaFailure = state =>
  state.merge({
    gettingAllMedia: false
  });

const deleteMemberMediaAttempt = state =>
  state.merge({
    deletingFile: true
  });

const deleteMemberMediaSuccess = state =>
  state.merge({
    deletingFile: false
  });

const deleteMemberMediaFailure = state =>
  state.merge({
    deletingFile: false
  });

const openUpdateMediaModal = state =>
  state.merge({
    updateMediaModal: true
  });

const closeUpdateMediaModal = state =>
  state.merge({
    updateMediaModal: false
  });

export default createReducer(INITIAL_STATE, {
  [Types.GET_MEMBER_ATTEMPT]: getMemberAttempt,
  [Types.GET_MEMBER_SUCCESS]: getMemberSuccess,
  [Types.GET_MEMBER_FAILURE]: getMemberFailure,

  [Types.GET_MEMBER_BIO_ATTEMPT]: getMemberBioAttempt,
  [Types.GET_MEMBER_BIO_SUCCESS]: getMemberBioSuccess,
  [Types.GET_MEMBER_BIO_FAILURE]: getMemberBioFailure,

  [Types.GET_MEMBER_PHOTOS_ATTEMPT]: getMemberPhotosAttempt,
  [Types.GET_MEMBER_PHOTOS_SUCCESS]: getMemberPhotosSuccess,
  [Types.GET_MEMBER_PHOTOS_FAILURE]: getMemberPhotosFailure,

  [Types.GET_MEMBER_VIDEOS_ATTEMPT]: getMemberVideosAttempt,
  [Types.GET_MEMBER_VIDEOS_SUCCESS]: getMemberVideosSuccess,
  [Types.GET_MEMBER_VIDEOS_FAILURE]: getMemberVideosFailure,

  [Types.GET_MEMBER_COMMUNITY_ATTEMPT]: getMemberCommunityAttempt,
  [Types.GET_MEMBER_COMMUNITY_SUCCESS]: getMemberCommunitySuccess,
  [Types.GET_MEMBER_COMMUNITY_FAILURE]: getMemberCommunityFailure,

  [Types.GET_MEMBER_MUTUAL_CONNECTIONS_ATTEMPT]: getMemberMutualConnectionsAttempt,
  [Types.GET_MEMBER_MUTUAL_CONNECTIONS_SUCCESS]: getMemberMutualConnectionsSuccess,
  [Types.GET_MEMBER_MUTUAL_CONNECTIONS_FAILURE]: getMemberMutualConnectionsFailure,

  [Types.GET_MEMBER_REFERENCE_ATTEMPT]: getMemberReferenceAttempt,
  [Types.GET_MEMBER_REFERENCE_SUCCESS]: getMemberReferenceSuccess,
  [Types.GET_MEMBER_REFERENCE_FAILURE]: getMemberReferenceFailure,

  [Types.POST_MEMBER_BIO_ATTEMPT]: postMemberBioAttempt,
  [Types.POST_MEMBER_BIO_SUCCESS]: postMemberBioSuccess,
  [Types.POST_MEMBER_BIO_FAILURE]: postMemberBioFailure,

  [Types.POST_MEMBER_PHOTO_ATTEMPT]: postMemberPhotoAttempt,
  [Types.POST_MEMBER_PHOTO_SUCCESS]: postMemberPhotoSuccess,
  [Types.POST_MEMBER_PHOTO_FAILURE]: postMemberPhotoFailure,

  [Types.POST_MEMBER_VIDEO_ATTEMPT]: postMemberVideoAttempt,
  [Types.POST_MEMBER_VIDEO_SUCCESS]: postMemberVideoSuccess,
  [Types.POST_MEMBER_VIDEO_FAILURE]: postMemberVideoFailure,

  [Types.EDIT_MEMBER_BIO_ATTEMPT]: editMemberBioAttempt,
  [Types.EDIT_MEMBER_BIO_SUCCESS]: editMemberBioSuccess,
  [Types.EDIT_MEMBER_BIO_FAILURE]: editMemberBioFailure,

  [Types.EDIT_MEMBER_PHOTO_ATTEMPT]: editMemberPhotoAttempt,
  [Types.EDIT_MEMBER_PHOTO_SUCCESS]: editMemberPhotoSuccess,
  [Types.EDIT_MEMBER_PHOTO_FAILURE]: editMemberPhotoFailure,

  [Types.EDIT_MEMBER_VIDEO_ATTEMPT]: editMemberVideoAttempt,
  [Types.EDIT_MEMBER_VIDEO_SUCCESS]: editMemberVideoSuccess,
  [Types.EDIT_MEMBER_VIDEO_FAILURE]: editMemberVideoFailure,

  [Types.DELETE_MEMBER_PHOTO_ATTEMPT]: deleteMemberPhotoAttempt,
  [Types.DELETE_MEMBER_PHOTO_SUCCESS]: deleteMemberPhotoSuccess,
  [Types.DELETE_MEMBER_PHOTO_FAILURE]: deleteMemberPhotoFailure,

  [Types.DELETE_MEMBER_VIDEO_ATTEMPT]: deleteMemberVideoAttempt,
  [Types.DELETE_MEMBER_VIDEO_SUCCESS]: deleteMemberVideoSuccess,
  [Types.DELETE_MEMBER_VIDEO_FAILURE]: deleteMemberVideoFailure,

  [Types.DELETE_MEMBER_BIO_ATTEMPT]: deleteMemberBioAttempt,
  [Types.DELETE_MEMBER_BIO_SUCCESS]: deleteMemberBioSuccess,
  [Types.DELETE_MEMBER_BIO_FAILURE]: deleteMemberBioFailure,

  [Types.TOGGLE_ADD_PHOTO]: toggleAddPhoto,
  [Types.TOGGLE_ADD_VIDEO]: toggleAddVideo,
  [Types.VIEW_MEDIA]: viewMedia,

  [Types.TOGGLE_NEW_BIO]: toggleNewBio,
  [Types.TOGGLE_EDIT_BIO]: toggleEditBio,

  [Types.UPDATE_LOCAL_PROFILE]: updateLocalProfile,
  [Types.TOGGLE_EDIT_STATEMENT]: toggleEditStatement,

  [Types.GET_MEMBER_BADGE_ATTEMPT]: getMemberBadgeAttempt,
  [Types.GET_MEMBER_BADGE_SUCCESS]: getMemberBadgeSuccess,
  [Types.GET_MEMBER_BADGE_FAILURE]: getMemberBadgeFailure,

  [Types.GET_MEMBER_CV_ATTEMPT]: getMemberCvAttempt,
  [Types.GET_MEMBER_CV_SUCCESS]: getMemberCvSuccess,
  [Types.GET_MEMBER_CV_FAILURE]: getMemberCvFailure,

  [Types.GET_MEMBER_MEDIA_ATTEMPT]: getMemberMediaAttempt,
  [Types.GET_MEMBER_MEDIA_SUCCESS]: getMemberMediaSuccess,
  [Types.GET_MEMBER_MEDIA_FAILURE]: getMemberMediaFailure,

  [Types.DELETE_MEMBER_MEDIA_ATTEMPT]: deleteMemberMediaAttempt,
  [Types.DELETE_MEMBER_MEDIA_SUCCESS]: deleteMemberMediaSuccess,
  [Types.DELETE_MEMBER_MEDIA_FAILURE]: deleteMemberMediaFailure,

  [Types.OPEN_UPDATE_MEDIA_MODAL]: openUpdateMediaModal,
  [Types.CLOSE_UPDATE_MEDIA_MODAL]: closeUpdateMediaModal,

  [LOCATION_CHANGE]: routerLocations
});
