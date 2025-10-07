import React from 'react';
import Isvg from 'react-inlinesvg';
import { map } from 'ramda';

import IconChecked from 'images/icon_checked.svg';

const Dropdown = ({
  closePortal,
  defaultTxt,
  selectedKey,
  dropdownList,
  changeSector,
  left,
  top,
  width
}) => (
  <div className="ui-select-dropdown-list" onClick={closePortal}>
    <div
      className="dropdown-list"
      onClick={e => e.stopPropagation()}
      style={{ left, top, width }}
    >
      <div className="dropdown-list-content">
        <div className="d-list" onClick={() => changeSector('')}>
          <span className="txt">{defaultTxt}</span>
          {selectedKey === '' && (
            <Isvg src={IconChecked} className="icon-checked" />
          )}
        </div>
        {map(
          list => (
            <div
              className="d-list"
              key={`dropdown${list.key}`}
              onClick={() => changeSector(list.key)}
            >
              <span className="txt">{list.name}</span>
              {list.key === selectedKey && (
                <Isvg src={IconChecked} className="icon-checked" />
              )}
            </div>
          ),
          dropdownList
        )}
      </div>
    </div>
  </div>
);

export default Dropdown;
