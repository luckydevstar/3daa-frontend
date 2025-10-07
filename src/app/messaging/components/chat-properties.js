import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import { map } from 'ramda';

import AddButton from './add-button';
import LastAchievement from './last-achievement';
import MediaList from './media-list';
import helpers from '../util/helpers';

const ProfileAvatar = common.components.ProfileAvatar;
const noop = common.util.helpers.noop;
const { findTheOthers, mapParticipant, participants } = helpers;

const ChatProperties = ({
  chat,
  user,
  participant,
  onAddParticipants,
  onAvatarClick,
  onShowParticipants
}) => {
  const { member_id } = user;
  const others = findTheOthers(chat, member_id);
  const isOwner = chat.object_id === member_id;

  return (
    <div className="chat-properties">
      <div className="avatar">
        <ProfileAvatar
          avatarSize={140}
          {...{
            title: participant.screen_name,
            fileId: participant.photo
          }}
        />
        <h2>{participant.screen_name}</h2>
      </div>
      {/* <LastAchievement /> */}

      <ul>
        <li className="media-list-container">
          <MediaList member_id={participant.object_id} />
        </li>
        <li>
          <div className="property-label">Participants</div>
          <div className="property-value">
            {participants(chat).map(p => (
              <div
                className="mini-avatar"
                key={`avatar-${p.object_id}`}
                onClick={() => onAvatarClick(p)}
              >
                <ProfileAvatar
                  avatarSize={32}
                  {...{
                    title: p.screen_name,
                    fileId: p.photo
                  }}
                />
              </div>
            ))}
            <a onClick={onShowParticipants}>(Show)</a>
          </div>
        </li>
        {isOwner && (
          <li>
            <span />
            <AddButton
              onAdd={() => onAddParticipants(map(mapParticipant)(others))}
            />
          </li>
        )}
      </ul>
    </div>
  );
};

ChatProperties.propTypes = {
  chat: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  participant: PropTypes.object.isRequired,
  onAddParticipants: PropTypes.func,
  onAvatarClick: PropTypes.func,
  onShowParticipants: PropTypes.func
};

ChatProperties.defaultProps = {
  onAddParticipants: noop,
  onAvatarClick: noop,
  onShowParticipants: noop
};

export default ChatProperties;
