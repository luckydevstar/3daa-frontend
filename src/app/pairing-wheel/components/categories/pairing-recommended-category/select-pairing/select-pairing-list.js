import React from 'react';
import { filter } from 'ramda';

import SelectPairingListItem from './select-pairing-list-item';

const SelectPairingList = ({ categories, searchItems }) => (
  <div className="pairing-recommended-pairing__list">
    {categories.map(category => (
      <SelectPairingListItem
        key={category.pairing_category_id}
        title={category.title}
        items={filter(
          item =>
            item.pairing_target_category_id === category.pairing_category_id,
          searchItems
        )}
      />
    ))}
  </div>
);

export default SelectPairingList;
