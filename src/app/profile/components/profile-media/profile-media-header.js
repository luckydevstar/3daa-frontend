import React from 'react';
import cx from 'classnames';
import { path } from 'ramda';

import common from 'app/common';
import isAllowedAccess from '../../helpers/helpers';

const {
  components: { ProgressBadge },
  util: {
    helpers: { createCloudinaryUrl, getCommunityProfilePhotoUrl }
  }
} = common;

const ProfileMediaHeaderTab = ({
  tabName,
  tabTitle,
  count,
  selectedTab,
  onClick
}) => (
  <div
    className={cx('profile-media-header__nav__item', {
      'profile-media-header__nav__item--selected': selectedTab === tabName
    })}
    onClick={onClick}
  >
    <div className="profile-media-header__nav__item__name">{tabTitle}</div>
    <div className="profile-media-header__nav__item__count">{count}</div>
  </div>
);

const ProfileMediaHeader = ({
  profile,
  user,
  posts,
  selectedTab,
  setSelectedTab
}) => {
  const setPosts = () => {
    setSelectedTab('posts');
  };

  const setAlbums = () => {
    setSelectedTab('albums');
  };

  const setPortfolio = () => {
    setSelectedTab('portfolio');
  };

  const setDocuments = () => {
    setSelectedTab('documents');
  };

  const hasProfileImage = path(['cloudinary_file_id'], profile);
  const profilePhotoUrl = profile && getCommunityProfilePhotoUrl(profile);

  return (
    <div className="profile-media-header">
      <div className="profile-media-header__user">
        <div
          className={`course-progress__badge progress-badge ${hasProfileImage &&
            'course-progress__badge--is-photo'}`}
        >
          <div
            className="course-progress__avatar"
            style={{
              backgroundImage: `url(${createCloudinaryUrl(
                profilePhotoUrl,
                'image'
              )})`
            }}
          />
          {isAllowedAccess(profile, user, 'CENTRE_LEARNER_ROLE') && (
            <ProgressBadge
              dimensions={180}
              strokeWidth={10}
              percentage={
                profile && profile.current_qualification
                  ? profile.current_qualification.progress_percentage
                  : 0
              }
              percentageFontSize={61}
            />
          )}
        </div>
      </div>
      <div className="profile-media-header__nav">
        <ProfileMediaHeaderTab
          {...{
            selectedTab,
            tabName: 'posts',
            tabTitle: 'POSTS',
            count: posts.length,
            onClick: setPosts
          }}
        />
        {/* <ProfileMediaHeaderTab
          {...{
            selectedTab,
            tabName: 'albums',
            tabTitle: 'ALBUMS',
            count: 5,
            onClick: setAlbums
          }}
        /> */}
        {/* <ProfileMediaHeaderTab
          {...{
            selectedTab,
            tabName: 'portfolio',
            tabTitle: 'PORTFOLIO',
            count: 22,
            onClick: setPortfolio,
          }}
        /> */}
        {/* <ProfileMediaHeaderTab
          {...{
            selectedTab,
            tabName: 'documents',
            tabTitle: 'DOCUMENTS & CERTIFICATES',
            count: 3,
            onClick: setDocuments
          }}
        /> */}
      </div>
    </div>
  );
};

export default ProfileMediaHeader;
