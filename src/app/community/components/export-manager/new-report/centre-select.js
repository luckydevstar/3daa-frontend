import React, { useState } from 'react';
import cx from 'classnames';

const CentreSelect = ({ title, selectedItem, centres, onSelect }) => {
  const [dropdownActive, setDropdownActive] = useState(false);

  const selectClick = item => {
    setDropdownActive(false);
    onSelect(item);
  };

  return (
    <div className="community-export-manager-new__sidebar__fields__select">
      <div>{title}</div>
      <div
        className={cx('dropdown', {
          'is-active': dropdownActive
        })}
      >
        <div className="dropdown-trigger">
          <button
            onClick={() => {
              setDropdownActive(!dropdownActive);
            }}
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>{selectedItem ? selectedItem.screen_name : 'Select'}</span>
            <span className="icon is-small">
              <i className="fa fa-angle-down" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <a
              className="dropdown-item dropdown-item--none"
              onClick={() => selectClick(null)}
            >
              None
            </a>
            {centres.map(centre => (
              <a
                key={centre.centre_id}
                className="dropdown-item"
                onClick={() => selectClick(centre)}
              >
                {centre.screen_name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentreSelect;
