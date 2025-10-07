import { takeEvery, put, call, select } from 'redux-saga/effects';
import { head, prop, propEq, find, isEmpty, concat, pipe } from 'ramda';
import common from 'app/common';
import { translate, translatef } from 'app/intl';
import { Types, Creators } from '../actions';
import { Types as UserTypes } from 'app/user/actions';
import {
  filterVideosByActionCategory,
  filterVideosByActionSector
} from '../util/selectors';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifyError, notifySuccess }
} = common.util;

const getCategoryById = (arr, id) => find(propEq('video_category_id', id))(arr);

export default api => {
  function* checkVideosLoaded({ categoryId }) {
    const {
      video: { videos, selectedSector }
    } = yield select();
    const existingVideosByCategory = filterVideosByActionCategory(
      videos,
      categoryId
    );
    const existingVideosBySectorId = filterVideosByActionSector(
      videos,
      selectedSector
    );
    if (isEmpty(existingVideosBySectorId)) {
      yield put(Creators.getAllVideosAttempt());
    } else if (isEmpty(existingVideosByCategory)) {
      // No videos for that category yet so load some
      yield put(Creators.getVideosAttempt(categoryId));
    }
  }

  // Get video categories
  function* getCategories() {
    const {
      persisted: {
        sector: { sector_id }
      },
      video: { selectedCategory }
    } = yield select();
    try {
      const resp = yield call(api.getCategories, sector_id);
      const {
        data: { categories }
      } = yield checkResponse(resp);
      yield put(Creators.getCategoriesSuccess(categories));
      // Load the selected or first category
      const categoryId = getCategoryById(categories, selectedCategory)
        ? selectedCategory
        : prop('video_category_id', head(categories));

      // yield put(Creators.selectCategory(categoryId));
    } catch (err) {
      // Error, if add the notifiy
      yield put(Creators.getCategoriesFailure(err));
    }
  }

  // Get ALL video categories
  function* getAllCategories() {
    try {
      const resp = yield call(api.getAllCategories, { by_role: 1 });
      const {
        data: { categories }
      } = yield checkResponse(resp);

      yield put(Creators.getCategoriesSuccess(categories));
    } catch (err) {
      // Error, if add the notifiy
      yield put(Creators.getCategoriesFailure(err));
    }
  }

  // Get Video Category
  function* getVideoCategoryAttempt({ categoryId }) {
    const {
      video: { selectedSector }
    } = yield select();
    try {
      const resp = yield call(api.getCategory, selectedSector, categoryId);
      const {
        data: { category }
      } = yield checkResponse(resp);
      yield put(Creators.getVideoCategorySuccess(category));
    } catch (err) {
      // Error, if add the notifiy
      yield put(Creators.getCategoriesFailure(err));
    }
  }

  // Update category in the API
  function* updateCategory({ data }) {
    const {
      video: {
        editingCategory,
        selectedSector,
        editingSubCategory,
        selectedCategory,
        categories,
        selectedQualifications
      }
    } = yield select();
    let qualifications = [];
    if (selectedQualifications && selectedQualifications.length > 0) {
      selectedQualifications.map(qualification => {
        qualifications.push(qualification.qualification_id);
      });
    }
    const postData = convertToFormData({
      ...data,
      qualifications: qualifications,
      video_category_parent_id: editingSubCategory ? selectedCategory : null,
      image: head(data.image || []),
      mobile_image: head(data.mobile_image || []),
      icon:
        typeof data.icon === 'string' || data.icon === null
          ? data.icon
          : head(data.icon || [])
    });
    try {
      const resp = yield call(
        api.updateCategory,
        selectedSector,
        editingCategory,
        postData
      );
      const { data: category } = yield checkResponse(resp);

      if (editingSubCategory) {
        let tmpCategory = find(
          propEq('video_category_id', category.video_category_parent_id)
        )(categories);
        const subcategories = tmpCategory.subcategories
          .filter(c => c.video_category_id != editingCategory)
          .concat(category);
        yield put(
          Creators.updateCategorySuccess(
            tmpCategory.set('subcategories', subcategories)
          )
        );
      } else {
        yield put(Creators.updateCategorySuccess(category));
      }
      yield put(notifySuccess(yield translate('category_updated')));
      yield put(Creators.setVideoQualifications([]));
    } catch (err) {
      yield put(
        notifyError(yield translatef('category_update_failed', err.toString()))
      );
      yield put(Creators.updateCategoryFailure(err));
      yield put(Creators.setVideoQualifications([]));
    }
  }

  function* createCategory({ data }) {
    const {
      video: {
        selectedSector,
        editingSubCategory,
        selectedCategory,
        categories,
        selectedQualifications
      }
    } = yield select();
    let qualifications = [];
    if (selectedQualifications && selectedQualifications.length > 0) {
      selectedQualifications.map(qualification => {
        qualifications.push(qualification.qualification_id);
      });
    }

    const postData = convertToFormData({
      ...data,
      qualifications: qualifications,
      video_category_parent_id: editingSubCategory ? selectedCategory : null,
      icon: head(data.icon || []),
      image: head(data.image || []),
      mobile_image: head(data.mobile_image || [])
    });
    try {
      const resp = yield call(api.createCategory, selectedSector, postData);
      const newCategory = yield checkResponse(resp);

      if (editingSubCategory) {
        let category = find(
          propEq('video_category_id', newCategory.data.video_category_parent_id)
        )(categories);
        const subcategories = category.subcategories.concat(newCategory.data);
        yield put(
          Creators.updateCategorySuccess(
            category.set('subcategories', subcategories)
          )
        );
      } else {
        yield put(Creators.createCategorySuccess(newCategory.data));
      }
      yield put(notifySuccess(yield translate('category_created')));

      yield put(Creators.setVideoQualifications([]));
      // const categoryId = prop('video_category_id', newCategory.data);
      // yield put(Creators.selectCategory(categoryId));
    } catch (err) {
      yield put(
        notifyError(yield translatef('category_create_failed', err.toString()))
      );
      yield put(Creators.createCategoryFailure(err));
      yield put(Creators.setVideoQualifications([]));
    }
  }

  function* deleteCategory({ categoryId }) {
    const {
      video: {
        selectedSector,
        editingSubCategory,
        selectedCategory,
        categories,
        selectedSubCategory
      }
    } = yield select();
    try {
      const resp = yield call(api.deleteCategory, selectedSector, categoryId);
      yield checkResponse(resp);
      if (editingSubCategory) {
        let category = find(propEq('video_category_id', selectedCategory))(
          categories
        );
        const subcategories = category.subcategories.filter(
          c => c.video_category_id != categoryId
        );
        yield put(
          Creators.updateCategorySuccess(
            category.set('subcategories', subcategories)
          )
        );
        if (selectedSubCategory === categoryId) {
          yield put(Creators.selectSubCategory(0));
        }
      } else {
        yield put(Creators.deleteCategorySuccess(categoryId));
      }
      yield put(notifySuccess(yield translate('category_deleted')));

      // yield put(Creators.selectCategory(categoryId));
    } catch (err) {
      yield put(
        notifyError(yield translatef('category_delete_failed', err.toString()))
      );
      yield put(Creators.deleteCategoryFailure(err));
    }
  }

  function* getVideoAllQualificationsAttempt() {
    const {
      video: { selectedSector }
    } = yield select();

    try {
      const resp = yield call(api.getAllQualifications, selectedSector);
      const {
        data: { qualifications }
      } = yield checkResponse(resp);
      yield put(Creators.getVideoAllQualificationsSuccess(qualifications));
    } catch (err) {
      yield put(
        Creators.getVideoAllQualificationsFailure(
          yield translate('qualification_get_failed')
        )
      );
    }
  }

  function* getVideoAllQualificationsFailure({ errorCode }) {
    yield put(
      notifyError(yield translate(errorCode), {
        duration: 30000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* startWatchers() {
    yield takeEvery(Types.CREATE_CATEGORY, createCategory);
    yield takeEvery(Types.DELETE_CATEGORY, deleteCategory);
    yield takeEvery(Types.GET_CATEGORIES_ATTEMPT, getCategories);
    yield takeEvery(Types.SELECT_CATEGORY, checkVideosLoaded);
    yield takeEvery(Types.UPDATE_CATEGORY, updateCategory);
    yield takeEvery(UserTypes.SET_ACTIVE_SECTOR, getCategories);
    yield takeEvery(Types.GET_ALL_CATEGORIES_ATTEMPT, getAllCategories);
    yield takeEvery(
      Types.GET_VIDEO_ALL_QUALIFICATIONS_ATTEMPT,
      getVideoAllQualificationsAttempt
    );
    yield takeEvery(
      Types.GET_VIDEO_ALL_QUALIFICATIONS_FAILURE,
      getVideoAllQualificationsFailure
    );
    yield takeEvery(Types.GET_VIDEO_CATEGORY_ATTEMPT, getVideoCategoryAttempt);
  }

  return {
    startWatchers,
    getCategories
  };
};
