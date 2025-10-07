import React from 'react';
import classNames from 'classnames';

import SelectHead from './select-head';
import SelectList from './select-list';

const SelectSubCategory = ({
  subCategories,
  subCategoriesAttempting,
  subCategoryId,
  mainCategoryId,
  selectSubCategory
}) => (
  <div
    className={classNames('pairing-recommended-select-sub', {
      'pairing-recommended-select-sub--open': mainCategoryId
    })}
  >
    <SelectHead backgroundColor="#D8D2C0" title="Select Sub category" />
    <SelectList
      categories={subCategories}
      loading={subCategoriesAttempting}
      onSelect={selectSubCategory}
      categoryId={subCategoryId}
    />
  </div>
);

export default SelectSubCategory;
