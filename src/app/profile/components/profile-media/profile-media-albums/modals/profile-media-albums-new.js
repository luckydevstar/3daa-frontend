import React, { useState, useEffect } from 'react';

import common from 'app/common';

const {
  components: { ContentModalNew }
} = common;

function ProfileMediaAlbumsNew({ addAlbumModal, closeAddAlbumModal }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const closeModal = () => {
    setTitle('');
    setDescription('');
    closeAddAlbumModal();
  };

  return (
    <ContentModalNew
      size="larger"
      isOpened={addAlbumModal}
      onClose={closeModal}
    >
      <div className="profile-media-albums-new">
        <div className="profile-media-albums-new__title">New Album</div>
        <div className="profile-media-albums-new__sub-title">
          Enter a name for this album and a short description
        </div>
        <input
          {...{
            placeholder: 'Title',
            value: title,
            onChange: e => {
              setTitle(e.target.value);
            }
          }}
        />
        <textarea
          {...{
            placeholder: 'Description',
            value: description,
            onChange: e => {
              setDescription(e.target.value);
            }
          }}
        />
        <div className="profile-media-albums-new__buttons">
          <button
            className="profile-media-albums-new__buttons__cancel"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button>Save</button>
        </div>
      </div>
    </ContentModalNew>
  );
}

export default ProfileMediaAlbumsNew;
