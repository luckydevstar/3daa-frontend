import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  path,
  filter,
  toLower,
  cond,
  prop,
  includes,
  always,
  T,
  equals
} from 'ramda';

import { Creators } from '../actions';
import { ProfileMedia as ProfileMediaComponents } from '../components';
import ProfileMediaAddModal from './profile-media-add-modal';
import ProfileMediaUpdateModal from './profile-media-update-modal';

const filters = [
  { id: 1, title: 'All POSTS' },
  { id: 2, title: 'View by date' },
  { id: 3, title: 'Required Approval' },
  { id: 4, title: 'Approved' },
  { id: 5, title: 'Videos' },
  { id: 6, title: 'Photos' },
  { id: 7, title: 'Showreel' }
];

const {
  ProfileMediaHeader,
  ProfileMediaOptions,
  ProfileMediaGrid,
  ProfileMediaAlbums,
  ProfileMediaDocuments
} = ProfileMediaComponents;

function ProfileMedia({
  mediaItems,
  profile,
  user,
  editingPhoto,
  editingVideo,
  updateMediaModal,
  postingMemberPhoto,
  postingMemberVideo,
  gettingAllMedia,
  deletingFile,
  editMemberPhoto,
  editMemberVideo,
  postMemberPhoto,
  postMemberVideo,
  deleteMemberMedia,
  closeUpdateMediaModal
}) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedTab, setSelectedTab] = useState('posts');
  const [selectedItem, setSelectedItem] = useState(null);
  const [optionsEnable, setOptionsEnable] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addMediaModal, setAddMediaModal] = useState(false);
  const [addDocumentModal, setAddDocumentModal] = useState(false);
  const [addMediaProgress, setAddMediaProgress] = useState(0);

  const closeAddDocumentModal = () => {
    setAddDocumentModal(false);
  };

  const openAddDocumentModal = () => {
    setAddDocumentModal(true);
  };

  const changeOptionsEnable = () => {
    setOptionsEnable(!optionsEnable);
  };

  const onSearch = e => {
    const { value } = e.target;
    if (value === '') {
      setItems([...mediaItems]);
    } else {
      const itemsToFilter = [...mediaItems];
      const filteredItems = filter(media =>
        includes(toLower(value), toLower(prop('title', media)))
      )(itemsToFilter);

      setItems(filteredItems);
    }
    setSearch(value);
  };

  const openAddMediaModal = () => {
    setAddMediaModal(true);
  };

  const closeAddMediaModal = () => {
    setAddMediaProgress(0);
    setAddMediaModal(false);
  };

  const uploadMedia = file => {
    const data = {
      member_id: profile.member_id,
      progressCallback: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setAddMediaProgress(percentCompleted);
      },
      payload: {
        file
      }
    };
    if (includes('image', file.type)) {
      postMemberPhoto(data);
    } else if (includes('video', file.type)) {
      postMemberVideo(data);
    }
  };

  const applyFilter = filter => {
    switch (filter.id) {
      case 1: {
        setItems([...mediaItems]);
        break;
      }
      case 2: {
        const itemsByData = [...mediaItems].sort((a, b) => {
          const firstDate = moment(a.created);
          const secondDate = moment(b.created);
          return moment(firstDate).diff(secondDate);
        });
        setItems([...itemsByData]);
        break;
      }
      case 3: {
        setItems([...mediaItems]);
        break;
      }
      case 4: {
        setItems([...mediaItems]);
        break;
      }
      case 5: {
        setItems([...mediaItems].filter(item => item.type === 'video'));
        break;
      }
      case 6: {
        setItems([...mediaItems].filter(item => item.type === 'photo'));
        break;
      }
      case 7: {
        setItems([...mediaItems].filter(item => !!item.showreel));
        break;
      }
      default: {
        setItems([...mediaItems]);
        break;
      }
    }
    setSelectedFilter(filter);
  };

  useEffect(() => {
    if (mediaItems.length !== items.length) {
      console.log('RENERED');
      setItems([...mediaItems]);
    }
  }, [mediaItems]);

  useEffect(() => {
    if (items.length === 0) {
      setSelectedItem(null);
    } else {
      setSelectedItem(items[0]);
    }
  }, [items]);

  useEffect(() => {
    if (updateMediaModal) {
      closeAddMediaModal();
    }
  }, [updateMediaModal]);

  return (
    <div className="profile-media">
      <ProfileMediaHeader
        {...{
          user,
          profile,
          posts: items,
          selectedTab,
          setSelectedTab
        }}
      />
      <ProfileMediaOptions
        {...{
          filters,
          search,
          selectedFilter,
          setSelectedFilter: applyFilter,
          changeOptionsEnable,
          onSearch,
          openAddMediaModal,
          openAddDocumentModal,
          isPostsPage: selectedTab === 'posts',
          isDocumentsPage: selectedTab === 'documents'
        }}
      />
      {cond([
        [
          equals('posts'),
          always(
            <ProfileMediaGrid
              {...{
                profile,
                selectedItem,
                items,
                editMode,
                optionsEnable,
                editingPhoto,
                editingVideo,
                gettingAllMedia,
                deletingFile,
                setSelectedItem,
                setEditMode,
                editMemberPhoto,
                editMemberVideo,
                deleteMemberMedia
              }}
            />
          )
        ],
        [
          equals('albums'),
          always(
            <ProfileMediaAlbums
              {...{
                optionsEnable
              }}
            />
          )
        ],
        [
          equals('documents'),
          always(
            <ProfileMediaDocuments
              {...{
                addDocumentModal,
                closeAddDocumentModal
              }}
            />
          )
        ],
        [T, null]
      ])(selectedTab)}

      <ProfileMediaAddModal
        {...{
          isOpen: addMediaModal,
          onClose: closeAddMediaModal,
          onFileChange: uploadMedia,
          progress: addMediaProgress,
          uploading: postingMemberPhoto || postingMemberVideo
        }}
      />

      <ProfileMediaUpdateModal
        {...{
          isOpen: updateMediaModal,
          onClose: closeUpdateMediaModal,
          profile,
          selectedItem,
          loading: editingPhoto || editingVideo,
          editMemberPhoto,
          editMemberVideo
        }}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  mediaItems: path(['profileBio', 'mediaItems'], state),
  profile: path(['profileBio', 'profile'], state),
  user: path(['profile', 'user'], state),
  editingPhoto: path(['profileBio', 'editingPhoto'], state),
  editingVideo: path(['profileBio', 'editingVideo'], state),
  postingMemberPhoto: path(['profileBio', 'postingMemberPhoto'], state),
  postingMemberVideo: path(['profileBio', 'postingMemberVideo'], state),
  gettingAllMedia: path(['profileBio', 'gettingAllMedia'], state),
  deletingFile: path(['profileBio', 'deletingFile'], state),
  updateMediaModal: path(['profileBio', 'updateMediaModal'], state)
});

const mapDispatchToProps = dispatch => ({
  editMemberPhoto: (member_id, media_id, params) => {
    dispatch(Creators.editMemberPhotoAttempt(member_id, media_id, params));
  },
  editMemberVideo: (member_id, media_id, params) => {
    dispatch(Creators.editMemberVideoAttempt(member_id, media_id, params));
  },
  postMemberPhoto: data => {
    dispatch(Creators.postMemberPhotoAttempt(data));
  },
  postMemberVideo: data => {
    dispatch(Creators.postMemberVideoAttempt(data));
  },
  deleteMemberMedia: (member_id, media_id) => {
    dispatch(Creators.deleteMemberMediaAttempt(member_id, media_id));
  },
  closeUpdateMediaModal: () => {
    dispatch(Creators.closeUpdateMediaModal());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMedia);
