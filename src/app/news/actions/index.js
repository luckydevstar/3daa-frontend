import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  getNewsAttempt: ['news_id'],
  getNewsFailure: ['errorCode'],
  getNewsSuccess: ['res'],

  getAllNewsAttempt: ['archived', 'query'],
  getAllNewsFailure: ['errorCode'],
  getAllNewsSuccess: ['res'],

  createNewsAttempt: ['params'],
  createNewsFailure: ['errorCode'],
  createNewsSuccess: ['res'],

  updateNewsAttempt: ['params', 'news_id'],
  updateNewsFailure: ['errorCode'],
  updateNewsSuccess: ['res'],

  deleteNewsAttempt: ['news_id'],
  deleteNewsFailure: ['errorCode'],
  deleteNewsSuccess: ['res'],

  getArchivedNews: ['query'],
  getLikedNews: ['query'],
  getSavedNews: ['query'],
  getViewedNews: ['query'],
  getNewsMedia: ['query'],

  putLikeNewsAttempt: ['news_id'],
  putLikeNewsFailure: ['error'],
  putLikeNewsSuccess: ['res'],

  putMarkNewsViewed: ['news_id'],

  putSaveNewsAttempt: ['news_id', 'save'],
  putSaveNewsFailure: ['error'],
  putSaveNewsSuccess: ['res'],

  getNewsProvidersAttempt: ['query'],
  getNewsProvidersFailure: ['error'],
  getNewsProvidersSuccess: ['res'],

  getNewsProviderAttempt: ['news_provider_id'],
  getNewsProviderFailure: ['errorCode'],
  getNewsProviderSuccess: ['res'],

  createNewsProviderAttempt: ['params'],
  createNewsProviderFailure: ['errorCode'],
  createNewsProviderSuccess: ['res'],

  updateNewsProviderAttempt: ['params', 'news_provider_id'],
  updateNewsProviderFailure: ['errorCode'],
  updateNewsProviderSuccess: ['res'],

  deleteNewsProviderAttempt: ['news_provider_id'],
  deleteNewsProviderFailure: ['errorCode'],
  deleteNewsProviderSuccess: ['res'],

  setActiveNewsType: ['news_type'],
  setActiveNews: ['news_id'],
  setActiveNewsProvider: ['news_provider_id'],
  setEditingNews: ['values'],
  toggleViewNewsArticle: ['view'],
  togglePreviewNewsArticle: null,

  newsEditorUpdateEntity: ['blockKey', 'newData'],
  newsEditorUpdateEntityQueueClear: null,

  onNewsEditorChange: ['news'],
  recordNewsLastSavedState: ['content'],
  clearCachedNewsArticle: []
});
