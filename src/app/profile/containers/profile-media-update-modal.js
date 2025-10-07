import React, { useEffect } from 'react';

import common from 'app/common';

import ProfileMediaGridItem from '../components/profile-media/profile-media-grid-item';

const {
  components: { ContentModalNew }
} = common;

function ProfileMediaUpdateModal({
  isOpen,
  onClose,
  profile,
  selectedItem,
  loading,
  editMemberPhoto,
  editMemberVideo
}) {
  useEffect(() => {
    if (!loading) {
      onClose();
    }
  }, [loading]);

  return (
    <ContentModalNew
      size="larger"
      isOpened={isOpen}
      onClose={onClose}
      className="profile-media-update-modal-container"
    >
      <div className="profile-media-update-modal">
        <div className="profile-media-update-modal__title-container">
          <div className="profile-media-update-modal__title">New Post</div>
          <div className="profile-media-update-modal__sub-title">
            Describe the Post
          </div>
          <div />
        </div>
        <div className="profile-media-grid">
          <ProfileMediaGridItem
            {...{
              profile,
              media: selectedItem,
              optionsEnable: false,
              editMode: true,
              editingPhoto: loading,
              editingVideo: false,
              setEditMode: () => {},
              setSelectedItem: () => {},
              editMemberPhoto: editMemberPhoto,
              editMemberVideo: editMemberVideo,
              setMediaToDelete: () => {},
              closeModal: onClose
            }}
            editale
            removeButtons
            uploadModal
          />
        </div>
      </div>
    </ContentModalNew>
  );
}

export default ProfileMediaUpdateModal;
