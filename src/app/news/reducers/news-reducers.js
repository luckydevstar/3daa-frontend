import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import { pipe, prop, concat, uniqBy, clone } from 'ramda';
import { Types } from '../actions';

import { age_to_range } from '../utils/change-age-range';

// Add News to existing array and remove duplicates
const addList = (arr, field_name) => {
  return pipe(
    concat(arr ? arr : []),
    uniqBy(prop(field_name))
  );
};

export const INITIAL_STATE = Immutable({
  uiLoadingNews: false,

  news: null,
  newsProviders: null,
  newsNum: 0,
  newsProvidersNum: 0,

  activeNewsType: 'featured',
  likedNews: null,
  savedNews: null,
  viewedNews: null,

  currentSector: null,
  currentNews: null,
  currentNewsProvider: null,

  editingNews: null,
  viewNewsArticle: false,
  previewNewsArticle: false,

  cachedNewsArticle: null,
  editorLoaded: false,
  entityUpdateQueue: [],
  lastSavedState: null,

  attemptingAllGetNews: false,
  attemptingGetNews: false,
  attemptingPostNews: false,
  attemptingDeleteNews: false,

  attemptingGetNewsProviders: false,
  attemptingGetNewsProvider: false,
  attemptingPostNewsProvider: false,
  attemptingDeleteNewsProvider: false,

  attemptingGetArchivedNews: false,
  attemptingGetLikedNews: false,
  attemptingGetSavedNews: false,
  attemptingGetViewedNews: false,
  attemptingGetNewsMedia: false,

  attemptingPostLikeNews: false,
  attemptingPostUnlikeNews: false,
  attemptingPostMarkNewsViewed: false,
  attemptingPostUnsavedNews: false,

  errorCode: null
});

const getAllNewsAttempt = state =>
  state.merge({
    attemptingGetAllNews: true,
    currentNews: null,
    editingNews: null
  });
const getAllNewsSuccess = (state, action) => {
  return state.merge({
    attemptingGetAllNews: false,
    news: action.res.news,
    newsNum: action.res.total
  });
};

const getAllNewsFailure = state =>
  state.merge({ attemptingGetAllNews: false, news: [], newsNum: 0 });

const getNewsAttempt = state => state.merge({ attemptingGetNews: true });
const getNewsSuccess = (state, action) => {
  return state.merge({
    attemptingGetNews: false,
    currentNews: action.res,
    news: addList(state.news, 'news_id')([action.res])
  });
};
const getNewsFailure = (state, action) =>
  state.merge({ attemptingGetNews: false, errorCode: action.errorCode });

const createNewsAttempt = state =>
  state.merge({ attemptingPostNews: true, errorCode: null });
const createNewsSuccess = (state, action) => {
  return state.merge({
    attemptingPostNews: false,
    currentNews: action.res,
    news: addList(state.news, 'news_id')([action.res])
  });
};
const createNewsFailure = (state, action) =>
  state.merge({ attemptingPostNews: false, errorCode: action.errorCode });

const updateNewsAttempt = state =>
  state.merge({ attemptingPostNews: true, errorCode: null });
const updateNewsSuccess = (state, action) => {
  let temp = clone(state.news);

  if (action.res && action.res.news_id) {
    const index = temp.findIndex(u => u.news_id == action.res.news_id);
    temp.splice(index, 1, action.res);
  }

  return state.merge({
    attemptingPostNews: false,
    currentNews: action.res,
    news: temp
  });
};
const updateNewsFailure = (state, action) =>
  state.merge({ attemptingPostNews: false, errorCode: action.errorCode });

const deleteNewsAttempt = state =>
  state.merge({ attemptingDeleteNews: true, errorCode: null });
const deleteNewsSuccess = (state, action) => {
  const news = state.news.filter(p => p.news_id != state.currentNews.news_id);
  return state.merge({
    attemptingDeleteNews: false,
    currentNews: null,
    news: news
  });
};
const deleteNewsFailure = (state, action) =>
  state.merge({ attemptingDeleteNews: false, errorCode: action.errorCode });

const getNewsProvidersAttempt = state =>
  state.merge({ attemptingGetNewsProviders: true, currentNewsProvider: null });
const getNewsProvidersSuccess = (state, action) => {
  return state.merge({
    attemptingGetNewsProviders: false,
    newsProviders: addList(state.newsProviders, 'news_provider_id')(
      action.res.providers
    ),
    newsProvidersNum: action.res.total
  });
};
const getNewsProvidersFailure = (state, action) =>
  state.merge({
    attemptingGetNewsProviders: false,
    newsProviders: [],
    newsProvidersNum: 0,
    errorCode: action.errorCode
  });

const getNewsProviderAttempt = state =>
  state.merge({ attemptingGetNewsProvider: true });
const getNewsProviderSuccess = (state, action) => {
  const temp = age_to_range(action.res.age_min, action.res.age_max);
  action.res.age_range = temp;

  return state.merge({
    attemptingGetNewsProvider: false,
    currentNewsProvider: action.res,
    newsProviders: addList(state.newsProviders, 'news_provider_id')([
      action.res
    ])
  });
};
const getNewsProviderFailure = (state, action) =>
  state.merge({
    attemptingGetNewsProvider: false,
    errorCode: action.errorCode
  });

const createNewsProviderAttempt = state =>
  state.merge({ attemptingPostNewsProvider: true });
const createNewsProviderSuccess = (state, action) => {
  return state.merge({
    attemptingPostNewsProvider: false,
    currentNewsProvider: action.res,
    newsProviders: addList(state.newsProviders, 'news_provider_id')([
      action.res
    ])
  });
};
const createNewsProviderFailure = (state, action) =>
  state.merge({
    attemptingPostNewsProvider: false,
    errorCode: action.errorCode
  });

const updateNewsProviderAttempt = state =>
  state.merge({ attemptingPostNewsProvider: true });
const updateNewsProviderSuccess = (state, action) => {
  let temp = clone(state.newsProviders);
  if (action.res && action.res.news_provider_id) {
    const index = temp.findIndex(
      u => u.news_provider_id == action.res.news_provider_id
    );
    temp.splice(index, 1, action.res);
  }

  return state.merge({
    attemptingPostNewsProvider: false,
    currentNewsProvider: action.res,
    newsProviders: temp
  });
};

const updateNewsProviderFailure = (state, action) =>
  state.merge({
    attemptingPostNewsProvider: false,
    errorCode: action.errorCode
  });

const deleteNewsProviderAttempt = state =>
  state.merge({
    attemptingDeleteNewsProvider: true,
    errorCode: null
  });
const deleteNewsProviderSuccess = (state, action) => {
  const newsProviders = state.newsProviders.filter(
    p => p.news_provider_id != state.currentNewsProvider.news_provider_id
  );
  return state.merge({
    attemptingDeleteNewsProvider: false,
    newsProviders: newsProviders,
    currentNewsProvider: null
  });
};
const deleteNewsProviderFailure = (state, action) =>
  state.merge({
    attemptingDeleteNewsProvider: false,
    errorCode: action.errorCode
  });

const setActiveNewsProvider = (state, action) => {
  return state.merge({
    currentNewsProvider: state.newsProviders
      ? state.newsProviders.find(
          p => p.news_provider_id == action.news_provider_id
        )
      : null
  });
};

const setActiveNewsType = (state, action) => {
  return state.merge({
    activeNewsType: action.news_type
  });
};

const setActiveNews = (state, action) =>
  state.merge({
    currentNews: state.news.find(p => p.news_id == action.news_id),
    editingNews: null
  });

const setEditingNews = (state, action) => {
  let values = { ...action.values };
  return state.merge({ editingNews: values });
};

const toggleViewNewsArticle = (state, action) => {
  return state.merge({ viewNewsArticle: action.view });
};

const togglePreviewNewsArticle = state => {
  return state.merge({ previewNewsArticle: !state.previewNewsArticle });
};

/**
 * Update editor block
 */
const newsEditorUpdateEntity = (state, action) =>
  state.merge({
    entityUpdateQueue: [
      {
        blockKey: action.blockKey,
        newData: action.newData
      },
      ...state.entityUpdateQueue
    ]
  });

/**
 * Clear block update queue
 */
const newsEditorUpdateEntityQueueClear = state =>
  state.merge({
    entityUpdateQueue: [],
    editorLoaded: true
  });

const onNewsEditorChange = (state, { news }) => {
  // const hasChanged = !equals(state.lastSavedState, action.content);
  return state.merge({ cachedNewsArticle: news });
};

const clearCachedNewsArticle = state =>
  state.merge({ cachedNewsArticle: INITIAL_STATE.cachedNewsArticle });

const recordNewsLastSavedState = (state, action) =>
  state.merge({ lastSavedState: action.content, unsavedChanges: false });

const putSaveNewsAttempt = state => state.merge({ errorCode: null });
const putSaveNewsSuccess = (state, action) => {
  let temp = clone(state.news);
  let news = temp.find(i => i.news_id == action.res);
  news.saved = !news.saved;

  return state.merge({
    news: temp
  });
};
const putSaveNewsFailure = (state, action) =>
  state.merge({
    errorCode: action.errorCode
  });

const ACTION_HANDLERS = {
  [Types.GET_ALL_NEWS_ATTEMPT]: getAllNewsAttempt,
  [Types.GET_ALL_NEWS_FAILURE]: getAllNewsFailure,
  [Types.GET_ALL_NEWS_SUCCESS]: getAllNewsSuccess,

  [Types.GET_NEWS_ATTEMPT]: getNewsAttempt,
  [Types.GET_NEWS_FAILURE]: getNewsFailure,
  [Types.GET_NEWS_SUCCESS]: getNewsSuccess,

  [Types.CREATE_NEWS_ATTEMPT]: createNewsAttempt,
  [Types.CREATE_NEWS_FAILURE]: createNewsFailure,
  [Types.CREATE_NEWS_SUCCESS]: createNewsSuccess,

  [Types.UPDATE_NEWS_ATTEMPT]: updateNewsAttempt,
  [Types.UPDATE_NEWS_FAILURE]: updateNewsFailure,
  [Types.UPDATE_NEWS_SUCCESS]: updateNewsSuccess,

  [Types.DELETE_NEWS_ATTEMPT]: deleteNewsAttempt,
  [Types.DELETE_NEWS_FAILURE]: deleteNewsFailure,
  [Types.DELETE_NEWS_SUCCESS]: deleteNewsSuccess,

  [Types.GET_NEWS_PROVIDERS_ATTEMPT]: getNewsProvidersAttempt,
  [Types.GET_NEWS_PROVIDERS_SUCCESS]: getNewsProvidersSuccess,
  [Types.GET_NEWS_PROVIDERS_FAILURE]: getNewsProvidersFailure,

  [Types.GET_NEWS_PROVIDER_ATTEMPT]: getNewsProviderAttempt,
  [Types.GET_NEWS_PROVIDER_SUCCESS]: getNewsProviderSuccess,
  [Types.GET_NEWS_PROVIDER_FAILURE]: getNewsProviderFailure,

  [Types.CREATE_NEWS_PROVIDER_ATTEMPT]: createNewsProviderAttempt,
  [Types.CREATE_NEWS_PROVIDER_SUCCESS]: createNewsProviderSuccess,
  [Types.CREATE_NEWS_PROVIDER_FAILURE]: createNewsProviderFailure,

  [Types.UPDATE_NEWS_PROVIDER_ATTEMPT]: updateNewsProviderAttempt,
  [Types.UPDATE_NEWS_PROVIDER_SUCCESS]: updateNewsProviderSuccess,
  [Types.UPDATE_NEWS_PROVIDER_FAILURE]: updateNewsProviderFailure,

  [Types.DELETE_NEWS_PROVIDER_ATTEMPT]: deleteNewsProviderAttempt,
  [Types.DELETE_NEWS_PROVIDER_SUCCESS]: deleteNewsProviderSuccess,
  [Types.DELETE_NEWS_PROVIDER_FAILURE]: deleteNewsProviderFailure,

  [Types.PUT_SAVE_NEWS_ATTEMPT]: putSaveNewsAttempt,
  [Types.PUT_SAVE_NEWS_SUCCESS]: putSaveNewsSuccess,
  [Types.PUT_SAVE_NEWS_FAILURE]: putSaveNewsFailure,

  [Types.SET_ACTIVE_NEWS_TYPE]: setActiveNewsType,
  [Types.SET_ACTIVE_NEWS_PROVIDER]: setActiveNewsProvider,
  [Types.SET_ACTIVE_NEWS]: setActiveNews,
  [Types.SET_EDITING_NEWS]: setEditingNews,
  [Types.TOGGLE_VIEW_NEWS_ARTICLE]: toggleViewNewsArticle,
  [Types.TOGGLE_PREVIEW_NEWS_ARTICLE]: togglePreviewNewsArticle,

  [Types.NEWS_EDITOR_UPDATE_ENTITY]: newsEditorUpdateEntity,
  [Types.NEWS_EDITOR_UPDATE_ENTITY_QUEUE_CLEAR]: newsEditorUpdateEntityQueueClear,
  [Types.ON_NEWS_EDITOR_CHANGE]: onNewsEditorChange,
  [Types.RECORD_NEWS_LAST_SAVED_STATE]: recordNewsLastSavedState,
  [Types.CLEAR_CACHED_NEWS_ARTICLE]: clearCachedNewsArticle
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
