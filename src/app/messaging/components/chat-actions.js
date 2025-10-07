import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Isvg from 'react-inlinesvg';
import common from 'app/common';

import IconSelectMsg from 'images/icon-select-msg.svg';
import IconBlockUser from 'images/icon-block-user.svg';
import IconPencil from 'images/icon_pencil.svg';
import IconLeaveChat from 'images/icon-leave-chat.svg';
import IconClose from 'images/icon-close.svg';
import IconReportFlag from 'images/icon-report-flag.svg';

const { noop } = common.util.helpers;

const ChatActions = ({
  isOwner,
  onCancel,
  onEdit,
  onLeaveChat,
  onSelectMessage,
  selectingMessages
}) => {
  const Intercom = window.Intercom;

  return (
    <div className="chat-actions">
      {!selectingMessages ? (
        <ul key="chat_actions_0">
          <li onClick={onSelectMessage}>
            <Isvg src={IconSelectMsg} />
            Select Messages
          </li>
          <li>
            <Isvg src={IconBlockUser} />
            Block user(s)
          </li>
          <li className="separator" />
          {isOwner && (
            <li onClick={onEdit}>
              <Isvg src={IconPencil} />
              Edit Chat
            </li>
          )}
          <li className="leave-chat" onClick={onLeaveChat}>
            <Isvg src={IconLeaveChat} />
            {isOwner ? 'Delete Chat' : 'Leave Chat'}
          </li>
          <li className="separator" />
          <li onClick={onCancel}>
            <Isvg src={IconClose} />
            Cancel
          </li>
          <li className="separator" />
          <li onClick={() => Intercom('show')}>
            <Isvg src={IconReportFlag} />
            Report
          </li>
        </ul>
      ) : (
        <ul key="chat_actions_1">
          <li onClick={onCancel}>
            <Isvg src={IconClose} />
            Cancel
          </li>
        </ul>
      )}
    </div>
  );
};

ChatActions.propTypes = {
  isOwner: PropTypes.bool,
  onCancel: PropTypes.func,
  onEdit: PropTypes.func,
  onLeaveChat: PropTypes.func,
  onSelectMessage: PropTypes.func
};

ChatActions.defaultProps = {
  isOwner: false,
  onCancel: noop,
  onEdit: noop,
  onLeaveChat: noop,
  onSelectMessage: noop
};

const mapStateToProps = ({ messages: { selectingMessages } }) => ({
  selectingMessages
});

export default connect(mapStateToProps, null)(ChatActions);
