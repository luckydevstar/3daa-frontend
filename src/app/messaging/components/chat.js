import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { eqProps, findIndex, intersectionWith, map } from 'ramda';
import * as lodash from 'lodash';
import Isvg from 'react-inlinesvg';
import common from 'app/common';
import { Creators as Actions } from '../actions';
import ChatHeader from './chat-header';
import MessagesCard from './messages-card';
import { throttle } from 'lodash';
import Carousel from 'nuka-carousel';

import IconFileAttach from 'images/icon-file-attach.svg';
import IconChatSend from 'images/icon-chat-send.svg';
import IconRemove from 'images/icon_remove.svg';

const { noop } = common.util.helpers;

export class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 1
    };

    this.changeContainerSize = throttle(this.changeContainerSize.bind(this));
    this.changeCurrentChat = this.changeCurrentChat.bind(this);
  }

  UNSAFE_componentWillMount() {
    window.addEventListener('resize', this.changeContainerSize);
  }

  componentDidMount() {
    this.setState({
      width: this.container.clientWidth
    });

    const { chats, selectedChat } = this.props;

    if (chats.length > 0) {
      if (selectedChat && selectedChat.chat_id) {
        const id = findIndex(eqProps('chat_id', selectedChat), chats);
        if (id > 0) {
          this.carousel.goToSlide(id);
          this.slideOnMount = true;
        }
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      chats: chats0,
      sidebarOpen: sidebarOpen0,
      markChatRead,
      panelOpen: panelOpen0,
      selectChat,
      selectedChat: selectedChat0
    } = this.props;
    const {
      chats: chats1,
      panelOpen: panelOpen1,
      selectedChat: selectedChat1,
      selectingMessages: selectingMessages1,
      sidebarOpen: sidebarOpen1
    } = nextProps;

    // const _common = intersectionWith(eqProps('chat_id'), chats0, chats1);
    const _common = lodash.intersectionBy(chats0, chats1, 'chat_id');
    if (
      chats1.length > 0 &&
      (chats0.length !== chats1.length || _common.length !== chats1.length)
    ) {
      if (!selectedChat1 || !selectedChat1.chat_id) {
        selectChat(chats1[0]);
        markChatRead(chats1[0]);
      }
      if (!this.slideOnMount) {
        this.carousel.goToSlide(0);
        selectChat(chats1[0]);
        markChatRead(chats1[0]);
      } else {
        this.slideOnMount = false;
      }
    }

    if (
      selectingMessages1 &&
      !eqProps('chat_id', selectedChat0, selectedChat1)
    ) {
      this.props.selectMessageMode(false);
    }

    if (sidebarOpen1 !== sidebarOpen0 || panelOpen1 !== panelOpen0) {
      if (sidebarOpen1 || panelOpen1) {
        this.setState({
          width: window.innerWidth - 354 * 2
        });
      } else {
        this.setState({
          width: window.innerWidth - 354
        });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.changeContainerSize);
  }

  onKeyDown(e) {
    if (e.keyCode === 13 && !(e.shiftKey || e.ctrlKey)) {
      e.preventDefault();
      if (e.target.value === '') return;
      const {
        selectedChat: { chat_id },
        markMessagesRead,
        sendMessage
      } = this.props;
      markMessagesRead(chat_id);
      sendMessage(chat_id, e.target.value);
      e.target.value = '';
      this.shouldUpdate = false;
      this.shouldScrollToBottom = true;
    }
  }

  changeContainerSize() {
    if (this.props.panelOpen || this.props.sidebarOpen) {
      this.setState({
        width: window.innerWidth - 354 * 2
      });
    } else {
      this.setState({
        width: window.innerWidth - 354
      });
    }
  }

  changeCurrentChat(i) {
    const { chats, selectChat, markChatRead } = this.props;
    selectChat(chats[i]);
    markChatRead(chats[i]);
  }

  render() {
    const {
      chats,
      closePanel,
      deleteCount,
      deleteMessages,
      onAvatarClick,
      panelOpen,
      selectedChat,
      selectingMessages,
      showActions
    } = this.props;
    // const title = helpers.getChatTitle(selectedChat, user.member_id);

    return (
      <div
        className="chat"
        ref={el => {
          this.container = el;
        }}
      >
        {selectedChat && (
          <ChatHeader
            {...{
              chat: selectedChat,
              closePanel,
              onAvatarClick,
              panelOpen,
              showActions
            }}
          />
        )}

        {/* Individual messages */}
        <div
          className="cards-container"
          style={{
            width: this.state.width
          }}
        >
          <Carousel
            ref={el => {
              this.carousel = el;
            }}
            afterSlide={this.changeCurrentChat}
          >
            {map(chat => (
              <div key={`chat-${chat.chat_id}`} className="message-card">
                <div>
                  <MessagesCard
                    {...{
                      chat,
                      onAvatarClick
                    }}
                  />
                </div>
              </div>
            ))(chats)}
          </Carousel>
        </div>

        {/* Message box */}
        <div className="message-box">
          {!selectingMessages ? (
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
          ) : (
            <div className="delete-box has-text-right">
              <a onClick={deleteMessages}>
                <Isvg src={IconRemove} /> Delete ({deleteCount})
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Chat.defaultProps = {
  chats: [],
  closePanel: noop,
  deleteCount: 0,
  onAvatarClick: noop,
  panelOpen: false,
  selectedChat: {},
  selectingMessages: false,
  showActions: noop
};

Chat.propTypes = {
  chats: PropTypes.array,
  closePanel: PropTypes.func,
  deleteCount: PropTypes.number,
  onAvatarClick: PropTypes.func,
  panelOpen: PropTypes.bool,
  selectedChat: PropTypes.object,
  selectingMessages: PropTypes.bool,
  showActions: PropTypes.func
};

const mapStateToProps = ({ profile: { user }, ui: { sidebarOpen } }) => ({
  user,
  sidebarOpen
});

const mapDispatchToProps = dispatch => ({
  deleteMessages: () => dispatch(Actions.deleteMessages()),
  markChatRead: chat => dispatch(Actions.chatMarkAsReadAttempt(chat)),
  markMessagesRead: chat_id => dispatch(Actions.markMessagesRead(chat_id)),
  selectChat: ({ chat_id }) => dispatch(Actions.chatSelected(chat_id)),
  selectMessageMode: mode => dispatch(Actions.selectMessageMode(mode)),
  sendMessage: (chat_id, message) => {
    dispatch(Actions.sendMessageAttempt(chat_id, message));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
