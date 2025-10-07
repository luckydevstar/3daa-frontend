import React from 'react';
import cx from 'classnames';

import common from 'app/common';

const {
  components: { ContentModalNew }
} = common;

function ProfileMediaDeleteConfirm({
  isOpen,
  mediaSrc,
  title,
  loading,
  onClose,
  onAccept
}) {
  return (
    <ContentModalNew
      isOpened={isOpen}
      onClose={onClose}
      className="profile-media-delete-confirm-container"
    >
      <div className="profile-media-delete-confirm">
        <div className="profile-media-delete-confirm__header" />
        <div className="profile-media-delete-confirm__body">
          <img src={mediaSrc} alt="" />
          <div className="profile-media-delete-confirm__body__info">
            <div className="profile-media-delete-confirm__body__info__title">
              {title}
            </div>
            <div className="profile-media-delete-confirm__body__info__warn">
              You can't undo this action.
            </div>
          </div>
        </div>
        <div className="profile-media-delete-confirm__footer">
          <button className="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className={cx('button', {
              'is-loading': loading
            })}
            onClick={onAccept}
          >
            Delete
          </button>
        </div>
      </div>
    </ContentModalNew>
  );
}

export default ProfileMediaDeleteConfirm;
