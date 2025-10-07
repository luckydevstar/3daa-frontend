import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { map } from 'ramda';

import common from 'app/common';
import { Creators as Actions } from '../actions';
import { Creators as CoreCreators } from 'app/core/actions';
import Chat from './chat';
import ChatActions from './chat-actions';
import ChatDelete from './chat-delete';
import ChatEdit from './chat-edit';
import ChatProperties from './chat-properties';
import Participants from './participants';
import util from '../util';

const {
  selectors: { filterChatsByParticipant },
  helpers: { participants }
} = util;
const ContentModal = common.components.ContentModal;

class ChatSession extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rightPane: 'actions',
      selectedParticipant: null,
      participants: []
    };

    this.showActions = this.showActions.bind(this);
    this.showAddParticipant = this.showAddParticipant.bind(this);
    this.showChatParticipants = this.showChatParticipants.bind(this);
    this.showParticipant = this.showParticipant.bind(this);
    this.showChatEdit = this.showChatEdit.bind(this);
    this.cancelAction = this.cancelAction.bind(this);
    this.closeChatDeleteModal = this.closeChatDeleteModal.bind(this);
    this.deleteChat = this.deleteChat.bind(this);
    this.openChatDeleteModal = this.openChatDeleteModal.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.selectedChat !== nextProps.selectedChat &&
      nextProps.selectedChat
    ) {
      const { participants } = nextProps.selectedChat;
      if (participants && participants[0]) {
        this.showParticipant(participants[0]);
      }
    }
  }

  showActions() {
    this.setState({ rightPane: 'actions' });
    this.props.togglePanel(true);
    this.props.hideSidebar();
  }

  showAddParticipant(_participants) {
    this.props.startEdingChat();
    this.props.selectContacts(
      map(participant => ({ ...participant, unremovable: true }))(_participants)
    );
    this.props.togglePanel(false);
  }

  showChatParticipants() {
    const { selectedChat } = this.props;
    this.setState({
      rightPane: 'chat-participants',
      participants: participants(selectedChat)
    });
  }

  showParticipant(participant = null) {
    if (participant) {
      this.setState({
        rightPane: 'profile',
        selectedParticipant: participant
      });
      this.props.togglePanel(true);
      this.props.hideSidebar();
    } else {
      this.setState({
        rightPane: 'profile'
      });
    }
  }

  showChatEdit() {
    this.setState({ rightPane: 'chat-edit' });
    this.props.togglePanel(true);
  }

  cancelAction() {
    const { selectingMessages, selectMessageMode, togglePanel } = this.props;

    if (selectingMessages) {
      selectMessageMode(false);
    } else {
      togglePanel(false);
    }
  }

  closeChatDeleteModal() {
    this.chatDeleteModal.close();
  }

  deleteChat(isOwner) {
    const {
      attemptDeleteChat,
      attemptLeaveChat,
      selectedChat,
      togglePanel
    } = this.props;

    if (isOwner) {
      attemptDeleteChat(selectedChat.chat_id);
    } else {
      attemptLeaveChat(selectedChat.chat_id);
    }
    this.closeChatDeleteModal();
    togglePanel(false);
  }

  openChatDeleteModal() {
    this.chatDeleteModal.open();
  }

  render() {
    const {
      callingApi,
      chats,
      clearDeleteMessages,
      deleteMessages,
      updateChat,
      panelOpen,
      selectedChat,
      selectingMessages,
      selectMessageMode,
      layout,
      togglePanel,
      user
    } = this.props;
    const { rightPane, selectedParticipant } = this.state;
    const isOwner = selectedChat && selectedChat.object_id === user.member_id;
    const panelClass = cx('right-pane', {
      close: !panelOpen
    });

    return (
      <div className="main">
        <div className="messages">
          {layout === 'chats' && (
            <Chat
              {...{
                chats,
                deleteCount: deleteMessages.length,
                selectedChat,
                panelOpen,
                selectingMessages,
                showActions: this.showActions,
                closePanel: () => togglePanel(false),
                onAvatarClick: this.showParticipant
              }}
            />
          )}
          {layout === 'group' && selectedChat && (
            <Chat
              {...{
                chats: [selectedChat],
                deleteCount: deleteMessages.length,
                selectedChat,
                panelOpen,
                selectingMessages,
                showActions: this.showActions,
                closePanel: () => togglePanel(false),
                onAvatarClick: this.showParticipant
              }}
            />
          )}
        </div>

        {selectedChat && panelOpen && (
          <div className={panelClass}>
            {rightPane === 'profile' && (
              <ChatProperties
                chat={selectedChat}
                user={user}
                participant={selectedParticipant}
                onAddParticipants={this.showAddParticipant}
                onAvatarClick={this.showParticipant}
                onShowParticipants={this.showChatParticipants}
              />
            )}
            {rightPane === 'actions' && (
              <ChatActions
                isOwner={isOwner}
                onCancel={this.cancelAction}
                onEdit={this.showChatEdit}
                onLeaveChat={this.openChatDeleteModal}
                onSelectMessage={() => {
                  clearDeleteMessages();
                  selectMessageMode(true);
                }}
              />
            )}
            {rightPane === 'chat-edit' && (
              <ChatEdit
                attempting={callingApi}
                chat={selectedChat}
                isOwner={isOwner}
                onClose={this.showActions}
                onSave={(title, file) =>
                  updateChat(selectedChat.chat_id, title, file)
                }
              />
            )}
            {rightPane === 'chat-participants' && (
              <Participants
                chat={selectedChat}
                user={user}
                onAdd={this.showAddParticipant}
                onClose={() => this.showParticipant()}
                onParticipantClick={this.showParticipant}
              />
            )}
          </div>
        )}

        <ContentModal
          className="chat-delete-modal"
          noCloseButton="true"
          ref={e => {
            this.chatDeleteModal = e;
          }}
        >
          <ChatDelete
            deleteChat={() => this.deleteChat(isOwner)}
            closeChatDeleteModal={() => this.closeChatDeleteModal()}
            isOwner={isOwner}
          />
        </ContentModal>
      </div>
    );
  }
}

const mapStateToProps = ({
  chats: {
    all,
    callingApi,
    layout,
    panelOpen,
    selectedChat,
    selectedParticipant
  },
  profile: { user },
  messages: { deleteMessages, selectingMessages }
}) => ({
  callingApi,
  chats: filterChatsByParticipant(all, selectedParticipant),
  deleteMessages,
  layout,
  panelOpen,
  selectedChat: all[selectedChat],
  selectingMessages,
  user
});

const mapDispatchToProps = dispatch => ({
  attemptDeleteChat: chat_id => dispatch(Actions.deleteChatAttempt(chat_id)),
  attemptLeaveChat: chat_id => dispatch(Actions.leaveChatAttempt(chat_id)),
  clearDeleteMessages: () => dispatch(Actions.clearDeleteMessages()),
  selectContacts: _participants =>
    dispatch(Actions.selectContacts(_participants)),
  selectMessageMode: mode => dispatch(Actions.selectMessageMode(mode)),
  startEdingChat: () => dispatch(Actions.changeChatLayout('editing')),
  togglePanel: open => dispatch(Actions.panelOpen(open)),
  hideSidebar: () => dispatch(CoreCreators.hideSidebar()),
  updateChat: (chat_id, title, file) =>
    dispatch(Actions.updateChatAttempt(chat_id, title, file))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatSession);
