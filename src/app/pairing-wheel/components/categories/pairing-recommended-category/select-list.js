import React from 'react';

import common from 'app/common';
import SelectListItem from './select-list-item';

const { UILoading } = common.components;

const SelectList = ({ categories, categoryId, onSelect, loading }) => (
  <div className="pairing-recommended-select-list">
    {loading && <UILoading marginTop="100px" />}
    {!loading &&
      categories &&
      categories.map(category => (
        <SelectListItem
          key={category.pairing_category_id}
          title={category.title}
          icon_name={category.icon_name}
          active={categoryId === category.pairing_category_id}
          onClick={() => {
            onSelect(category.pairing_category_id);
          }}
        />
      ))}
  </div>
);

export default SelectList;
