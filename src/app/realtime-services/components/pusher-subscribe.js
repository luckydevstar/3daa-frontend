import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { path, contains } from 'ramda';
import { connect } from 'react-redux';
import Pusher from 'react-pusher';
import { Creators } from 'app/notifications/actions';
import { Creators as ChatActions } from 'app/messaging/actions';

class PusherSubscribe extends Component {
  constructor(props) {
    super(props);
    this.onUpdate = this.onUpdate.bind(this);
  }

  /**
  Had to define an extra handler to maintain scope for selectedChat mapped prop, otherwise it is always null
  */
  onUpdate(payload) {
    const {
      selectedChat,
      member_id,
      onMessage,
      sideChatIsOpen,
      currentLocation
    } = this.props;
    const message = JSON.parse(payload.body);

    const unread =
      message.chat_id !== selectedChat ||
      (!contains('/messaging', currentLocation) && !sideChatIsOpen);
    onMessage(payload, member_id, unread);
  }

  render() {
    const {
      member_id,
      chatDeleted,
      markNotificationAsRead,
      markAsNew,
      onFriendRequest,
      participantsDeleted
    } = this.props;
    if (!member_id) return null;
    return (
      <div className="pusher-subscribe">
        <Pusher
          channel={`private-member-${member_id}`}
          event="friend_request"
          onUpdate={payload => {
            console.log(payload);
            onFriendRequest(payload, markNotificationAsRead, markAsNew);
          }}
        />
        <Pusher
          channel={`private-member-${member_id}`}
          event="message"
          onUpdate={payload => this.onUpdate(payload)}
        />
        <Pusher
          channel={`private-member-${member_id}`}
          event="deleted_from_chat"
          onUpdate={payload => {
            console.log('delete_from_chat', payload);
            participantsDeleted(JSON.parse(payload.body));
          }}
        />
        <Pusher
          channel={`private-member-${member_id}`}
          event="added_to_chat"
          onUpdate={payload => {
            console.log('added_to_chat', payload);
          }}
        />
        <Pusher
          channel={`private-member-${member_id}`}
          event="chat_deleted"
          onUpdate={payload => {
            console.log('chat_deleted', payload);
            chatDeleted(JSON.parse(payload.body));
          }}
        />
        <Pusher
          channel={`private-member-${member_id}`}
          event="chat_message_deleted"
          onUpdate={payload => {
            console.log('chat_message_deleted', payload);
          }}
        />
      </div>
    );
  }
}

PusherSubscribe.propTypes = {
  currentLocation: PropTypes.string
};

PusherSubscribe.defaultProps = {
  currentLocation: ''
};

const mapStateToProps = state => {
  return {
    member_id: path(['profile', 'user', 'member_id'])(state),
    // not a good way to define an item as 'new'
    markAsNew: !state.ui.sidebarOpen,
    markNotificationAsRead:
      state.ui.sidebarOpen && state.ui.sidebarFeature === 'notifications',
    sideChatIsOpen:
      state.ui.sidebarOpen &&
      state.ui.sidebarFeature === 'messaging' &&
      state.ui.sidebarPane === 'chat',
    selectedChat: parseInt(state.chats.selectedChat),
    allChats: state.chats.all
  };
};

const mapDispatchToProps = dispatch => ({
  onFriendRequest: (payload, markNotificationAsRead, markAsNew) => {
    dispatch(
      Creators.receiveFriendRequest(payload, markNotificationAsRead, markAsNew)
    );
  },
  onMessage: (payload, member_id, unread) => {
    const { meta: { sender } } = payload;

    if (parseInt(sender) !== member_id) {
      if (unread) {
        dispatch(Creators.receiveChatMessage(payload, false));
      }

      const message = JSON.parse(payload.body);
      dispatch(ChatActions.receiveMessage(message, unread));
    }
  },
  participantsDeleted: ({ chat_id, deleted_participants }) =>
    dispatch(ChatActions.participantsDeleted(chat_id, deleted_participants)),
  chatDeleted: ({ chat_id }) => dispatch(ChatActions.deleteChatSuccess(chat_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PusherSubscribe);
