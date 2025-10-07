import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import { Types } from '../actions';

export const INITIAL_STATE = Immutable({
  categoryType: 'main',
  categoriesAttempting: false,
  subCategoriesAttempting: false,
  createCategoryAttempting: false,
  searchAttempting: false,
  selectIconModal: false,
  icon_name: null,
  uploadedImage: null,
  categories: [],
  subCategories: [],
  items: [],
  searchItems: []
});

const setCategoryType = (state, { categoryType }) =>
  state.merge({
    categoryType
  });

const getPairingItemsAttempt = state =>
  state.merge({ categoriesAttempting: true });

const getPairingItemsSuccess = (state, { items }) =>
  state.merge({
    items,
    categoriesAttempting: false
  });

const getPairingCategoriesSuccess = (state, { categories }) =>
  state.merge({
    categories,
    categoriesAttempting: false
  });

const getPairingSubCategoriesAttempt = state =>
  state.merge({
    subCategoriesAttempting: true
  });

const getPairingSubCategoriesSuccess = (
  state,
  { pairing_category_id, subCategories }
) =>
  state.merge({
    subCategories: {
      ...state.subCategories,
      [pairing_category_id]: subCategories
    },
    createCategoryAttempting: false,
    subCategoriesAttempting: false
  });

const createPairingCategoryAttempt = state =>
  state.merge({ createCategoryAttempting: true });

const createPairingCategorySuccess = (state, { category }) =>
  state.merge({
    categories: [...state.categories, category],
    createCategoryAttempting: false
  });

const deletePairingCategoryAttempt = state =>
  state.merge({ categoriesAttempting: true });

const createPairingCategoryItemSuccess = (state, { item }) =>
  state.merge({
    items: [...state.items, item]
  });

const searchPairingTargetsAttempt = state =>
  state.merge({
    searchAttempting: true
  });
const searchPairingTargetsSuccess = (state, { items }) =>
  state.merge({
    searchAttempting: false,
    searchItems: items
  });

const selectIcon = (state, { icon_name }) =>
  state.merge({
    icon_name
  });

const setUploadedImage = (state, { url }) =>
  state.merge({
    uploadedImage: url
  });

const ACTION_HANDLERS = {
  [Types.SET_CATEGORY_TYPE]: setCategoryType,

  [Types.GET_PAIRING_ITEMS_SUCCESS]: getPairingItemsSuccess,
  [Types.GET_PAIRING_ITEMS_ATTEMPT]: getPairingItemsAttempt,

  [Types.GET_PAIRING_CATEGORIES_SUCCESS]: getPairingCategoriesSuccess,

  [Types.GET_PAIRING_SUB_CATEGORIES_ATTEMPT]: getPairingSubCategoriesAttempt,
  [Types.GET_PAIRING_SUB_CATEGORIES_SUCCESS]: getPairingSubCategoriesSuccess,

  [Types.CREATE_PAIRING_CATEGORY_ATTEMPT]: createPairingCategoryAttempt,
  [Types.CREATE_PAIRING_CATEGORY_SUCCESS]: createPairingCategorySuccess,

  [Types.DELETE_PAIRING_CATEGORY_ATTEMPT]: deletePairingCategoryAttempt,

  [Types.CREATE_PAIRING_CATEGORY_ITEM_SUCCESS]: createPairingCategoryItemSuccess,

  [Types.SEARCH_PAIRING_TARGETS_ATTEMPT]: searchPairingTargetsAttempt,
  [Types.SEARCH_PAIRING_TARGETS_SUCCESS]: searchPairingTargetsSuccess,

  [Types.SELECT_ICON]: selectIcon,

  [Types.SET_UPLOADED_IMAGE]: setUploadedImage
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
