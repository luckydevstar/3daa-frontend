import React from 'react';
import { Text } from 'app/intl';

const ChatDelete = ({ closeChatDeleteModal, deleteChat, isOwner }) => (
  <div className="chat-delete">
    <div className="chat-icons">
      <div className="chat-icon">
        <div className="icon">
          <i className="fa fa-wechat" />
        </div>
      </div>
    </div>
    <div className="chat-message">
      <h1>
        {isOwner ? (
          <Text iKey="would_you_like_to_delete_this_conversation" />
        ) : (
          <Text iKey="would_you_like_to_leave_this_conversation" />
        )}
      </h1>
      <h3>
        <Text iKey="you_cant_undo_this_action" />
      </h3>
    </div>
    <div className="chat-btns">
      <button
        className="button is-primary is-outlined"
        onClick={() => closeChatDeleteModal()}
      >
        <Text iKey="cancel" />
      </button>
      <button className="button is-primary" onClick={() => deleteChat()}>
        {isOwner ? <Text iKey="delete" /> : <Text iKey="leave" />}
      </button>
    </div>
  </div>
);

export default ChatDelete;
