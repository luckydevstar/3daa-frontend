import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as lodash from 'lodash';

import common from 'app/common';
import { Creators } from '../actions';

import { CourseProgress, References, SocialLinks } from '../components/blocks';

import {
  ProfileMediaAdd,
  ProfileOverview,
  ProfilePhotos,
  ProfileVideos,
  ProfileMedia,
  ProfileBadges,
  ProfileReferences
} from '../containers';

const {
  components: { ContentModalNew, MediaLightbox }
} = common;

const buildTabView = props => {
  const { memberId, isLoggedInUser } = props;
  const profile = () => <ProfileOverview {...{ isLoggedInUser, memberId }} />;
  const photos = () => <ProfilePhotos {...{ isLoggedInUser }} />;
  const videos = () => <ProfileVideos {...{ isLoggedInUser }} />;
  const badges = () => <ProfileBadges {...{ isLoggedInUser }} />;
  const media = () => <ProfileMedia {...{ isLoggedInUser }} />;

  const references = () => <ProfileReferences />;

  return {
    profile,
    photos,
    videos,
    media,
    badges,
    references
  };
};

const ProfileBody = ({
  activeTab,
  memberId,
  isLoggedInUser,
  profile,
  user,
  bio,
  location,
  references,
  gettingReferences,
  gettingMember,
  toggleAddPhoto,
  addingPhoto,
  editingPhoto,
  viewingMedia,
  onViewMedia,
  attemptEditMemberPhoto,
  attemptEditMemberVideo,
  attemptDeleteMemberPhoto,
  attemptDeleteMemberVideo
}) => {
  const tabView = buildTabView({ memberId, isLoggedInUser });
  const activeTabView = tabView[activeTab].call();
  const prevPath = lodash.get(location, 'state.prevPath');

  return (
    <section className="content-section profile-content">
      <div className="container">
        <div className="columns">
          {activeTab !== 'media' && (
            <div className="column sidebar-left is-one-quarter">
              <CourseProgress {...{ profile, bio, user, gettingMember }} />
              {/* <References {...{ references, gettingReferences }} /> */}
              <SocialLinks {...{ user }} />
            </div>
          )}
          <div className="column">
            <div
              className={classNames('columns profile-section-right', {
                black: !!prevPath
              })}
            >
              {activeTabView}
            </div>
          </div>
        </div>
      </div>

      <ContentModalNew isOpened={addingPhoto} onClose={toggleAddPhoto}>
        <ProfileMediaAdd onComplete={toggleAddPhoto} />
      </ContentModalNew>

      <MediaLightbox
        {...{
          isOpened: !!viewingMedia,
          onClose: onViewMedia,
          editingMedia: editingPhoto,
          media: viewingMedia,
          isLoggedInUser,
          onEditMemberMedia: data =>
            data.type === 'video'
              ? attemptEditMemberVideo(data)
              : attemptEditMemberPhoto(data),
          onDeleteMemberMedia: data =>
            data.type === 'video'
              ? attemptDeleteMemberVideo(data)
              : attemptDeleteMemberPhoto(data)
        }}
        enableAddEvidence={prevPath}
      />
    </section>
  );
};

ProfileBody.defaultProps = {
  activeTab: 'profile'
};

const mapStateToProps = ({ profileBio, profile: { user } }) => ({
  ...profileBio,
  user
});

const mapDispatchToProps = dispatch => ({
  attemptEditMemberPhoto: data =>
    dispatch(
      Creators.editMemberPhotoAttempt(
        data.object_id,
        data.media_id,
        data.params
      )
    ),
  attemptEditMemberVideo: data =>
    dispatch(
      Creators.editMemberVideoAttempt(
        data.object_id,
        data.media_id,
        data.params
      )
    ),
  attemptDeleteMemberPhoto: data =>
    dispatch(Creators.deleteMemberPhotoAttempt(data.object_id, data.media_id)),
  attemptDeleteMemberVideo: data =>
    dispatch(Creators.deleteMemberVideoAttempt(data.object_id, data.media_id)),
  onViewMedia: media => dispatch(Creators.viewMedia(media)),
  toggleAddPhoto: () => dispatch(Creators.toggleAddPhoto())
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBody);
