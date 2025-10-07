import React from 'react';
import { connect } from 'react-redux';
import { findIndex, map, propEq } from 'ramda';
import common from 'app/common';
import { Creators as Actions } from '../actions';
import util from '../util';
import SelectableMediaItem from './selectable-media-item';
import ChatSideHeader from './chat-side-header';

const UILoading = common.components.UILoading;

const {
  selectors: { filterChatsByParticipant },
  helpers: { participantsRemoveMe }
} = util;

const ChatItem = ({ chat, user, onSelect, selected }) => {
  const members = participantsRemoveMe(chat, user.member_id);

  const title = chat.title
    ? chat.title
    : members.length > 1
      ? 'Group chat'
      : members[0].screen_name;
  const photo = chat.cloudinary_file_id
    ? chat.cloudinary_file_id
    : members.length > 1
      ? null
      : members[0].photo;
  const {
    recent_message: { created: time, message: subtitle },
    unread_count: count
  } = chat;
  const isGroup = chat.participants.length > 2 ? true : false;

  return (
    <SelectableMediaItem
      {...{
        count,
        onSelect,
        photo,
        selected,
        subtitle,
        time,
        title,
        isGroup
      }}
    />
  );
};

export class ChatSideRooms extends React.Component {
  constructor(props) {
    super(props);

    this.backParticipant = this.backParticipant.bind(this);
    this.gotoChatRoom = this.gotoChatRoom.bind(this);
  }

  renderChatRooms() {
    const { chats, selectChat, selectedChat, user } = this.props;

    return (
      <div>
        <ul>
          {map(chat => (
            <ChatItem
              key={`chat-${chat.chat_id}`}
              {...{ chat, user }}
              onSelect={() => this.gotoChatRoom(chat)}
              selected={chat.chat_id === selectedChat}
            />
          ))(chats)}
        </ul>
      </div>
    );
  }

  backParticipant() {
    const { onTabChange } = this.props;

    onTabChange('participants');
  }

  gotoChatRoom(chat) {
    const { onTabChange, selectChat } = this.props;

    selectChat(chat);
    onTabChange('room');
  }

  render() {
    const {
      chats,
      changeChatFilter,
      gettingChats,
      participant,
      onTabChange
    } = this.props;
    const showLoading = gettingChats && (!chats || chats.length === 0);

    return (
      <div className="chats">
        <ChatSideHeader
          title={participant.screen_name}
          onBack={() => this.backParticipant()}
        />
        {showLoading ? <UILoading alignMiddle /> : this.renderChatRooms()}
      </div>
    );
  }
}

const mapStateToProps = ({
  chats: { all, gettingChats, selectedChat, selectedParticipant },
  profile: { user }
}) => ({
  chats: filterChatsByParticipant(all, selectedParticipant),
  gettingChats,
  selectedChat,
  user
});

const mapDispatchToProps = dispatch => ({
  selectChat: chat => dispatch(Actions.chatSelected(chat.chat_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSideRooms);
