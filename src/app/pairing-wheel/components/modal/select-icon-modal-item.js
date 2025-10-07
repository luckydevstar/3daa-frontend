import React from 'react';
import classNames from 'classnames';

const SelectIconModalItem = ({ icon_name, active, onClick }) => (
  <div className="pairing-wheel__select-icon-content__icon__container">
    <div
      className={classNames('pairing-wheel__select-icon-content__icon', {
        'pairing-wheel__select-icon-content__icon--active': active
      })}
      onClick={onClick}
    >
      <div className="pairing-wheel__select-icon-content__icon__mark-box">
        <i className="material-icons">check</i>
      </div>
      <i className="material-icons">{icon_name}</i>
    </div>
  </div>
);

export default SelectIconModalItem;
