import React, { useState, useEffect } from 'react';

import ProfileMediaAlbum from './profile-media-album';
import ProfileMediaAlbumsNew from './modals/profile-media-albums-new';
import ProfileMediaAlbumsEdit from './modals/profile-media-albums-edit';
import ProfileMediaDeleteConfirm from '../profile-media-delete-confirm';

function ProfileMediaAlbums({ profile, optionsEnable }) {
  const [addAlbumModal, setAddAlbumModal] = useState(false);
  const [editAlbumModal, setEditAlbumModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [postToDeleteFromAlbum, setPostToDeleteFromAlbum] = useState(null);

  const openAddAlbumModal = () => {
    setAddAlbumModal(true);
  };

  const closeAddAlbumModal = () => {
    setAddAlbumModal(false);
  };

  const openEditAlbumModal = albumToEdit => {
    setEditAlbumModal(true);
  };

  const closeEditAlbumModal = () => {
    setEditAlbumModal(false);
  };

  return (
    <div>
      <div className="profile-media-albums">
        <div
          className="profile-media-album profile-media-album__new"
          onClick={openAddAlbumModal}
        >
          <div className="profile-media-album__body">
            <img src="/assets/images/add-album-icon.svg" alt="" />
            <div>Create a new Album</div>
          </div>
        </div>
        <ProfileMediaAlbum
          {...{ openEditAlbumModal, optionsEnable, setAlbumToDelete }}
        />
        <ProfileMediaAlbum
          {...{ openEditAlbumModal, optionsEnable, setAlbumToDelete }}
        />
        <ProfileMediaAlbum
          {...{ openEditAlbumModal, optionsEnable, setAlbumToDelete }}
        />
        <ProfileMediaAlbum
          {...{ openEditAlbumModal, optionsEnable, setAlbumToDelete }}
        />
        <ProfileMediaAlbum
          {...{ openEditAlbumModal, optionsEnable, setAlbumToDelete }}
        />
      </div>
      <ProfileMediaAlbumsNew
        {...{
          addAlbumModal,
          closeAddAlbumModal
        }}
      />
      <ProfileMediaAlbumsEdit
        {...{
          profile,
          optionsEnable,
          editAlbumModal,
          closeEditAlbumModal,
          setPostToDeleteFromAlbum
        }}
      />
      <ProfileMediaDeleteConfirm
        {...{
          isOpen: !!albumToDelete,
          mediaSrc:
            'https://seg-testing.s3.eu-west-1.amazonaws.com/testing/1482-955a8045-b-5fb4032eb7c82.png',
          title: 'Are you sure you want to permanently erase the Album?',
          loading: false,
          onClose: () => {
            setAlbumToDelete(null);
          },
          onAccept: () => {
            setAlbumToDelete(null);
          }
        }}
      />
      <ProfileMediaDeleteConfirm
        {...{
          isOpen: !!postToDeleteFromAlbum,
          mediaSrc:
            'https://seg-testing.s3.eu-west-1.amazonaws.com/testing/1482-955a8045-b-5fb4032eb7c82.png',
          title: 'Are you sure you want to delete this from your album?',
          loading: false,
          onClose: () => {
            setPostToDeleteFromAlbum(null);
          },
          onAccept: () => {
            setPostToDeleteFromAlbum(null);
          }
        }}
      />
    </div>
  );
}

export default ProfileMediaAlbums;
