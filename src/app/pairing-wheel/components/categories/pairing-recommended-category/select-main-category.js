import React from 'react';

import SelectHead from './select-head';
import SelectList from './select-list';

const SelectMainCategory = ({
  categories,
  mainCategoryId,
  selectMainCategory,
  categoriesAttempting
}) => (
  <div className="pairing-recommended-select-main">
    <SelectHead backgroundColor="#F6F1DE" title="Select Main category" />
    <SelectList
      {...{
        categories,
        categoryId: mainCategoryId,
        onSelect: selectMainCategory,
        loading: categoriesAttempting
      }}
    />
  </div>
);

export default SelectMainCategory;
