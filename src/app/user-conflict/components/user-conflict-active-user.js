import React from 'react';
import cx from 'classnames';

const UserConflictActiveUser = ({
  user,
  amendedName,
  email,
  userUpdateLoading,
  setEmail,
  removeActiveUser,
  updateEmail
}) => (
  <div className="user-conflict__active-user">
    <div
      className="user-conflict__active-user__close"
      onClick={removeActiveUser}
    >
      <span>Close</span>
      <img src="/assets/images/close.png" alt="close" />
    </div>
    {!user.cloudinary_file_id && (
      <div className="user-conflict_active-user__avatar">
        <img
          src={
            user.gender === 1
              ? '/assets/images/icon_profile_blue.svg'
              : '/assets/images/icon_femaie.png'
          }
          alt="avatar"
        />
      </div>
    )}
    {user.cloudinary_file_id && (
      <img
        className="user-conflict_active-user__avatar"
        src={user.cloudinary_file_id}
        alt="avatar"
      />
    )}

    <div className="user-conflict_active-user__input">
      <input value={user.email} readOnly />
    </div>
    <div className="user-conflict_active-user__input">
      <input
        placeholder="enter new email"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
        }}
      />
    </div>
    <button
      onClick={updateEmail}
      className={cx('button', {
        'is-loading': userUpdateLoading
      })}
    >
      Update
    </button>
    <div className="user-conflict__active-user__info">
      {amendedName ? 'Registration amended by' : ''}
    </div>
    <div className="user-conflict__active-user__info">{amendedName || ''}</div>
    <div className="user-conflict__active-user__info">Date Registered</div>
    <div className="user-conflict__active-user__info">
      {user.join_date || ''}
    </div>
  </div>
);

export default UserConflictActiveUser;
