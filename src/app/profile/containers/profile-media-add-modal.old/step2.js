import React from 'react';
import cx from 'classnames';

import common from 'app/common';

const {
  components: { UISwitch, UICheckbox }
} = common;

const ProfileMediaAddModalStep2 = ({
  title,
  description,
  isPrivate,
  isShowReel,
  setTitle,
  setDescription,
  setIsPrivate,
  setIsShowReel,
  onBack,
  onUpload
}) => (
  <div className="profile-media-add-modal__step2">
    <div className="profile-media-add-modal__title">Describe media</div>
    <label
      className="label m-t-10 m-b-10 align-left"
      htmlFor="profile-media-add-modal__step2__title"
    >
      Title
    </label>
    <input
      placeholder="Please provide a title"
      className="input"
      id="profile-media-add-modal__step2__title"
      value={title}
      onChange={e => {
        setTitle(e.target.value);
      }}
    />
    <label
      className="label m-t-10 m-b-10 align-left"
      htmlFor="profile-media-add-modal__step2__description"
    >
      Description
    </label>
    <input
      placeholder="Please provide a description"
      className="input"
      id="profile-media-add-modal__step2__description"
      value={description}
      onChange={e => {
        setDescription(e.target.value);
      }}
    />
    <div className="profile-media-add-modal__category-showreel">
      <div className="profile-media-add-modal__category">
        <div className="profile-media-add-modal__category__title label">
          Category
        </div>
        <div>
          <div className="profile-media-add-modal__category__public-private-container">
            <div
              className={cx(
                'profile-media-add-modal__category__public-private',
                {
                  'profile-media-add-modal__category__public-private--selected': !isPrivate
                }
              )}
            >
              Public
            </div>
            <div
              className={cx(
                'profile-media-add-modal__category__public-private',
                {
                  'profile-media-add-modal__category__public-private--selected': isPrivate
                }
              )}
            >
              Private
            </div>
          </div>
          <UISwitch
            isActive={isPrivate}
            onChange={bool => {
              setIsPrivate(bool);
            }}
          />
        </div>
      </div>
      <div className="profile-media-add-modal__showreel">
        <div className="profile-media-add-modal__showreel__title label">
          Showreel
        </div>
        <div>
          <UICheckbox
            checked={isShowReel}
            onChange={() => {
              setIsShowReel(!isShowReel);
            }}
          />
        </div>
      </div>
    </div>
    <div className="profile-media-add-modal__step2__footer">
      <button
        className="media-upload__pagination-btn button is-link animate fade-in media-upload__pagination--previous init"
        onClick={onBack}
      >
        <i className="media-upload__pagination-btn-icon fa fa-angle-left" />
        <span>Back</span>
      </button>
      <button
        className="button is-success animate fade-in init"
        onClick={onUpload}
      >
        Upload
      </button>
    </div>
  </div>
);

export default ProfileMediaAddModalStep2;
