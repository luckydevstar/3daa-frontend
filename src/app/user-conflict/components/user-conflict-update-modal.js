import React from 'react';

const UserConflictUpdateModal = ({ onClose, email }) => (
  <div className="user-conflict__update-modal">
    <div className="user-conflict__update-modal__body">
      <div className="user-conflict__update-modal__body__info">
        <span>Your update was successful</span>
        {` and an email has been sent to: `}
        <span className="user-conflict__update-modal__body__info__email">
          {email}
        </span>
      </div>
      <div
        className="user-conflict__update-modal__body__footer"
        onClick={onClose}
      >
        <span>Close</span>
        <img src="/assets/images/close.png" alt="close" />
      </div>
    </div>
  </div>
);

export default UserConflictUpdateModal;
