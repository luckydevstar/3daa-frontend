import React from 'react';
import cx from 'classnames';

import common from 'app/common';

const {
  components: { UISwitch }
} = common;

const descriptionPlaceholder = `Write a short description of the media you have uploaded, it should explain in 
words what the media represents and what is contained in the media visually. 
This will help your search later and also help mapping to your qualification as 
evidence in your portfolio`;

const ProfileMediaGridItemEdit = ({
  title,
  description,
  editMode,
  isPublic,
  showreel,
  uploadModal,
  removeButtons,
  editingPhoto,
  editingVideo,
  setIsPublic,
  setTitle,
  setDescription,
  setShowreel,
  onSave
}) => (
  <div
    className={cx('profile-media-grid__item__edit-block', {
      'profile-media-grid__item__edit-block--open': editMode
    })}
  >
    <div className="profile-media-grid__item__edit-block__input">
      <label htmlFor="media-title">Title of Media</label>
      <div className="profile-media-grid__item__edit-block__input__textarea">
        <div className="profile-media-grid__item__edit-block__input__textarea__required">
          *
        </div>
        <textarea
          id="media-title"
          placeholder="Give the media a title to help your search"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
        />
      </div>
    </div>
    <div className="profile-media-grid__item__edit-block__input">
      <label htmlFor="media-description">Description of Media</label>
      <div
        className="profile-media-grid__item__edit-block__input__textarea"
        style={{ height: '235px' }}
      >
        <div className="profile-media-grid__item__edit-block__input__textarea__required">
          *
        </div>
        <textarea
          id="media-description"
          placeholder={descriptionPlaceholder}
          value={description}
          onChange={e => {
            setDescription(e.target.value);
          }}
        />
      </div>
    </div>
    <div className="profile-media-grid__item__edit-block__required-description">
      <div>*</div>
      <div>All fields must be completed before the media is saved</div>
    </div>
    <div className="profile-media-grid__item__edit-block__public-private">
      <div
        className={cx(
          'profile-media-grid__item__edit-block__public-private__item',
          {
            'profile-media-grid__item__edit-block__public-private__item--selected': isPublic
          }
        )}
      >
        Public
      </div>
      <div
        className={cx(
          'profile-media-grid__item__edit-block__public-private__item',
          {
            'profile-media-grid__item__edit-block__public-private__item--selected': !isPublic
          }
        )}
      >
        Private
      </div>
    </div>
    <div className="profile-media-grid__item__edit-block__footer">
      <UISwitch
        isActive={!isPublic}
        onChange={bool => {
          setIsPublic(!bool);
        }}
      />
      <div className="profile-media-grid__item__edit-block__footer__buttons">
        {!removeButtons && (
          <button className="button profile-media-grid__item__edit-block__footer__buttons__cancel">
            Cancel
          </button>
        )}
        {!removeButtons && (
          <button
            className={cx(
              'button',
              'profile-media-grid__item__edit-block__footer__buttons__save',
              {
                'is-loading': editingPhoto || editingVideo
              }
            )}
            onClick={onSave}
          >
            Save
          </button>
        )}
        {uploadModal && (
          <div
            className="profile-media-grid__item__edit-block__footer__showreel"
            onClick={() => {
              setShowreel(!showreel);
            }}
          >
            <input type="radio" checked={showreel} readOnly />
            <div>Add to showreel</div>
          </div>
        )}
      </div>
    </div>
    <div className="profile-media-grid__item__edit-block__private-public__desc">
      {isPublic && 'This media will be seen by other users'}
      {!isPublic && 'This media will not be seen by other users'}
    </div>
  </div>
);

export default ProfileMediaGridItemEdit;
