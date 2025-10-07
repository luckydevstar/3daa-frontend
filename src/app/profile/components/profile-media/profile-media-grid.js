import React, { useState, useEffect } from 'react';
import { map, reject, propEq, prop, path } from 'ramda';

import common from 'app/common';
import ProfileMediaGridItem from './profile-media-grid-item';
import ProfileMediaDeleteConfirm from './profile-media-delete-confirm';

const {
  components: { UILoading }
} = common;

function ProfileMediaGrid({
  profile,
  selectedItem,
  items,
  editMode,
  editingPhoto,
  editingVideo,
  gettingAllMedia,
  deletingFile,
  setSelectedItem,
  optionsEnable,
  setEditMode,
  editMemberPhoto,
  editMemberVideo,
  deleteMemberMedia
}) {
  const [mediaToDelete, setMediaToDelete] = useState(null);

  const removeMediaToDelete = () => {
    setMediaToDelete(null);
  };

  const handleSetMediaToDelete = media => {
    setMediaToDelete(media);
  };

  const deleteMedia = () => {
    deleteMemberMedia(profile.member_id, mediaToDelete.media_id);
  };

  useEffect(() => {
    if (!deletingFile) {
      setMediaToDelete(null);
    }
  }, [deletingFile]);

  const itemsWithoutSelected = reject(
    propEq('media_id', prop('media_id')(selectedItem))
  )(items);
  if (gettingAllMedia)
    return <UILoading marginTop="200px" marginBottom="200px" />;
  if (items.length === 0)
    return <div className="profile-media-grid-placeholder">No Media</div>;
  return (
    <div className="profile-media-grid">
      {selectedItem && (
        <ProfileMediaGridItem
          {...{
            profile,
            media: selectedItem,
            optionsEnable,
            editMode,
            editingPhoto,
            editingVideo,
            setEditMode,
            setSelectedItem,
            editMemberPhoto,
            editMemberVideo,
            setMediaToDelete: handleSetMediaToDelete
          }}
          editale
        />
      )}
      {map(media => (
        <ProfileMediaGridItem
          {...{
            key: media.media_id,
            media,
            setSelectedItem,
            optionsEnable,
            setEditMode,
            setMediaToDelete: handleSetMediaToDelete
          }}
        />
      ))(itemsWithoutSelected)}
      <ProfileMediaDeleteConfirm
        {...{
          isOpen: !!mediaToDelete,
          mediaSrc: path(['media_url'], mediaToDelete),
          title: 'Are you sure you want to permanently erase the media?',
          loading: deletingFile,
          onClose: removeMediaToDelete,
          onAccept: deleteMedia
        }}
      />
    </div>
  );
}

export default ProfileMediaGrid;
