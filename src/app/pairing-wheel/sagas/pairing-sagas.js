import { takeEvery, takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from '../actions';
import common from 'app/common';

export default api => {
  function* getPairingItemsAttempt() {
    try {
      const res = yield call(api.getPairingItems);
      yield put(Creators.getPairingItemsSuccess(res.data.data.items));
    } catch (err) {
      console.log(err);
    }
  }

  function* getPairingCategoriesAttempt() {
    try {
      const res = yield call(api.getPairingCategories);
      yield put(Creators.getPairingCategoriesSuccess(res.data.data.categories));
    } catch (err) {
      console.log(err);
    }
  }

  function* getPairingSubCategoriesAttempt({ parent_pairing_category_id }) {
    try {
      const res = yield call(
        api.getPairingSubCategories,
        parent_pairing_category_id
      );
      console.log(res);
      yield put(
        Creators.getPairingSubCategoriesSuccess(
          parent_pairing_category_id,
          res.data.data.categories
        )
      );
    } catch (err) {
      console.log(err);
    }
  }

  function* createPairingCategoryAttempt(action) {
    try {
      const res = yield call(api.createPairingCategory, action.params);
      if (res.data.status === 'success') {
        const { category } = res.data.data;
        if (action.isSub) {
          const response = yield call(
            api.getPairingSubCategories,
            category.parent_pairing_category_id
          );
          yield put(
            Creators.getPairingSubCategoriesSuccess(
              category.parent_pairing_category_id,
              response.data.data.categories
            )
          );
        } else {
          yield put(Creators.createPairingCategorySuccess(category));
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  function* deletePairingCategoryAttempt({
    pairing_category_id,
    parent_pairing_category_id
  }) {
    try {
      const res = yield call(api.deletePairingCategory, pairing_category_id);
      if (res.data.status === 'success') {
        if (parent_pairing_category_id) {
          const response = yield call(
            api.getPairingSubCategories,
            parent_pairing_category_id
          );
          yield put(
            Creators.getPairingSubCategoriesSuccess(
              parent_pairing_category_id,
              response.data.data.categories
            )
          );
        } else {
          yield put(Creators.getPairingCategoriesAttempt());
          yield put(Creators.deletePairingCategorySuccess());
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  function* createPairingCategoryItemAttempt({ params }) {
    try {
      const res = yield call(api.createPairingCategoryItem, params);
      if (res.data.status === 'success') {
        yield put(
          Creators.createPairingCategoryItemSuccess(res.data.data.item)
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  function* deletePairingCategoryItemAttempt({ pairing_category_id }) {
    try {
      const res = yield call(
        api.deletePairingCategoryItem,
        pairing_category_id
      );
      if (res.data.status === 'success') {
        yield put(Creators.getPairingItemsAttempt());
      }
    } catch (err) {
      console.log(err);
    }
  }

  function* searchPairingTargetsAttempt({ params }) {
    try {
      const res = yield call(api.searchPairingTargets, params);
      if (res.data.status === 'success') {
        yield put(Creators.searchPairingTargetsSuccess(res.data.data.result));
      }
    } catch (err) {
      console.log(err);
    }
  }

  function* startWatchers() {
    yield takeLatest(Types.GET_PAIRING_ITEMS_ATTEMPT, getPairingItemsAttempt);
    yield takeLatest(
      Types.GET_PAIRING_CATEGORIES_ATTEMPT,
      getPairingCategoriesAttempt
    );
    yield takeLatest(
      Types.CREATE_PAIRING_CATEGORY_ATTEMPT,
      createPairingCategoryAttempt
    );
    yield takeLatest(
      Types.DELETE_PAIRING_CATEGORY_ATTEMPT,
      deletePairingCategoryAttempt
    );
    yield takeLatest(
      Types.CREATE_PAIRING_CATEGORY_ITEM_ATTEMPT,
      createPairingCategoryItemAttempt
    );
    yield takeLatest(
      Types.DELETE_PAIRING_CATEGORY_ITEM_ATTEMPT,
      deletePairingCategoryItemAttempt
    );
    yield takeLatest(
      Types.SEARCH_PAIRING_TARGETS_ATTEMPT,
      searchPairingTargetsAttempt
    );

    yield takeEvery(
      Types.GET_PAIRING_SUB_CATEGORIES_ATTEMPT,
      getPairingSubCategoriesAttempt
    );
  }

  return {
    startWatchers,

    getPairingItemsAttempt,
    getPairingCategoriesAttempt,
    getPairingSubCategoriesAttempt
  };
};
