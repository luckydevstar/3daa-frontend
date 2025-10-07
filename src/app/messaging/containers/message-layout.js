import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Creators as Actions } from '../actions';
import { Creators as CoreActions } from 'app/core/actions';
import components from '../components';
import helpers from '../util/helpers';
import common from 'app/common';

const { currentTab } = helpers;
const { Footer } = common.components;

const {
  MessagingHeader,
  ChatContacts,
  ChatCreate,
  GroupChats,
  ChatSession,
  ContactsFilter
} = components;

class MessageLayout extends Component {
  constructor(props) {
    super(props);

    this.changeTab = this.changeTab.bind(this);
    this.createChat = this.createChat.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { togglePanel } = this.props;
    togglePanel(false);
  }

  componentDidMount() {
    const { sidebarOpen, attemptGetChats, hideSidebbar } = this.props;
    if (sidebarOpen) {
      hideSidebbar();
    }
    attemptGetChats();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.chats.length <= 0 && nextProps.chats && nextProps.chats[0]) {
      this.props.selectChat(nextProps.chats[0]);
    }
  }

  changeTab(tab) {
    if (tab === 'chats' || tab === 'group') {
      this.props.changeChatLayout(tab);
    } else {
      this.createChat();
    }
    this.props.togglePanel(false);
  }

  createChat() {
    const { layout, changeChatLayout, clearSelectedContacts } = this.props;

    if (layout !== 'create') {
      changeChatLayout('create');
      clearSelectedContacts();
    }
  }

  render() {
    const { layout } = this.props;
    const tab = currentTab(layout);

    return (
      <div className="messaging">
        <MessagingHeader
          currentTab={tab}
          onTabChange={this.changeTab}
          onNewChat={this.createChat}
        />

        <div className="messaging-content">
          <div className="left">
            {tab === 'chats' && <ChatContacts />}
            {tab === 'group' && <GroupChats />}
            {tab === 'contacts' && <ContactsFilter multiSelect />}
          </div>
          {tab === 'contacts' ? <ChatCreate /> : <ChatSession />}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ chats: { layout, all }, ui: { sidebarOpen } }) => ({
  chats: all,
  layout,
  sidebarOpen
});

const mapDispatchToProps = dispatch => ({
  attemptGetChats: () => dispatch(Actions.getChatsAttempt()),
  changeChatLayout: layout => dispatch(Actions.changeChatLayout(layout)),
  deselectChat: () => dispatch(Actions.chatSelected(0)),
  selectChat: chat => dispatch(Actions.chatSelected(chat.chat_id)),
  clearSelectedContacts: () => dispatch(Actions.selectContacts([])),
  hideSidebbar: () => dispatch(CoreActions.toggleSidebar()),
  togglePanel: open => dispatch(Actions.panelOpen(open))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageLayout);
