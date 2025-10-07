import React, { useState, useEffect } from 'react';

function ProfileMediaAlbum({
  openEditAlbumModal,
  optionsEnable,
  setAlbumToDelete
}) {
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    if (!optionsEnable) {
      setPreferencesOpen(false);
    }
  }, [optionsEnable]);

  return (
    <div className="profile-media-album">
      <div className="profile-media-album__body">
        <img
          className="profile-media-album__body__bg-img"
          src="https://seg-testing.s3.eu-west-1.amazonaws.com/testing/1482-955a8045-b-5fb4032eb7c82.png"
          alt=""
        />
        <div className="profile-media-album__body__info">
          <div className="profile-media-album__body__info__title">
            Album title
          </div>
          <div className="profile-media-album__body__info__description">
            Album description
          </div>
        </div>
      </div>
      {optionsEnable && (
        <div
          className="profile-media-album__options"
          onClick={() => {
            setPreferencesOpen(!preferencesOpen);
          }}
        >
          <i className="fa fa-ellipsis-h" />
        </div>
      )}
      {optionsEnable && (
        <div className="profile-media-album__edit" onClick={openEditAlbumModal}>
          <i className="fa fa-pencil" />
        </div>
      )}
      {preferencesOpen && (
        <div className="profile-media-album__preferences">
          <div className="profile-media-album__preferences__title">
            Preferences
          </div>
          <div className="profile-media-album__preferences__items">
            <div className="profile-media-album__preferences__item">
              <input type="radio" disabled checked readOnly />
              <span>Add to show reel</span>
            </div>
            <div className="profile-media-album__preferences__item">
              <input type="radio" disabled checked readOnly />
              <span>Add to portfolio</span>
            </div>
          </div>
          <div
            className="profile-media-album__preferences__delete"
            onClick={() => {
              setAlbumToDelete(true);
            }}
          >
            <i className="fa fa-trash-o" />
            <span>Delete Album</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMediaAlbum;
