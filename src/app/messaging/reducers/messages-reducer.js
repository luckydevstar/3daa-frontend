import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { Types } from '../actions';
import {
  complement,
  dissoc,
  filter,
  findIndex,
  indexBy,
  indexOf,
  map,
  pipe,
  prop,
  propEq,
  values
} from 'ramda';
import helpers from '../util/helpers';

export const INITIAL_STATE = Immutable({
  all: {}, // all: { message_id: {object_id: 3132, message: foo }}
  pendingMessages: {},
  gettingMessages: false,
  sendingMessage: false,
  selectingMessages: false,
  deleteMessages: []
});

const getMessagesAttempt = state => state.merge({ gettingMessages: true });

const getMessagesSuccess = (state, { messages, chat_id }) => {
  const addMsgIndex = pipe(
    map(msg => ({ ...msg, chat_id })),
    indexBy(prop('message_id'))
  );

  return state.merge({
    all: {
      ...state.all,
      ...addMsgIndex(messages)
    },
    gettingMessages: false
  });
};

const getMessagesFailure = state => state.merge({ gettingMessages: false });

const addPendingMessage = (state, { message }) =>
  state.merge({
    pendingMessages: {
      ...state.pendingMessages,
      [message.message_id]: message
    }
  });

const removePendingMessage = (state, { message_id }) =>
  state.merge({
    pendingMessages: dissoc(message_id, state.pendingMessages)
  });

const sendMessageAttempt = state => state.merge({ sendingMessage: true });

const sendMessageSuccess = (state, { message, pending_message_id }) =>
  state.merge({
    all: {
      ...state.all,
      [message.message_id]: message
    },
    pendingMessages: dissoc(pending_message_id, state.pendingMessages),
    sendingMessage: false
  });

const sendMessageFailure = state => state.merge({ sendingMessage: false });

const removeChatMessages = (state, { chat_id }) => {
  const messageFilter = pipe(propEq('chat_id', chat_id), complement);

  return state.merge({
    all: filter(messageFilter)(state.all)
  });
};

const markMessagesRead = (state, { chat_id }) => {
  return state.merge({
    all: map(
      msg =>
        helpers.compareInt(msg.chat_id, chat_id) && msg.unread
          ? { ...msg, unread: false }
          : msg
    )(state.all)
  });
};

const selectMessageMode = (state, { mode }) =>
  state.merge({
    selectingMessages: mode
  });

const toggleDeleteMessage = (state, { msg_id, checked }) => {
  const msgs = state.deleteMessages;
  return checked
    ? state.merge({
        deleteMessages: [...msgs, msg_id]
      })
    : state.merge({
        deleteMessages: msgs.filter(msg => msg !== msg_id)
      });
};

const clearDeleteMessages = state =>
  state.merge({
    deleteMessages: []
  });

const removeMessages = (state, { msgs }) => {
  const filtered = filter(msg => indexOf(msg.message_id, msgs) < 0)(
    values(state.all)
  );
  return state.merge({
    all: indexBy(prop('message_id'))(filtered)
  });
};

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.GET_MESSAGES_ATTEMPT]: getMessagesAttempt,
  [Types.GET_MESSAGES_SUCCESS]: getMessagesSuccess,
  [Types.GET_MESSAGES_FAILURE]: getMessagesFailure,
  [Types.SEND_MESSAGE_ATTEMPT]: sendMessageAttempt,
  [Types.SEND_MESSAGE_SUCCESS]: sendMessageSuccess,
  [Types.SEND_MESSAGE_FAILURE]: sendMessageFailure,
  [Types.ADD_PENDING_MESSAGE]: addPendingMessage,
  [Types.REMOVE_PENDING_MESSAGE]: removePendingMessage,
  [Types.REMOVE_CHAT_MESSAGES]: removeChatMessages,
  [Types.MARK_MESSAGES_READ]: markMessagesRead,
  [Types.SELECT_MESSAGE_MODE]: selectMessageMode,
  [Types.TOGGLE_DELETE_MESSAGE]: toggleDeleteMessage,
  [Types.CLEAR_DELETE_MESSAGES]: clearDeleteMessages,
  [Types.REMOVE_MESSAGES]: removeMessages
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
