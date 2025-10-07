import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import common from 'app/common';
import classNames from 'classnames';

const {
  components: { ProfileAvatar, UILoading }
} = common;

const Community = ({
  isLoggedInUser,
  gettingCommunity,
  gettingMutualConnections,
  community,
  communityTotal,
  mutualConnections,
  communityLimit
}) => {
  let connectionsElement = null;

  const createFriendElement = connection => {
    const { member_id, screen_name, cloudinary_file_id, gender } = connection;
    const thumbnailClasses = classNames(
      'image',
      'is-square',
      'is-round',
      'profile-thumbnail'
    );
    return (
      <li key={member_id} className="column is-one-third profile-widget-column">
        <Link to={`/profile/${member_id}`} title={screen_name}>
          <ProfileAvatar
            className={thumbnailClasses}
            avatarSize={90}
            title={screen_name}
            fileId={cloudinary_file_id}
            gender={gender}
          />
        </Link>
      </li>
    );
  };

  const showMutualConnections = !isLoggedInUser;
  const isLoading = gettingCommunity || gettingMutualConnections;
  const hasConnections = community && community.length > 0;
  const hasMutualConnections =
    mutualConnections && mutualConnections.length > 0;
  const connectionsList = !showMutualConnections
    ? community
    : mutualConnections;
  const createConnectionList = () =>
    connectionsList
      .slice(0, communityLimit)
      .map(friend => createFriendElement(friend));

  const emptyStateElement = (
    <li className="column has-text-centered">
      <div
        className="my-community__empty-icon m-t-40"
        title="No connections found"
      />
      <p className="my-community__empty-message m-t-40 m-b-40">
        {showMutualConnections
          ? 'No mutual connections'
          : 'No connections added yet'}
      </p>
      {isLoggedInUser && (
        <Link
          to={`/community/friends`}
          className="my-community__empty-cta button is-primary is-outlined is-large is-fullwidth m-t-40"
        >
          Connect with friends
        </Link>
      )}
    </li>
  );

  if (showMutualConnections) {
    connectionsElement = hasMutualConnections
      ? createConnectionList()
      : emptyStateElement;
  } else {
    connectionsElement = hasConnections
      ? createConnectionList()
      : emptyStateElement;
  }

  return (
    <div className="profile-section my-community">
      <div className="profile-title">
        {showMutualConnections ? 'Mutual Connections' : 'My Community'}
        {!showMutualConnections ? (
          <Link to={'/community/friends'}>
            <span className="link">{communityTotal}</span>
          </Link>
        ) : null}
      </div>
      {isLoading ? (
        <UILoading />
      ) : (
        <ul className="columns is-multiline">{connectionsElement}</ul>
      )}
    </div>
  );
};

Community.defaultProps = {
  community: [],
  gettingCommunity: false,
  thumbnailSize: 180,
  communityLimit: 9
};

Community.propTypes = {
  community: PropTypes.arrayOf(PropTypes.object),
  gettingCommunity: PropTypes.bool,
  thumbnailSize: PropTypes.number,
  communityLimit: PropTypes.number
};

export default Community;
