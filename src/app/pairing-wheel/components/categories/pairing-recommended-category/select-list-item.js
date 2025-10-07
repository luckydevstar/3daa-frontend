import React from 'react';
import classNames from 'classnames';

import CategoryBodyPlaceholder from 'images/icons/category-placeholder2.png';

const SelectListItem = ({ active, title, onClick, icon_name }) => (
  <div
    className={classNames('pairing-recommended-select-list__item', {
      'pairing-recommended-select-list__item--active': active
    })}
    onClick={onClick}
  >
    {icon_name && (
      <div className="pairing-recommended-select-list__item__img">
        <i className="material-icons">{icon_name}</i>
      </div>
    )}
    {!icon_name && (
      <img
        className="pairing-recommended-select-list__item__img"
        src={CategoryBodyPlaceholder}
        alt=""
      />
    )}
    <div className="pairing-recommended-select-list__item__title">{title}</div>
    <div className="pairing-recommended-select-list__item__icons">
      <i
        className="fa fa-link pairing-recommended-select-list__item__icon"
        aria-hidden="true"
      />
      <i
        className="fa fa-check-circle-o pairing-recommended-select-list__item__icon"
        aria-hidden="true"
      />
    </div>
  </div>
);

export default SelectListItem;
