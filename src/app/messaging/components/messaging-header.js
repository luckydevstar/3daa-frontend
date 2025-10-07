import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

import NewChatButton from './new-chat-button';

const noop = common.util.helpers.noop;
const UINavigation = common.components.UINavigation;

const tabs = [
  {
    key: 'chats',
    text: 'Chats'
  },
  {
    key: 'group',
    text: 'Group'
  },
  {
    key: 'contacts',
    text: 'Contacts'
  }
];

const MessagingHeader = ({
  onTabChange,
  currentTab,
  onNewChat,
  showNewChat
}) => (
  <div className="messaging-header">
    <UINavigation
      active={currentTab}
      tabs={tabs}
      change={onTabChange}
      showSearch={false}
    />
    {showNewChat && <NewChatButton handler={onNewChat} />}
  </div>
);

MessagingHeader.propTypes = {
  currentTab: PropTypes.string,
  onTabChange: PropTypes.func,
  onNewChat: PropTypes.func,
  showNewChat: PropTypes.bool
};

MessagingHeader.defaultProps = {
  currentTab: '',
  onTabChange: noop,
  onNewChat: noop,
  showNewChat: true
};

export default MessagingHeader;
