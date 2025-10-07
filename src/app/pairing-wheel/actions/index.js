import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  setCategoryType: ['categoryType'],

  getPairingItemsAttempt: null,
  getPairingItemsSuccess: ['items'],
  getPairingItemsFailure: [],

  getPairingCategoriesAttempt: null,
  getPairingCategoriesSuccess: ['categories'],
  getPairingCategoriesFailure: [],

  getPairingSubCategoriesAttempt: ['parent_pairing_category_id'],
  getPairingSubCategoriesSuccess: ['pairing_category_id', 'subCategories'],
  getPairingSubCategoriesFailure: null,

  createPairingCategoryAttempt: ['params', 'isSub'],
  createPairingCategorySuccess: ['category'],
  createPairingCategoryFailure: null,

  deletePairingCategoryAttempt: [
    'pairing_category_id',
    'parent_pairing_category_id'
  ],
  deletePairingCategorySuccess: null,
  deletePairingCategoryFailure: null,

  createPairingCategoryItemAttempt: ['params'],
  createPairingCategoryItemSuccess: ['item'],
  createPairingCategoryItemFailure: null,

  deletePairingCategoryItemAttempt: ['pairing_category_id'],
  deletePairingCategoryItemSuccess: null,
  deletePairingCategoryItemFailure: null,

  searchPairingTargetsAttempt: ['params'],
  searchPairingTargetsSuccess: ['items'],
  searchPairingTargetsFailure: null,

  selectIcon: ['icon_name'],
  setUploadedImage: ['url']
});
