import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import inViewport from 'in-viewport';
import { find, filter, indexOf, map, pipe, propEq, sort, values } from 'ramda';
import Message from './message';
import common from 'app/common';
import { Creators as Actions } from '../actions';
import helpers from '../util/helpers';

const UILoading = common.components.UILoading;
const noop = common.util.helpers.noop;

const haveAllMessages = ({ current_count, total_count }) =>
  total_count !== undefined && current_count === total_count;

class MessagesCard extends Component {
  constructor(props) {
    super(props);

    this.prevMsgCount = 0;

    this.onWindowScrolled = this.onWindowScrolled.bind(this);
  }

  componentDidMount() {
    const { messages, chat, getMessages } = this.props;

    if (messages.length < 10 && !haveAllMessages(chat)) {
      this.shouldUpdate = false;
      this.shouldScrollToBottom = true;
      getMessages(chat);
    } else {
      this.scrollToBottom();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { messages: prevMessages, pendingMessages: prevPending } = this.props;
    const { messages: nextMessages, pendingMessages: nextPending } = nextProps;
    const msgCount = nextMessages.length;
    const haveReceivedNewMessages = msgCount > prevMessages.length;
    const addedPendingMessage =
      nextPending && prevPending && nextPending.length > prevPending.length;

    if (haveReceivedNewMessages || addedPendingMessage) {
      this.shouldUpdate = true;
      if (this.shouldStickToBottom) {
        this.shouldScrollToBottom = true;
      }
    }
  }

  componentDidUpdate() {
    if (this.shouldUpdate) {
      if (this.shouldScrollToBottom) {
        this.shouldScrollToBottom = false;
        this.scrollToBottom();
      } else if (this.shouldHideSpinner) {
        this.shouldHideSpinner = false;
        this.hideSpinner();
      }
      this.shouldUpdate = false;
    }
  }

  onWindowScrolled() {
    const { gettingMessages, getMessages, chat } = this.props;

    if (
      inViewport(this.spinner, {
        container: this.messagesWindow,
        offset: -20
      }) &&
      !gettingMessages
    ) {
      this.shouldHideSpinner = true;
      this.shouldUpdate = false;
      this.prevMsgHeight = this.messagesWrapper.clientHeight;
      getMessages(chat);
    }
    if (this.messagesWrapper && this.messagesWrapper.offsetHeight) {
      const height = this.messagesWrapper.offsetHeight;
      const msgDiv = this.messagesWindow;
      if (height - msgDiv.clientHeight - 30 <= msgDiv.scrollTop) {
        this.shouldStickToBottom = true;
      } else {
        this.shouldStickToBottom = false;
      }
    }
  }

  scrollToBottom() {
    const messagesScrolTop = this.messagesWrapper.offsetHeight;
    this.messagesWindow.scrollTop = messagesScrolTop;
  }

  hideSpinner() {
    this.messagesWindow.scrollTop =
      this.messagesWrapper.clientHeight - this.prevMsgHeight;
  }

  renderMessages() {
    const {
      messages,
      user,
      chat,
      pendingMessages,
      onAvatarClick,
      selectingMessages,
      deleteMessages,
      toggleDeleteMessage
    } = this.props;
    return map(message => {
      const owner = find(propEq('object_id', message.object_id))(
        chat.participants
      );
      const selected = indexOf(message.message_id, deleteMessages) >= 0;
      return (
        <Message
          key={message.message_id}
          {...{
            message,
            user,
            owner,
            onAvatarClick,
            selected,
            toggleDeleteMessage
          }}
          selectMode={selectingMessages}
          avatars
        />
      );
    })([...pendingMessages, ...messages]);
  }

  render() {
    const { chat, messages } = this.props;
    const allLoaded = haveAllMessages(chat);

    const noMessages = messages.length === 0 && (
      <div className="has-text-centered m-b-20">
        There are no messages in this chat yet.
      </div>
    );

    return (
      <div
        className="messages-window"
        ref={messagesWindow => {
          this.messagesWindow = messagesWindow;
        }}
        onScroll={debounce(this.onWindowScrolled, 500)}
      >
        <div
          className="messages-wrapper"
          ref={messagesWrapper => {
            this.messagesWrapper = messagesWrapper;
          }}
        >
          {this.renderMessages()}
          {!allLoaded ? (
            <UILoading
              spinnerRef={el => {
                this.spinner = el;
              }}
              customClass="m-b-20"
            />
          ) : (
            noMessages
          )}
        </div>
      </div>
    );
  }
}

MessagesCard.defaultProps = {
  chat: {},
  getMessages: noop,
  messages: [],
  pendingMessages: [],
  user: {},
  gettingMessages: false,
  onAvatarClick: noop
};

MessagesCard.propTypes = {
  chat: PropTypes.object,
  getMessages: PropTypes.func,
  messages: PropTypes.array,
  pendingMessages: PropTypes.array,
  user: PropTypes.object,
  gettingMessages: PropTypes.bool,
  onAvatarClick: PropTypes.func
};

const mapStateToProps = ({ messages, profile: { user } }, { chat }) => {
  const viewableMessages = pipe(
    values,
    filter(msg => helpers.compareInt(msg.chat_id, chat.chat_id))
  );
  let msg = viewableMessages(messages.all);
  msg = sort((a, b) => parseInt(b.message_id) - parseInt(a.message_id))(msg);

  return {
    messages: msg,
    pendingMessages: values(messages.pendingMessages),
    user,
    gettingMessages: messages.gettingMessages,
    selectingMessages: messages.selectingMessages,
    deleteMessages: messages.deleteMessages
  };
};

const mapDispatchToProps = dispatch => ({
  getMessages: ({ chat_id }) => dispatch(Actions.getMessagesAttempt(chat_id)),
  toggleDeleteMessage: (msg_id, checked) =>
    dispatch(Actions.toggleDeleteMessage(msg_id, checked))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesCard);
