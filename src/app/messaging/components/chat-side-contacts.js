import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map } from 'ramda';
import { debounce } from 'lodash';

import common from 'app/common';
import SelectableMediaItem from './selectable-media-item';
import SinglePariticipant from './single-participant';
import ChatSearch from './chat-search';
import util from '../util';
import { Creators as Actions } from '../actions';

const UILoading = common.components.UILoading;
const {
  selectors: { allChatParticipants }
} = util;

class ChatSideContacts extends Component {
  constructor(props) {
    super(props);

    this.gotoChat = this.gotoChat.bind(this);
    this.searchOnChange = this.searchOnChange.bind(this);
  }

  gotoChat(participant) {
    const { selectParticipant, onSelectParticipant } = this.props;

    selectParticipant(participant.object_id);
    onSelectParticipant(participant);
  }

  searchOnChange(searchTerm) {
    const { updateSearchTerm } = this.props;
    updateSearchTerm(searchTerm);
  }

  renderChatParticipants() {
    const { participants, selectedParticipant } = this.props;

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
              onSelect={() => this.gotoChat(participant)}
            />
          ))(participants)}
        </ul>
      </div>
    );
  }

  render() {
    const { gettingChats, participants, searchTerm } = this.props;

    return participants.length === 0 && gettingChats ? (
      <UILoading alignMiddle />
    ) : (
      <div className="side-chat-contacts">
        <ChatSearch
          onChange={debounce(this.searchOnChange, 500)}
          searchPhrase={searchTerm}
        />
        {this.renderChatParticipants()}
      </div>
    );
  }
}

const mapStateToProps = ({
  chats: { all, gettingChats, selectedParticipant, searchTerm },
  profile: { user }
}) => ({
  gettingChats,
  participants: allChatParticipants(all, user, searchTerm),
  selectedParticipant,
  user,
  searchTerm
});

const mapDispatchToProps = dispatch => ({
  selectParticipant: member_id =>
    dispatch(Actions.participantSelected(member_id)),
  updateSearchTerm: searchTerm => dispatch(Actions.updateSearchTerm(searchTerm))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatSideContacts);
