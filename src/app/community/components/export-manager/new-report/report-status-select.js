import React, { useState } from 'react';
import cx from 'classnames';

const selectOptions = [
  { id: 0, value: null, label: 'None' },
  { id: 1, value: 'not_completed', label: 'On Program' },
  { id: 2, value: 'completed', label: 'Completed 100%' },
  { id: 3, value: 'awaiting', label: 'Awaiting Learners' }
];

const ReportStatusSelect = ({ title, selectedItem, onSelect }) => {
  const [dropdownActive, setDropdownActive] = useState(false);

  const selectClick = item => {
    setDropdownActive(false);
    if (item.id === 0) {
      onSelect(null);
    } else {
      onSelect(item);
    }
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
            <span>{selectedItem ? selectedItem.label : 'Select'}</span>
            <span className="icon is-small">
              <i className="fa fa-angle-down" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {selectOptions.map(option => (
              <a
                className={cx('dropdown-item', {
                  'dropdown-item--none': option.id === 0
                })}
                onClick={() => selectClick(option)}
              >
                {option.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportStatusSelect;
