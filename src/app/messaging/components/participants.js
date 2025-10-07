import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import common from 'app/common';
import { map } from 'ramda';
import IconClose from 'images/icon_close.svg';
import SelectableMediaItem from './selectable-media-item';
import AddButton from './add-button';
import helpers from '../util/helpers';

const noop = common.util.helpers.noop;
const { findTheOthers, mapParticipant, participants } = helpers;

const Participants = ({ chat, onClose, onParticipantClick, onAdd, user }) => {
  const participantsList = participants(chat).map(participant => {
    const { object_id, photo, gender, screen_name } = participant;
    const subtitle = 'Subtitle';

    return (
      <SelectableMediaItem
        key={`participant-${object_id}`}
        {...{
          gender,
          multiSelect: false,
          onSelect: () => onParticipantClick(participant),
          photo,
          subtitle,
          title: screen_name
        }}
      />
    );
  });

  const others = findTheOthers(chat, user.member_id);
  const isOwner = chat.object_id === user.member_id;

  return (
    <div className="chat-participants">
      <h2>Participants</h2>
      <div className="close" onClick={onClose}>
        <Isvg src={IconClose} />
      </div>
      <ul>
        {participantsList}
        {isOwner && (
          <li>
            <span />
            <AddButton onAdd={() => onAdd(map(mapParticipant)(others))} />
          </li>
        )}
      </ul>
    </div>
  );
};

Participants.propType = {
  chat: PropTypes.object,
  user: PropTypes.object,
  onAdd: PropTypes.func,
  onClose: PropTypes.func,
  onParticipantClick: PropTypes.func
};

Participants.defaultProps = {
  chat: {},
  user: {},
  onAdd: noop,
  onClose: noop,
  onParticipantClick: noop
};

export default Participants;
