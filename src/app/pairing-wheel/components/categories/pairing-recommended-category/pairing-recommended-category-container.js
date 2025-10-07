import React from 'react';

import SelectMainCategory from './select-main-category';
import SelectSubCategory from './select-sub-category';
import SelectPairing from './select-pairing';

class PairingRecommendedCategoryContainer extends React.Component {
  render() {
    const {
      categories,
      mainCategoryId,
      subCategoryId,
      selectMainCategory,
      selectSubCategory,
      subCategories,
      subCategoriesAttempting,
      categoriesAttempting,
      searchAttempting,
      searchPairingTargets,
      searchItems
    } = this.props;
    return (
      <div className="pairing-recommended-select-container">
        <SelectMainCategory
          {...{
            categories,
            mainCategoryId,
            selectMainCategory,
            categoriesAttempting
          }}
        />
        <SelectSubCategory
          {...{
            subCategories,
            subCategoriesAttempting,
            subCategoryId,
            mainCategoryId,
            selectSubCategory
          }}
        />
        <SelectPairing
          {...{
            subCategoryId,
            categories,
            searchPairingTargets,
            searchAttempting,
            searchItems
          }}
        />
      </div>
    );
  }
}

export default PairingRecommendedCategoryContainer;
