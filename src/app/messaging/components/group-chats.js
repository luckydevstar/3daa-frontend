import React from 'react';
import { connect } from 'react-redux';
import { findIndex, map, propEq } from 'ramda';
import common from 'app/common';
import { Creators as Actions } from '../actions';
import util from '../util';
import SelectableMediaItem from './selectable-media-item';
import ChatSearchBar from './chat-search';

const UILoading = common.components.UILoading;

const {
  selectors: { filterGroupChats }
} = util;

const ChatItem = ({ chat, onSelect, selected }) => {
  const title = chat.title ? chat.title : 'Group chat';
  const {
    cloudinary_file_id: photo,
    recent_message: { created: time, message: subtitle },
    unread_count: count
  } = chat;

  return (
    <SelectableMediaItem
      {...{
        count,
        onSelect,
        photo,
        selected,
        subtitle,
        time,
        title
      }}
      isGroup
    />
  );
};

export class ChatRooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      haveNoChats: false
    };
  }

  UNSAFE_componentWillMount() {
    const { chats, selectChat, selectedChat } = this.props;
    const isGroupChatSelected =
      findIndex(propEq('chat_id', selectedChat), chats) >= 0;

    if (chats.length > 0) {
      this.setState({
        haveNoChats: chats.length === 0
      });

      if (!isGroupChatSelected) {
        selectChat(chats[0]);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      gettingChats: gettingChats0,
      chats: chats0,
      selectChat,
      selectedChat: selectedChat0
    } = this.props;
    const { chats: chats1, selectedChat: selectedChat1 } = nextProps;

    const chatsChanged = chats1.length !== chats0.length;
    const selectedChatChanged = selectedChat0.chat_id !== selectedChat1.chat_id;

    if (chatsChanged) {
      this.setState({
        haveNoChats: chats1.length === 0
      });
    }

    if (chats1.length > 0 && selectedChatChanged) {
      selectChat(chats1[0]);
    }
  }

  renderChatRooms() {
    const { chats, selectChat, selectedChat, user } = this.props;
    const { haveNoChats } = this.state;

    return haveNoChats ? (
      <div className="chats--empty">
        <p>You don’t have any chats</p>
      </div>
    ) : (
      // <div>
      <ul>
        {map(chat => (
          <ChatItem
            key={`chat-${chat.chat_id}`}
            {...{ chat, user }}
            onSelect={() => selectChat(chat)}
            selected={chat.chat_id === selectedChat}
          />
        ))(chats)}
      </ul>
      // </div>
    );
  }

  render() {
    const { chats, changeChatFilter, gettingChats, _filter, side } = this.props;
    const showLoading = gettingChats && (!chats || chats.length === 0);

    return (
      <div className="chats">
        {showLoading ? (
          <UILoading alignMiddle />
        ) : (
          <div className="group-chats">
            <ChatSearchBar
              onChange={val => changeChatFilter(val)}
              placeholder="Find a chat"
              searchPhrase={_filter}
              side={side}
            />
            {this.renderChatRooms()}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({
  chats: { all: chats, gettingChats, selectedChat, filter: _filter },
  ui: { sidebarOpen },
  profile: { user }
}) => ({
  chats: filterGroupChats(chats, _filter, user),
  _filter,
  gettingChats,
  selectedChat,
  sidebarOpen,
  user
});

const mapDispatchToProps = dispatch => ({
  selectChat: chat => dispatch(Actions.chatSelected(chat.chat_id)),
  changeChatFilter: _filter => dispatch(Actions.chatFilterChanged(_filter))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatRooms);
