import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import {
  pipe,
  prop,
  concat,
  uniqBy,
  propEq,
  findIndex,
  update,
  find,
  dec,
  inc,
  filter,
  not,
  omit
} from 'ramda';
import { Types } from '../actions';
import common from 'app/common';

const {
  util: {
    helpers: { isWhitespace, deepMerge }
  }
} = common;

// Add media to existing array and remove duplicates
const addMedia = arr => pipe(concat(arr), uniqBy(prop('media_id')));

// Finds a video
const findVideo = (videoId, arr) => find(propEq('media_id', videoId))(arr);

// Finds a video at an ID and merges it with a passed object
const mergeVideoById = (id, obj) => arr => {
  const index = findIndex(propEq('media_id', id))(arr);
  const origin = findVideo(id, arr);
  return update(index, deepMerge(origin, obj), arr);
};

export const INITIAL_STATE = Immutable({
  uiLoadingVideos: false,
  uiLoadingCategories: false,
  uiEditingCategory: false,
  uiDeletingCategory: false,
  videos: [],
  categories: null,
  deletingCategory: 0,
  selectedCategory: 0,
  editingCategory: 0,
  editingVideo: 0,
  likingVideo: false,
  searchTerm: '',
  addingCategory: false,
  addingVideo: false,
  imagePreview: false,
  selectedSector: 0,
  selectedSubCategory: 0,
  isCategoryMenu: false,
  editingSubCategory: false,
  selectedHeader: null,
  attemptingGetQualifications: false,
  qualifications: [],
  selectedQualifications: []
});

const getVideosAttempt = state => state.merge({ uiLoadingVideos: true });

const getVideosSuccess = (state, { videos }) =>
  state.merge({
    uiLoadingVideos: false,
    videos: addMedia(state.videos)(videos)
  });

const getVideosFailure = state => state.merge({ uiLoadingVideos: false });

const getAllVideosAttempt = state => state.merge({ uiLoadingVideos: true });

const getAllVideosSuccess = (state, { videos }) =>
  state.merge({
    uiLoadingVideos: false,
    videos
  });

const getAllVideosFailure = state => state.merge({ uiLoadingVideos: false });

const getCategoriesAttempt = state =>
  state.merge({ uiLoadingCategories: true });

const getAllCategoriesAttempt = state =>
  state.merge({ uiLoadingCategories: true });

const getCategoriesSuccess = (state, { categories }) =>
  state.merge({
    uiLoadingCategories: false,
    categories
  });

const getCategoriesFailure = state =>
  state.merge({ uiLoadingCategories: false });

const createCategory = state => state.merge({ uiEditingCategory: true });

const createCategorySuccess = (state, { category }) =>
  state.merge({
    uiEditingCategory: false,
    categories: state.categories.concat(category),
    addingCategory: false
  });

const createCategoryFailure = state =>
  state.merge({ uiEditingCategory: false });

const confirmDeleteCategory = (state, { categoryId }) =>
  state.merge({ deletingCategory: categoryId });

const deleteCategory = state => state.merge({ uiDeletingCategory: true });

const deleteCategorySuccess = (state, { categoryId }) =>
  state.merge({
    deletingCategory: 0,
    uiDeletingCategory: false,
    categories: filter(pipe(propEq('video_category_id', categoryId), not))(
      state.categories
    ),
    addingCategory: false
  });

const deleteCategoryFailure = state =>
  state.merge({
    uiDeletingCategory: false,
    deletingCategory: 0
  });

const filterVideos = (state, { query }) =>
  state.merge({
    searchTerm: isWhitespace(query) && query.length ? state.searchTerm : query
  });

const resetVideosFilter = state => state.merge({ searchTerm: '' });

const resetVideos = state => state.merge({ videos: INITIAL_STATE.videos });

const resetCategories = state =>
  state.merge({ categories: INITIAL_STATE.categories });

const selectSector = (state, { sectorId }) =>
  state.merge({
    selectedSector: sectorId
  });

const selectCategory = (state, { categoryId }) =>
  state.merge({
    selectedCategory: categoryId
  });

const selectSubCategory = (state, { subCategoryId }) =>
  state.merge({
    selectedSubCategory: subCategoryId
  });

const editCategory = (state, { categoryId }) =>
  state.merge({ editingCategory: categoryId, imagePreview: false });

const editVideo = (state, { videoId }) =>
  state.merge({ editingVideo: videoId });

const toggleAddCategory = state =>
  state.merge({ addingCategory: !state.addingCategory, imagePreview: false });

const toggleAddVideo = state =>
  state.merge({ addingVideo: !state.addingVideo });

const createVideo = state => state.merge({ uiLoadingVideos: true });

const createVideoSuccess = (state, { video }) =>
  state.merge({
    uiLoadingVideos: false,
    videos: state.videos.concat(video),
    addingVideo: false
  });

const createVideoFailure = state => state.merge({ uiLoadingVideos: false });

const deleteVideo = state => state.merge({ uiLoadingVideos: true });

const deleteVideoSuccess = (state, { videoId }) =>
  state.merge({
    uiLoadingVideos: false,
    videos: filter(pipe(propEq('media_id', videoId), not))(state.videos)
  });

const deleteVideoFailure = state => state.merge({ uiLoadingVideos: false });

const updateCategory = state => state.merge({ uiEditingCategory: true });

const updateCategories = (id, obj) => arr => {
  const index = findIndex(propEq('video_category_id', id))(arr);
  return update(index, obj, arr);
};

const updateCategorySuccess = (state, { category }) =>
  state.merge({
    uiEditingCategory: false,
    categories: updateCategories(
      category.video_category_id,
      category
    )(state.categories),
    addingVideo: false,
    addingCategory: false,
    imagePreview: false,
    deletingCategory: 0,
    editingCategory: 0,
    uiDeletingCategory: false
  });

const updateCategoryFailure = state =>
  state.merge({ uiEditingCategory: false, imagePreview: false });

const updateVideo = (id, obj) => arr => {
  const index = findIndex(propEq('media_id', id))(arr);
  if (index !== -1) {
    return update(index, obj, arr);
  }
  return arr;
};

const updateVideoAttempt = state =>
  state.merge({
    uiLoadingVideos: true
  });

const updateVideoSuccess = (state, { video }) =>
  state.merge({
    videos: updateVideo(video.media_id, video)(state.videos),
    addingVideo: false,
    uiLoadingVideos: false
  });

const updateVideoFailure = state => state.merge({ uiLoadingVideos: false });

const likeVideo = (state, { videoId }) =>
  state.merge({
    videos: mergeVideoById(videoId, {
      member_actions: { liked: 1 },
      liked: inc(findVideo(videoId, state.videos).liked)
    })(state.videos)
  });

const unlikeVideo = (state, { videoId }) =>
  state.merge({
    videos: mergeVideoById(videoId, {
      member_actions: { liked: 0 },
      liked: dec(findVideo(videoId, state.videos).liked)
    })(state.videos)
  });

const viewVideo = (state, { videoId }) =>
  state.merge({
    videos: mergeVideoById(videoId, {
      member_actions: { viewed: 1 },
      viewed: dec(findVideo(videoId, state.videos).viewed)
    })(state.videos)
  });

const setImagePreview = (state, { imagePreview }) =>
  state.merge({ imagePreview });

const toggleCategoryMenu = state =>
  state.merge({ isCategoryMenu: !state.isCategoryMenu });

const setEditingSubCategory = (state, { data }) =>
  state.merge({ editingSubCategory: data });

const setSelectedHeader = (state, { data }) =>
  state.merge({ selectedHeader: data });

// ALL qualification(s)
const getVideoAllQualificationsAttempt = state =>
  state.merge({
    attemptingGetQualifications: true,
    qualifications: null
  });

const getVideoAllQualificationsSuccess = (state, { qualifications }) => {
  const newQualifications = qualifications.map(qualification =>
    Object.assign(
      {},
      omit('latest_issue', qualification),
      qualification.latest_issue
    )
  );
  return state.merge({
    attemptingGetQualifications: false,
    qualifications: newQualifications
  });
};

const getVideoAllQualificationsFailure = (state, action) =>
  state.merge({
    attemptingGetQualifications: false,
    qualifications: []
  });

const setVideoQualifications = (state, { qualifications }) =>
  state.merge({
    selectedQualifications: qualifications
  });

const getVideoCategorySuccess = (state, { category }) =>
  state.merge({
    categories: state.categories.map(cat => {
      if (cat.video_category_id === category.video_category_id) {
        return {
          ...cat,
          subcategories: category.subcategories
        };
      }
      return cat;
    })
  });

const ACTION_HANDLERS = {
  [Types.CREATE_CATEGORY]: createCategory,
  [Types.CREATE_CATEGORY_FAILURE]: createCategoryFailure,
  [Types.CREATE_CATEGORY_SUCCESS]: createCategorySuccess,
  [Types.CREATE_VIDEO]: createVideo,
  [Types.CREATE_VIDEO_FAILURE]: createVideoFailure,
  [Types.CREATE_VIDEO_SUCCESS]: createVideoSuccess,
  [Types.CONFIRM_DELETE_CATEGORY]: confirmDeleteCategory,
  [Types.DELETE_CATEGORY]: deleteCategory,
  [Types.DELETE_CATEGORY_FAILURE]: deleteCategoryFailure,
  [Types.DELETE_CATEGORY_SUCCESS]: deleteCategorySuccess,
  [Types.DELETE_VIDEO]: deleteVideo,
  [Types.DELETE_VIDEO_FAILURE]: deleteVideoFailure,
  [Types.DELETE_VIDEO_SUCCESS]: deleteVideoSuccess,
  [Types.EDIT_CATEGORY]: editCategory,
  [Types.EDIT_VIDEO]: editVideo,
  [Types.FILTER_VIDEOS]: filterVideos,
  [Types.GET_CATEGORIES_ATTEMPT]: getCategoriesAttempt,
  [Types.GET_ALL_CATEGORIES_ATTEMPT]: getAllCategoriesAttempt,
  [Types.GET_CATEGORIES_FAILURE]: getCategoriesFailure,
  [Types.GET_CATEGORIES_SUCCESS]: getCategoriesSuccess,
  [Types.GET_VIDEOS_ATTEMPT]: getVideosAttempt,
  [Types.GET_VIDEOS_FAILURE]: getVideosFailure,
  [Types.GET_VIDEOS_SUCCESS]: getVideosSuccess,
  [Types.RESET_CATEGORIES]: resetCategories,
  [Types.RESET_VIDEOS_FILTER]: resetVideosFilter,
  [Types.RESET_VIDEOS]: resetVideos,
  [Types.SELECT_SECTOR]: selectSector,
  [Types.SELECT_CATEGORY]: selectCategory,
  [Types.SELECT_SUB_CATEGORY]: selectSubCategory,
  [Types.TOGGLE_ADD_CATEGORY]: toggleAddCategory,
  [Types.TOGGLE_ADD_VIDEO]: toggleAddVideo,
  [Types.UPDATE_CATEGORY]: updateCategory,
  [Types.UPDATE_CATEGORY_FAILURE]: updateCategoryFailure,
  [Types.UPDATE_CATEGORY_SUCCESS]: updateCategorySuccess,
  [Types.UPDATE_VIDEO]: updateVideoAttempt,
  [Types.UPDATE_VIDEO_FAILURE]: updateVideoFailure,
  [Types.UPDATE_VIDEO_SUCCESS]: updateVideoSuccess,
  [Types.LIKE_VIDEO]: likeVideo,
  [Types.UNLIKE_VIDEO]: unlikeVideo,
  [Types.VIEW_VIDEO]: viewVideo,
  [Types.SET_IMAGE_PREVIEW]: setImagePreview,
  [Types.GET_ALL_VIDEOS_ATTEMPT]: getAllVideosAttempt,
  [Types.GET_ALL_VIDEOS_SUCCESS]: getAllVideosSuccess,
  [Types.GET_ALL_VIDEOS_FAILURE]: getAllVideosFailure,
  [Types.TOGGLE_CATEGORY_MENU]: toggleCategoryMenu,
  [Types.SET_EDITING_SUB_CATEGORY]: setEditingSubCategory,
  [Types.SET_SELECTED_HEADER]: setSelectedHeader,
  [Types.GET_VIDEO_ALL_QUALIFICATIONS_ATTEMPT]: getVideoAllQualificationsAttempt,
  [Types.GET_VIDEO_ALL_QUALIFICATIONS_SUCCESS]: getVideoAllQualificationsSuccess,
  [Types.GET_VIDEO_ALL_QUALIFICATIONS_FAILURE]: getVideoAllQualificationsFailure,
  [Types.SET_VIDEO_QUALIFICATIONS]: setVideoQualifications,
  [Types.GET_VIDEO_CATEGORY_SUCCESS]: getVideoCategorySuccess
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
