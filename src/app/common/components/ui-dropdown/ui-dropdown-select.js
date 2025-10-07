import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { map } from 'ramda';

function UIDropdownSelect(props) {
  const {
    defaultTitle,
    defaultItem,
    items,
    onChange,
    disableCloseAfterSelect
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handeSetSelectedItem = item => {
    setSelectedItem(item);
    if (onChange) {
      onChange(item.key);
    }
    if (!disableCloseAfterSelect) {
      setIsOpen(false);
    }
  };

  const getMaxHeight = () => {
    if (items.length > 5 && isOpen) {
      return 225;
    } else if (items.length < 5 && isOpen) {
      return items.length * 45;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    if (defaultItem) {
      setSelectedItem(defaultItem);
    }
  }, []);

  return (
    <div className="ui-dropdown-container">
      <div
        className="ui-dropdown__default"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span>{selectedItem ? selectedItem.name : defaultTitle}</span>
        <div
          className={cx('ui-dropdown__default__icon', {
            'ui-dropdown__default__icon--open': isOpen
          })}
        >
          <i className="fa fa-angle-down" />
        </div>
      </div>
      <div
        className="ui-dropdown__items-container"
        style={{ maxHeight: `${getMaxHeight()}px` }}
      >
        <div
          className="ui-dropdown__items"
          style={{
            maxHeight: `${items.length > 5 ? 225 : items.length * 45}px`
          }}
        >
          {map(item => {
            if (selectedItem && item.key === selectedItem.key) return null;
            return (
              <div
                key={item.key}
                className="ui-dropdown__items__item"
                onClick={() => {
                  handeSetSelectedItem(item);
                }}
              >
                {item.name}
              </div>
            );
          })(items)}
        </div>
      </div>
    </div>
  );
}

export default UIDropdownSelect;
