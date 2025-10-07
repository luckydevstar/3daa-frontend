import { takeEvery, put, call } from 'redux-saga/effects';
import { pickAll } from 'ramda';
import { browserHistory } from 'react-router';
import common from 'app/common';
import { translate } from 'app/intl';

import { Types, Creators } from '../actions';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifyError, notifySuccess },
  sagaSelectors: { getUserCentres, getActiveSector }
} = common.util;

export default api => {
  function* getAllNewsAttempt({ archived, query }) {
    try {
      const response = yield call(api.getAllNews, archived, query);
      const { data } = yield checkResponse(response);
      // const search = pickAll(['what', 'where'], query);
      // const news = [{ a: 'as', b: 'bd', q: search }];
      yield put(Creators.getAllNewsSuccess(data));
      // browserHistory.push(`/news/view/:all`);
    } catch (err) {
      yield put(Creators.getAllNewsFailure(err));
    }
  }

  function* getAllNewsFailure(action) {
    yield put(
      notifyError(action.errorCode, { duration: 10000, canDimiss: true })
    );
  }

  function* getNewsAttempt(action) {
    try {
      const resp = yield call(api.getNews, action.news_id);
      const { data } = yield checkResponse(resp);
      yield put(Creators.getNewsSuccess(data));
    } catch (err) {
      yield put(Creators.getNewsFailure(err));
    }
  }

  function* getNewsFailure(action) {
    yield put(
      notifyError(action.errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* createNewsAttempt(action) {
    try {
      const resp = yield call(api.createNews, convertToFormData(action.params));
      const { data } = yield checkResponse(resp);
      yield put(Creators.createNewsSuccess(data));
      yield put(
        notifySuccess(yield translate('news_article_created'), {
          duration: 2000,
          canDimiss: true
        })
      );
    } catch (err) {
      yield put(Creators.createNewsFailure(err));
    }
  }

  function* createNewsFailure(action) {
    yield put(
      notifyError(action.errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* updateNewsAttempt(action) {
    try {
      const resp = yield call(
        api.updateNews,
        convertToFormData(action.params),
        action.news_id
      );
      const { data } = yield checkResponse(resp);
      yield put(Creators.updateNewsSuccess(data));
      yield put(
        notifySuccess(yield translate('news_article_updated'), {
          duration: 2000,
          canDimiss: true
        })
      );
    } catch (err) {
      yield put(Creators.updateNewsFailure(err));
    }
  }

  function* updateNewsFailure(action) {
    yield put(
      notifyError(action.errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* deleteNewsAttempt(action) {
    try {
      const resp = yield call(api.deleteNews, action.news_id);
      const { data } = yield checkResponse(resp);
      yield put(Creators.deleteNewsSuccess(data));
      yield put(
        notifySuccess(yield translate('news_article_deleted'), {
          duration: 2000,
          canDimiss: true
        })
      );
    } catch (err) {
      yield put(Creators.deleteNewsFailure(err));
    }
  }

  function* deleteNewsFailure(action) {
    yield put(
      notifyError(action.errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* putSaveNewsAttempt(action) {
    try {
      const resp = yield call(api.saveNews, action.news_id, action.save);
      const { data } = yield checkResponse(resp);
      yield put(Creators.putSaveNewsSuccess(action.news_id));
    } catch (err) {
      yield put(Creators.putSaveNewsFailure(err));
    }
  }

  function* putSaveNewsFailure(action) {
    yield put(
      notifyError(action.errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* getNewsProvidersAttempt(action) {
    try {
      const resp = yield call(api.getNewsProviders, action.query);
      const { data } = yield checkResponse(resp);
      yield put(Creators.getNewsProvidersSuccess(data));
    } catch (err) {
      yield put(Creators.getNewsProvidersFailure(err));
    }
  }

  function* getNewsProvidersFailure({ errorCode }) {
    yield put(
      notifyError(errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* getNewsProviderAttempt(action) {
    try {
      const resp = yield call(api.getNewsProvider, action.news_provider_id);
      const { data } = yield checkResponse(resp);
      yield put(Creators.getNewsProviderSuccess(data));
    } catch (err) {
      yield put(Creators.getNewsProviderFailure(err));
    }
  }

  function* getNewsProviderFailure(action) {
    yield put(
      notifyError(action.errorCode, { canDimiss: true, duration: 10000 })
    );
  }

  function* createNewsProviderAttempt(action) {
    try {
      const resp = yield call(
        api.createNewsProvider,
        convertToFormData(action.params)
      );
      const { data } = yield checkResponse(resp);
      yield put(Creators.createNewsProviderSuccess(data));
      yield put(
        notifySuccess(yield translate('news_provider_created'), {
          duration: 2000,
          canDimiss: true
        })
      );
    } catch (err) {
      yield put(Creators.createNewsProviderFailure(err));
    }
  }

  function* createNewsProviderFailure(action) {
    yield put(
      notifyError(action.errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* updateNewsProviderAttempt(action) {
    try {
      const resp = yield call(
        api.updateNewsProvider,
        convertToFormData(action.params),
        action.news_provider_id
      );
      const { data } = yield checkResponse(resp);
      yield put(Creators.updateNewsProviderSuccess(data));
      yield put(
        notifySuccess(yield translate('news_provider_updated'), {
          duration: 2000,
          canDimiss: true
        })
      );
    } catch (err) {
      yield put(Creators.updateNewsProviderFailure(err));
    }
  }

  function* updateNewsProviderFailure(action) {
    yield put(
      notifyError(action.errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* deleteNewsProviderAttempt(action) {
    try {
      const resp = yield call(api.deleteNewsProvider, action.news_provider_id);
      const { data } = yield checkResponse(resp);
      yield put(Creators.deleteNewsProviderSuccess(data));
      yield put(
        notifySuccess(yield translate('news_provider_deleted'), {
          duration: 2000,
          canDimiss: true
        })
      );
    } catch (err) {
      yield put(Creators.deleteNewsProviderFailure(err));
    }
  }

  function* deleteNewsProviderFailure(action) {
    yield put(
      notifyError(action.errorCode, {
        duration: 10000,
        canDimiss: true
      })
    );
  }

  function* startWatchers() {
    yield takeEvery(Types.GET_ALL_NEWS_ATTEMPT, getAllNewsAttempt);
    yield takeEvery(Types.GET_NEWS_ATTEMPT, getNewsAttempt);
    yield takeEvery(Types.CREATE_NEWS_ATTEMPT, createNewsAttempt);
    yield takeEvery(Types.UPDATE_NEWS_ATTEMPT, updateNewsAttempt);
    yield takeEvery(Types.DELETE_NEWS_ATTEMPT, deleteNewsAttempt);
    yield takeEvery(Types.PUT_SAVE_NEWS_ATTEMPT, putSaveNewsAttempt);

    yield takeEvery(Types.GET_NEWS_PROVIDERS_ATTEMPT, getNewsProvidersAttempt);
    yield takeEvery(Types.GET_NEWS_PROVIDER_ATTEMPT, getNewsProviderAttempt);
    yield takeEvery(
      Types.CREATE_NEWS_PROVIDER_ATTEMPT,
      createNewsProviderAttempt
    );
    yield takeEvery(
      Types.UPDATE_NEWS_PROVIDER_ATTEMPT,
      updateNewsProviderAttempt
    );
    yield takeEvery(
      Types.DELETE_NEWS_PROVIDER_ATTEMPT,
      deleteNewsProviderAttempt
    );

    yield takeEvery(Types.GET_ALL_NEWS_FAILURE, getAllNewsFailure);
    yield takeEvery(Types.GET_NEWS_FAILURE, getNewsFailure);
    yield takeEvery(Types.CREATE_NEWS_FAILURE, createNewsFailure);
    yield takeEvery(Types.UPDATE_NEWS_FAILURE, updateNewsFailure);
    yield takeEvery(Types.DELETE_NEWS_FAILURE, deleteNewsFailure);
    yield takeEvery(Types.PUT_SAVE_NEWS_FAILURE, putSaveNewsFailure);

    yield takeEvery(Types.GET_NEWS_PROVIDERS_FAILURE, getNewsProvidersFailure);
    yield takeEvery(Types.GET_NEWS_PROVIDER_FAILURE, getNewsProviderFailure);
    yield takeEvery(
      Types.CREATE_NEWS_PROVIDER_FAILURE,
      createNewsProviderFailure
    );
    yield takeEvery(
      Types.UPDATE_NEWS_PROVIDER_FAILURE,
      updateNewsProviderFailure
    );
    yield takeEvery(
      Types.DELETE_NEWS_PROVIDER_FAILURE,
      deleteNewsProviderFailure
    );
    yield takeEvery(
      Types.DELETE_NEWS_PROVIDER_FAILURE,
      deleteNewsProviderFailure
    );
  }

  return {
    startWatchers,

    getAllNewsAttempt,
    getNewsAttempt,
    createNewsAttempt,
    updateNewsAttempt,
    deleteNewsAttempt,
    putSaveNewsAttempt,

    getAllNewsFailure,
    getNewsFailure,
    createNewsFailure,
    updateNewsFailure,
    deleteNewsFailure,
    putSaveNewsFailure,

    getNewsProvidersAttempt,
    getNewsProviderAttempt,
    createNewsProviderAttempt,
    updateNewsProviderAttempt,
    deleteNewsProviderAttempt,

    getNewsProvidersFailure,
    getNewsProviderFailure,
    createNewsProviderFailure,
    updateNewsProviderFailure,
    deleteNewsProviderFailure
  };
};
