import React from 'react';
import { connect } from 'react-redux';
import { Creators } from '../actions';
import { Feed, Community, Media, DigitalBadges } from '../components/blocks';
import { convertToFormData } from 'app/common/util/helpers';

import userUtils from 'app/user';
import isAllowedAccess from '../helpers/helpers';

class ProfileOverview extends React.Component {
  render() {
    const {
      bio,
      memberId,
      isLoggedInUser,
      profile,
      user,
      toggleNewBio,
      toggleEditBio,
      toggleEditStatement,
      addingBio,
      editingBio,
      editingMemberBio,
      editingStatement,
      postingMemberBio,
      onBioAdd,
      onBioEdit,
      onBioDelete,
      onStatementSave,
      photos,
      gettingPhotos,
      toggleAddPhoto,
      onViewMedia,
      community,
      communityTotal,
      mutualConnections,
      gettingCommunity,
      gettingMutualConnections,
      badges
    } = this.props;

    return (
      <div className="column">
        <div className="columns">
          <div className="column is-6-mobile is-7-tablet is-8-desktop">
            <Feed
              {...{
                bio,
                profile,
                hasEditPermissions: isLoggedInUser,
                toggleNewBio,
                toggleEditBio,
                toggleEditStatement,
                addingBio,
                editingBio,
                editingStatement,
                editingMemberBio,
                postingMemberBio,
                onBioAdd,
                onBioEdit,
                onBioDelete,
                onStatementSave
              }}
            />
          </div>
          <div className="column">
            {isAllowedAccess(profile, user, 'CENTRE_LEARNER_ROLE') && (
              <Media
                {...{
                  memberId,
                  isLoggedInUser,
                  photos,
                  gettingPhotos,
                  thumbnailSize: 90,
                  mediaLimit: 9,
                  toggleAddPhoto,
                  onViewMedia
                }}
              />
            )}

            <DigitalBadges {...{ profile, badges }} />

            <Community
              {...{
                isLoggedInUser,
                community,
                communityTotal,
                mutualConnections,
                gettingCommunity,
                gettingMutualConnections,
                thumbnailSize: 90,
                communityLimit: 9
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  profileBio: profile,
  profile: { user },
  profileBio: badges
}) => ({
  user,
  ...profile,
  ...badges
});

const mapDispatchToProps = dispatch => ({
  onViewMedia: media => dispatch(Creators.viewMedia(media)),
  toggleAddPhoto: () => dispatch(Creators.toggleAddPhoto()),
  toggleNewBio: bioType => dispatch(Creators.toggleNewBio(bioType)),
  toggleEditBio: bio => dispatch(Creators.toggleEditBio(bio)),
  toggleEditStatement: () => dispatch(Creators.toggleEditStatement()),
  onBioAdd: data =>
    dispatch(Creators.postMemberBioAttempt(data.member_id, data.form)),
  onBioEdit: data =>
    dispatch(
      Creators.editMemberBioAttempt(
        data.member_id,
        data.member_bio_id,
        data.form
      )
    ),
  onBioDelete: data =>
    dispatch(
      Creators.deleteMemberBioAttempt(data.member_id, data.member_bio_id)
    ),
  onStatementSave: data => {
    dispatch(
      userUtils.Actions.updateSettingsAttempt(
        data.member_id,
        convertToFormData(data.form)
      )
    );
    dispatch(Creators.updateLocalProfile(data.form));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileOverview);
