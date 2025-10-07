import React from 'react';

const UserConflictDeleteModal = ({ onClose, onDelete }) => (
  <div className="user-conflict__delete-modal">
    <h2>Are you sure you want to delete this user?</h2>
    <div className="user-conflict__delete-modal__buttons">
      <button className="button" onClick={onClose}>
        Cancel
      </button>
      <button className="button is-primary" onClick={onDelete}>
        Delete
      </button>
    </div>
  </div>
);

export default UserConflictDeleteModal;
