import React from 'react';

import SelectIconModalItem from './select-icon-modal-item';

const SelectIconModalIcons = ({ icon_names, selectIcon, selectedIcon }) => (
  <div className="pairing-wheel__select-icon-content__icons">
    {icon_names.map(icon_name => (
      <SelectIconModalItem
        {...{
          key: icon_name,
          icon_name,
          onClick: () => {
            selectIcon(icon_name);
          },
          active: icon_name === selectedIcon
        }}
      />
    ))}
  </div>
);

export default SelectIconModalIcons;
