import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import Cropper from 'cropperjs';
import ReactSlider from 'react-slider';

import common from 'app/common';
import ProfileMediaGridItemEdit from './profile-media-grid-item-edit';

const {
  helpers: { convertToFormData }
} = common.util;

function ProfileMediaGridItem({
  profile,
  media,
  uploadModal,
  removeButtons,
  editMode,
  optionsEnable,
  editingPhoto,
  editingVideo,
  setSelectedItem,
  setMediaToDelete,
  editale,
  setEditMode,
  editMemberPhoto,
  editMemberVideo,
  closeModal
}) {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [showreel, setShowreel] = useState(false);
  const [cropper, setCropper] = useState(null);
  const [zoomValue, setZoomValue] = useState(0);
  const cropRef = useRef(null);

  const optionsClick = e => {
    e.stopPropagation();
    setPreferencesOpen(!preferencesOpen);
  };

  const setZoom = value => {
    if (cropper) {
      cropper.zoom(value - zoomValue);
      setZoomValue(value);
    }
  };

  const rotate = () => {
    if (cropper) {
      cropper.rotate(45);
    }
  };

  const changeEditMode = () => {
    setEditMode(!editMode);
  };

  const save = () => {
    const params = {
      title,
      description,
      is_public: isPublic ? 1 : 0,
      showreel: showreel ? 1 : 0
    };
    if (media.type === 'photo') {
      editMemberPhoto(profile.member_id, media.media_id, params);
    } else {
      editMemberVideo(profile.member_id, media.media_id, params);
    }
  };

  const updateShowreel = () => {
    const params = {
      showreel: showreel ? 0 : 1
    };
    setShowreel(!showreel);
    if (media.type === 'photo') {
      editMemberPhoto(profile.member_id, media.media_id, params);
    } else {
      editMemberVideo(profile.member_id, media.media_id, params);
    }
  };

  useEffect(() => {
    if (media && media.type !== 'photo') return;
    if (editMode && editale) {
      const cropper = new Cropper(cropRef.current, {
        aspectRatio: null,
        zoomOnWheel: false,
        checkCrossOrigin: true
      });
      setCropper(cropper);
    } else if (!editMode && editale && cropper) {
      cropper.destroy();
    }
  }, [editMode]);

  useEffect(() => {
    if (media.type === 'photo' && !editingPhoto) {
      setEditMode(false);
    } else if (media.type === 'video' && !editingVideo) {
      setEditMode(false);
    }
  }, [editingPhoto, editingVideo]);

  useEffect(() => {
    if (media) {
      setTitle(media.title);
      setDescription(media.description);
      setIsPublic(!!media.is_public);
      setShowreel(!!media.showreel);
    }
  }, []);

  return (
    <React.Fragment>
      {uploadModal && (
        <div className="profile-media-grid__item--full-width">
          <div className="profile-media-update__description-container">
            <div className="profile-media-update__description">
              Providing a clear and accurate description <br />
              helps you and others know what it is about.
            </div>
            <div className="profile-media-update__buttons">
              <button
                className="button profile-media-update__button__cancel"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className={cx('button', {
                  'is-loading': editingPhoto || editingVideo
                })}
                onClick={save}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={cx('profile-media-grid__item', {
          'profile-media-grid__item--first': editale,
          'profile-media-grid__item--upload-modal': uploadModal & editale
        })}
        onClick={() => {
          setSelectedItem(media);
        }}
      >
        {media && (
          <div
            className={cx('profile-media-grid__item__inner', {
              'profile-media-grid__item__inner--object-contain': editale
            })}
          >
            {media.type === 'photo' && (
              <img src={media.media_url} ref={cropRef} alt="" />
            )}
            {media.type === 'video' && media.thumbnail && (
              <img src={media.thumbnail} alt="" />
            )}
            {media.type === 'video' && !media.thumbnail && (
              <video>
                <source src={media.media_url} />
              </video>
            )}
            {editale && editMode && cropper && media.type === 'photo' && (
              <div className="profile-media-grid__item__crop-controls">
                <div className="profile-media-grid__item__crop-controls__zoom">
                  <i className="fa fa-picture-o zoom-out-icon" />
                  <ReactSlider
                    className="horizontal-slider"
                    min={0}
                    max={2}
                    step={0.05}
                    onChange={setZoom}
                    value={zoomValue}
                  />
                  <i className="fa fa-picture-o zoom-in-icon" />
                </div>
                <img
                  onClick={rotate}
                  className="rotate-icon"
                  src="/assets/images/rotate-icon.png"
                  alt=""
                />
              </div>
            )}
          </div>
        )}
        {optionsEnable && (
          <div
            className="profile-media-grid__item__remove"
            onClick={optionsClick}
          >
            <i className="fa fa-ellipsis-h" />
          </div>
        )}
        {optionsEnable && (
          <div
            className="profile-media-grid__item__edit"
            onClick={changeEditMode}
          >
            <i className="fa fa-pencil" />
          </div>
        )}
        {preferencesOpen && (
          <div className="profile-media-album__preferences">
            <div className="profile-media-album__preferences__title">
              Preferences
            </div>
            <div className="profile-media-album__preferences__items">
              <div
                className="profile-media-album__preferences__item"
                onClick={updateShowreel}
              >
                <input type="radio" disabled={!showreel} checked readOnly />
                <span>Add to show reel</span>
              </div>
              <div className="profile-media-album__preferences__item">
                <input type="radio" disabled checked readOnly />
                <span>Make Profile Image</span>
              </div>
              <div className="profile-media-album__preferences__item">
                <input type="radio" disabled checked readOnly />
                <span>Add to Portfolio</span>
              </div>
              <div className="profile-media-album__preferences__item">
                <input type="radio" disabled checked readOnly />
                <span>Move to Album</span>
              </div>
            </div>
            <div
              className="profile-media-album__preferences__delete"
              onClick={() => {
                setMediaToDelete(media);
              }}
            >
              <i className="fa fa-trash-o" />
              <span>Delete Media</span>
            </div>
          </div>
        )}
        {editale && (
          <ProfileMediaGridItemEdit
            {...{
              title,
              description,
              editMode,
              isPublic,
              showreel,
              removeButtons,
              editingPhoto,
              editingVideo,
              uploadModal,
              setIsPublic,
              setTitle,
              setDescription,
              setShowreel,
              onSave: save
            }}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default ProfileMediaGridItem;
