import React from 'react';

const UserConflictHeader = () => (
  <div className="user-conflict__header">
    <div className="container">
      <div className="user-conflict__header__content">
        <button className="user-conflict__header__content__back">
          <i className="fa fa-angle-left" />
        </button>
        <div className="user-conflict__header__content__info">
          <div className="user-conflict__header__content__info__title">
            User Conflict
          </div>
          <div className="user-conflict__header__content__info__description">
            Users that have registered with incorrect credentials
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default UserConflictHeader;
