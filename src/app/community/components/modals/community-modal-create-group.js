import React, { useRef, useEffect, useState } from 'react';
import cx from 'classnames';

import common from 'app/common';
import DefaultPreview from 'images/icon_profile_brand.svg';
import { RoleNameMap } from 'app/core/config/constants';

const {
  components: { ContentModalNew, UICheckbox },
  util: {
    helpers: { extractUserRole }
  }
} = common;

function communityModalCreateGroup({
  user,
  isOpen,
  onClose,
  attemptingGroupUsers,
  attemptingCreateGroup,
  searchGroupMembers,
  groupUsers,
  communityGroupCreate
}) {
  const [title, setTitle] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [search, setSearch] = useState('');
  const [searchTimer, setSearchTimer] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const modalRef = useRef(null);

  const changeGroupImage = e => {
    let file = e.target.files[0];
    if (file) {
      file.preview = URL.createObjectURL(file);
      setGroupImage(file);
    }
  };

  const handleSearch = e => {
    const { value } = e.target;
    setSearch(value);
    if (value.length > 2) {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      setSearchTimer(
        setTimeout(() => {
          searchGroupMembers({
            search,
            centre_roles: ['CENTRE_LEARNER_ROLE'],
            all: 1
          });
        }, 500)
      );
    }
  };

  const getUserRole = user => {
    const role = user && user.centre_roles && user.centre_roles[0];
    const roleName = RoleNameMap[role] || 'member';
    return roleName;
  };

  const isUserSelected = user => {
    return selectedUsers.find(u => u.member_id === user.member_id);
  };

  const userSelectClick = user => {
    if (isUserSelected(user)) {
      setSelectedUsers(
        selectedUsers.filter(u => u.member_id !== user.member_id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const createCommunityGroup = () => {
    const params = {
      members: [...selectedUsers, user].map(u => u.member_id),
      learners: [],
      cloudinary_file_id: groupImage,
      title
    };
    communityGroupCreate(params);
  };

  useEffect(() => {
    if (isOpen) {
      modalRef.current.open();
    } else {
      modalRef.current.close();
    }
  }, [isOpen]);

  return (
    <ContentModalNew
      size="larger"
      onClose={onClose}
      ref={modalRef}
      className="community-modal-create-group-container"
    >
      <div className="community-modal-create-group">
        <div className="community-modal-create-group__title">
          Create New Group
        </div>
        <div className="community-modal-create-group__description">
          Please provide a title, image and members for the new group
        </div>
        <div className="community-modal-create-group__group-title">
          <label htmlFor="community-modal-create-group__group-title">
            Group Title
          </label>
          <input
            onChange={e => setTitle(e.target.value)}
            value={title}
            className="input"
            id="community-modal-create-group__group-title"
            placeholder="Insert Group title"
          />
        </div>
        <div className="community-modal-create-group__group-image">
          <label htmlFor="community-modal-create-group__group-image__select">
            <div className="community-modal-create-group__group-image__title">
              Group Image
            </div>
            <div className="community-modal-create-group__group-image__select">
              {!groupImage && <img src={DefaultPreview} />}
              {groupImage && <img src={groupImage.preview} />}
              <span>Select Group Image</span>
            </div>
            <input
              type="file"
              id="community-modal-create-group__group-image__select"
              onChange={changeGroupImage}
            />
          </label>
        </div>
        <div className="community-modal-create-group__selected-users">
          <div className="community-modal-create-group__selected-users__title">
            {`${selectedUsers.length} Members selected`}
          </div>
          <div className="community-modal-create-group__selected-users__items">
            {selectedUsers.map(u => (
              <div
                className="community-modal-create-group__selected-users__item"
                onClick={() => {
                  userSelectClick(u);
                }}
                key={user.member_id}
              >
                <span>{u.screen_name}</span>
                <i className="fa fa-times" />
              </div>
            ))}
          </div>
        </div>
        <div className="community-modal-create-group__search">
          <div className="community-modal-create-group__search__input">
            <input
              placeholder="Search by Name"
              onChange={handleSearch}
              value={search}
            />
            <i className="fa fa-search" />
            {attemptingGroupUsers && <button className="button is-loading" />}
          </div>
          <div className="community-modal-create-group__search__users-head">
            <div className="community-modal-create-group__search__users-head__item" />
            <div className="community-modal-create-group__search__users-head__item">
              Profile Name
            </div>
            <div className="community-modal-create-group__search__users-head__item">
              Qualification
            </div>
            <div className="community-modal-create-group__search__users-head__item">
              user
            </div>
            <div className="community-modal-create-group__search__users-head__item">
              <UICheckbox checked={false} onChange={() => {}} />
            </div>
          </div>
          <div className="community-modal-create-group__search__users-body">
            {groupUsers.map(user => (
              <div
                key={user.member_id}
                className="community-modal-create-group__search__users-body__item"
              >
                <div className="community-modal-create-group__search__users-body__item__inner community-modal-create-group__search__users-body__item__avatar">
                  {user.cloudinary_file_id && (
                    <img src={user.cloudinary_file_id} />
                  )}
                  {!user.cloudinary_file_id && (
                    <div className="community-modal-create-group__search__users-body__item__avatar__placeholder" />
                  )}
                </div>
                <div className="community-modal-create-group__search__users-body__item__inner community-modal-create-group__search__users-body__item__name">
                  {user.screen_name}
                </div>
                <div className="community-modal-create-group__search__users-body__item__inner">
                  {user.current_qualification && (
                    <span>{user.current_qualification.title}</span>
                  )}
                </div>
                <div className="community-modal-create-group__search__users-body__item__inner">
                  {getUserRole(user)}
                </div>
                <div className="community-modal-create-group__search__users-body__item__inner">
                  <UICheckbox
                    checked={isUserSelected(user)}
                    onChange={() => {
                      userSelectClick(user);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="community-modal-create-group__search__buttons">
          <button className="button is-outlined" onClick={onClose}>
            Cancel
          </button>
          <button
            className={cx(
              [
                'button',
                'is-primary',
                'community-modal-create-group__search__buttons__create-group'
              ],
              {
                'is-loading': attemptingCreateGroup
              }
            )}
            onClick={createCommunityGroup}
          >
            Create Group
          </button>
        </div>
      </div>
    </ContentModalNew>
  );
}

export default communityModalCreateGroup;
