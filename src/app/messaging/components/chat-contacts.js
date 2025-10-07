import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';

import common from 'app/common';
import SelectableMediaItem from './selectable-media-item';
import SinglePariticipant from './single-participant';
import util from '../util';
import { Creators as Actions } from '../actions';

const UILoading = common.components.UILoading;
const {
  selectors: { allChatParticipants },
  helpers: { firstParticipant, findParticipant }
} = util;

class ChatContacts extends Component {
  UNSAFE_componentWillMount() {
    const {
      selectedChat,
      selectParticipant,
      selectedParticipant,
      user
    } = this.props;
    if (selectedChat && selectedChat.chat_id) {
      const id = findParticipant(selectedParticipant, selectedChat);
      if (id < 0) {
        const participant = firstParticipant(selectedChat, user);
        if (participant) selectParticipant(participant.object_id);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      gettingChats: gettingChats1,
      participants: participants1,
      selectedParticipant,
      selectParticipant
    } = nextProps;
    const {
      gettingChats: gettingChats0,
      participants: participants0
    } = this.props;
    const chatsLoaded =
      !gettingChats1 && gettingChats0 && participants1.length > 0;
    if (
      ((chatsLoaded && selectedParticipant <= 0) ||
        participants1.length < participants0.length) &&
      participants1.length > 0
    ) {
      selectParticipant(participants1[0].object_id);
    }
  }

  renderChatParticipants() {
    const { participants, selectedParticipant, selectParticipant } = this.props;

    return participants.length === 0 ? (
      <div className="chats--empty">
        <p>You don’t have any chats</p>
      </div>
    ) : (
      <div className="chats">
        <ul>
          {map(participant => (
            <SinglePariticipant
              key={`p-${participant.object_id}`}
              participant={participant}
              selected={participant.object_id === selectedParticipant}
              onSelect={() => selectParticipant(participant.object_id)}
            />
          ))(participants)}
        </ul>
      </div>
    );
  }

  render() {
    const { gettingChats, participants } = this.props;

    return participants.length === 0 && gettingChats ? (
      <UILoading alignMiddle />
    ) : (
      this.renderChatParticipants()
    );
  }
}

const mapStateToProps = ({
  chats: { all, gettingChats, selectedChat, selectedParticipant },
  profile: { user }
}) => ({
  gettingChats,
  participants: allChatParticipants(all, user),
  selectedChat: all[selectedChat],
  selectedParticipant,
  user
});

const mapDispatchToProps = dispatch => ({
  selectChat: ({ chat_id }) => dispatch(Actions.chatSelected(chat_id)),
  selectParticipant: member_id =>
    dispatch(Actions.participantSelected(member_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContacts);
