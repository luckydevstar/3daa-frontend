import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import Isvg from 'react-inlinesvg';
import IconClose from 'images/icon_close.svg';

const ProfileAvatar = common.components.ProfileAvatar;
const noop = common.util.helpers.noop;

const ChatParticipant = ({ remove, unremovable, user }) => {
  const { screen_name, cloudinary_file_id, gender } = user;

  return (
    <div className="chat-participant">
      <ProfileAvatar
        avatarSize={140}
        title={screen_name}
        fileId={cloudinary_file_id}
        gender={gender}
      />
      <div className="contact-name">{screen_name}</div>
      {!unremovable && (
        <div className="close" onClick={() => remove(user)}>
          <Isvg src={IconClose} />
        </div>
      )}
      <div className="outline" />
    </div>
  );
};

ChatParticipant.propTypes = {
  remove: PropTypes.func,
  unremovable: PropTypes.bool,
  user: PropTypes.object
};

ChatParticipant.defaultProps = {
  remove: noop,
  unremovable: false,
  user: {}
};

export default ChatParticipant;
