import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import helpers from '../util/helpers';
import common from 'app/common';

const ProfileAvatar = common.components.ProfileAvatar;
const { noop } = common.util.helpers;

const Message = ({
  avatars,
  message,
  owner,
  user,
  onAvatarClick,
  selectMode,
  selected,
  toggleDeleteMessage
}) => {
  const element = useRef(null);
  const ownMessage = message.object_id
    ? message.object_id === user.member_id
    : !message.sent;
  const messageClasses = classNames({
    friend: !ownMessage,
    media: true,
    message: true,
    user: ownMessage
  });

  const messages =
    message.message !== ''
      ? message.message.toString().replace(/(?:\r\n|\r|\n)/g, '<br />')
      : message.message;

  return (
    <div
      ref={element}
      key={`message-${message.message_id}`}
      className={messageClasses}
    >
      {avatars && !ownMessage ? (
        <div
          className="picture media-left"
          onClick={() => {
            if (!selectMode) onAvatarClick(owner);
          }}
        >
          {selectMode && (
            <label className="custom checkbox">
              <input
                type="checkbox"
                checked={selected}
                onChange={ev =>
                  toggleDeleteMessage(message.message_id, ev.target.checked)
                }
              />
              <span className="ui" />
            </label>
          )}
          <ProfileAvatar
            avatarSize={56}
            title={owner.screen_name}
            fileId={owner.photo}
            gender={owner.gender}
          />
        </div>
      ) : null}
      <div className="media-content">
        <div className="time">
          <time>
            {message.created && helpers.formatTimestamp(message.created)}
          </time>
          {message.unread && <div className="unread" />}
        </div>
        <div className="text" dangerouslySetInnerHTML={{ __html: messages }} />
      </div>
      {avatars && ownMessage ? (
        <div className="picture media-right">
          <ProfileAvatar
            avatarSize={56}
            title={owner.screen_name}
            fileId={owner.photo}
            gender={owner.gender}
          />
          {selectMode && (
            <label className="custom checkbox">
              <input
                type="checkbox"
                checked={selected}
                onChange={ev =>
                  toggleDeleteMessage(message.message_id, ev.target.checked)
                }
              />
              <span className="ui" />
            </label>
          )}
        </div>
      ) : null}
    </div>
  );
};

Message.propTypes = {
  avatars: PropTypes.bool,
  message: PropTypes.object.isRequired,
  owner: PropTypes.object,
  user: PropTypes.object,
  onAvatarClick: PropTypes.func,
  selectMode: PropTypes.bool,
  selected: PropTypes.bool,
  toggleDeleteMessage: PropTypes.func
};

Message.defaultProps = {
  avatars: true,
  owner: {},
  user: {},
  onAvatarClick: noop,
  selectMode: false,
  selected: false,
  toggleDeleteMessage: noop
};

export default Message;
