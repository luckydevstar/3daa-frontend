import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import { Types } from 'app/notifications/actions';
import { Types as CommunityTypes } from 'app/community/actions';
import { Types as CoreTypes } from 'app/core/actions';
import { Types as MessagingTypes } from 'app/messaging/actions';

export const INITIAL_STATE = Immutable([]);

const receiveFriendRequest = (state, { meta, body, markAsRead, markAsNew }) => [
  ...state,
  {
    meta,
    body: JSON.parse(body),
    isRead: markAsRead,
    isNew: markAsNew,
    accept: {
      attempt: false,
      success: false,
      failure: false
    },
    decline: {
      attempt: false,
      success: false,
      failure: false
    }
  }
];

const receiveChatMessage = (state, { meta, body, markAsRead }) => [
  ...state,
  {
    meta,
    body: JSON.parse(body),
    isRead: markAsRead
  }
];

const markAsOld = state => {
  const newState = state.map(item => {
    if (item.isNew) item.isNew = false;
    return item;
  });
  return newState;
};

const chatSelected = (state, { chat_id }) => {
  const newState = state.map(item => {
    if (
      item.meta.event === 'message' &&
      item.body.chat_id === parseInt(chat_id)
    ) {
      item.isRead = true;
    }
    return item;
  });
  return newState;
};

const getMemberNotificationsSuccess = (state, { notifications }) => {
  if (notifications.length > 0) {
    const newState = notifications.map(item => {
      return {
        ...item,
        read: true,
        accept: {
          attempt: false,
          success: false,
          failure: false
        },
        decline: {
          attempt: false,
          success: false,
          failure: false
        }
      };
    });
    return newState;
  }
  return state;
};

const manageConnectionAttempt = (state, { connection, action }) => {
  const { meta: { notification_id } } = connection;
  const newState = state.map(item => {
    if (item.meta.notification_id === notification_id) {
      return {
        ...item,
        [action]: {
          ...item[action],
          attempt: true
        }
      };
    }
    return item;
  });
  return newState;
};

const manageConnectionSuccess = (state, { connection, action }) => {
  const { meta: { notification_id } } = connection;
  const newState = state.map(item => {
    if (item.meta.notification_id === notification_id) {
      return {
        ...item,
        [action]: {
          ...item[action],
          attempt: false,
          success: true
        }
      };
    }
    return item;
  });
  return newState;
};

const manageConnectionFailure = (state, { connection, action }) => {
  const { meta: { notification_id } } = connection;
  const newState = state.map(item => {
    if (item.meta.notification_id === notification_id) {
      return {
        ...item,
        [action]: {
          ...item[action],
          attempt: false,
          failure: true
        }
      };
    }
    return item;
  });
  return newState;
};

const ACTION_HANDLERS = {
  [Types.RECEIVE_FRIEND_REQUEST]: receiveFriendRequest,
  [Types.RECEIVE_CHAT_MESSAGE]: receiveChatMessage,
  [Types.GET_MEMBER_NOTIFICATIONS_SUCCESS]: getMemberNotificationsSuccess,
  [CoreTypes.TOGGLE_SIDEBAR]: markAsOld,
  [MessagingTypes.CHAT_SELECTED]: chatSelected,
  [CommunityTypes.MANAGE_CONNECTION_ATTEMPT]: manageConnectionAttempt,
  [CommunityTypes.MANAGE_CONNECTION_SUCCESS]: manageConnectionSuccess,
  [CommunityTypes.MANAGE_CONNECTION_FAILURE]: manageConnectionFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
