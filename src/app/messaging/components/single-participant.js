import React from 'react';
import SelectableMediaItem from './selectable-media-item';

const SinglePariticipant = ({ participant, onSelect, selected }) => {
  const title = participant.screen_name;
  const photo = participant.photo;
  const {
    recent_message: { created: time, message: subtitle },
    unread_count: count
  } = participant.latest_chat;

  return (
    <SelectableMediaItem
      {...{
        title,
        photo,
        time,
        subtitle: subtitle ? `${subtitle}` : '',
        count,
        onSelect,
        selected
      }}
    />
  );
};

export default SinglePariticipant;
