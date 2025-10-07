import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { eqProps, findIndex, intersectionWith, map } from 'ramda';
import Isvg from 'react-inlinesvg';
import common from 'app/common';
import { Creators as Actions } from '../actions';
import ChatSideHeader from './chat-side-header';
import MessagesCard from './messages-card';
import util from '../util';

import IconFileAttach from 'images/icon-file-attach.svg';
import IconChatSend from 'images/icon-chat-send.svg';
import IconRemove from 'images/icon_remove.svg';

const { noop } = common.util.helpers;
const {
  helpers: { participantsRemoveMe }
} = util;

export class ChatSideRoom extends Component {
  onKeyDown(e) {
    if (e.keyCode === 13 && !(e.shiftKey || e.ctrlKey)) {
      e.preventDefault();
      if (e.target.value === '') return;
      const {
        selectedChat,
        markMessagesRead,
        sendMessage,
        markChatRead
      } = this.props;

      markChatRead(selectedChat);
      markMessagesRead(selectedChat.chat_id);
      sendMessage(selectedChat.chat_id, e.target.value);
      e.target.value = '';
      this.shouldUpdate = false;
      this.shouldScrollToBottom = true;
    }
  }

  render() {
    const { selectedChat, onTabChange, user } = this.props;

    const members = participantsRemoveMe(selectedChat, user.member_id);
    const title = selectedChat.title
      ? selectedChat.title
      : members.length > 1
      ? 'Group chat'
      : members[0].screen_name;

    return (
      <div className="chat">
        <ChatSideHeader title={title} onBack={() => onTabChange('chats')} />

        {/* Individual messages */}
        <div className="cards-container chat-side-container">
          <div className="message-card">
            <MessagesCard
              {...{
                chat: selectedChat
              }}
            />
          </div>
        </div>

        {/* Message box */}
        <div className="message-box">
          <div className="box-inner">
            {/* <div className="emoticons">
              <Isvg src={IconFileAttach} />
            </div> */}
            <TextareaAutosize
              className="chatbox"
              placeholder="Type a message ..."
              onKeyDown={e => this.onKeyDown(e)}
            />
            <div className="sendicon">
              <Isvg src={IconChatSend} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ChatSideRoom.defaultProps = {
  selectedChat: {},
  onTabChange: noop
};

ChatSideRoom.propTypes = {
  selectedChat: PropTypes.object,
  onTabChange: PropTypes.func
};

const mapStateToProps = ({
  profile: { user },
  chats: { all, selectedChat }
}) => ({
  user,
  selectedChat: all[selectedChat]
});

const mapDispatchToProps = dispatch => ({
  markChatRead: chat => dispatch(Actions.chatMarkAsReadAttempt(chat)),
  markMessagesRead: chat_id => dispatch(Actions.markMessagesRead(chat_id)),
  sendMessage: (chat_id, message) => {
    dispatch(Actions.sendMessageAttempt(chat_id, message));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSideRoom);
