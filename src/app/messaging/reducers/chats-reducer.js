import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { Types } from '../actions';
import { contains, dissoc, filter, indexBy, map, pipe, prop } from 'ramda';

export const INITIAL_STATE = Immutable({
  all: {}, // chats: { 1: { messages, participants...}, 2: { messages, participants...}, 3: {...} }
  callingApi: false,
  gettingChats: false,
  gettingMedia: false,
  filter: '',
  searchTerm: '',
  layout: 'chats', // chats, group, create, editing
  mediaList: {},
  panelOpen: false,
  selectedChat: null,
  selectedParticipant: -1,
  creatingChat: false
});

const chatApiAttempt = state => state.merge({ callingApi: true });

const chatApiFinished = state => state.merge({ callingApi: false });

const updateChat = (state, chat) => {
  const current = state[chat.chat_id];
  if (current) {
    const total_count = current.total_count;
    const current_count = current.current_count;

    return {
      ...chat,
      total_count,
      current_count
    };
  }

  return {
    ...chat,
    current_count: 0
  };
};

const getChatsAttempt = state =>
  state.merge({
    gettingChats: true
  });

const getChatsSuccess = (state, { chats }) =>
  state.merge({
    all: {
      ...state.all,
      ...pipe(
        map(chat => updateChat(state.all, chat)),
        indexBy(prop('chat_id'))
      )(chats)
    },
    gettingChats: false
  });

const getChatsFailure = state =>
  state.merge({
    gettingChats: false
  });

const getMediaAttempt = state =>
  state.merge({
    gettingMedia: true
  });

const getMediaSuccess = (state, { member_id, list }) =>
  state.merge({
    gettingMedia: false,
    mediaList: {
      ...state.mediaList,
      [member_id]: list
    }
  });

const getMediaFailure = state =>
  state.merge({
    gettingMedia: false
  });

const startChatSuccess = (state, { chat }) =>
  state.merge({
    all: {
      ...state.all,
      [chat.chat_id]: updateChat(state, chat)
    },
    callingApi: false,
    layout: 'chats',
    selectedChat: `${chat.chat_id}`,
    creatingChat: false
  });

const deleteChatSuccess = (state, { chat_id }) =>
  state.merge({
    all: dissoc(chat_id, state.all)
  });

const chatFilterChanged = (state, { filter: _filter }) =>
  state.merge({ filter: _filter });

const chatParticipantsSuccess = (state, { participants }) => {
  const chat_id = state.selectedChat;
  const chat = state.all[chat_id];

  return state.merge({
    all: {
      ...state.all,
      [chat_id]: {
        ...chat,
        participants
      }
    }
  });
};

const chatMarkAsReadSuccess = (state, { chat_id }) =>
  state.merge({
    all: {
      ...state.all,
      [chat_id]: {
        ...state.all[chat_id],
        unread_count: 0
      }
    }
  });

const chatSelected = (state, { chat_id }) =>
  state.merge({ selectedChat: `${chat_id}` });

const chatUpdated = (state, { chat_id, data }) =>
  state.merge({
    all: {
      ...state.all,
      [chat_id]: {
        ...state.all[chat_id],
        ...data
      }
    }
  });

const changeChatLayout = (state, { layout }) => state.merge({ layout });

const participantSelected = (state, { member_id }) =>
  state.merge({
    selectedParticipant: member_id
  });

const participantsDeleted = (state, { chat_id, deleted_participants }) => {
  const chat = state.all[chat_id];
  const list = map(prop('object_id'), deleted_participants);
  const participants = filter(
    p => !contains(`${p.object_id}`, list),
    chat.participants
  );
  return state.merge({
    all: {
      ...state.all,
      [chat_id]: {
        ...chat,
        participants
      }
    }
  });
};

const panelOpen = (state, { open }) =>
  state.merge({
    panelOpen: open
  });

const updateSearchTerm = (state, { searchTerm }) =>
  state.merge({
    searchTerm
  });

const updateCreatingChat = (state, { creatingChat }) =>
  state.merge({
    creatingChat
  });

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.CHAT_API_ATTEMPT]: chatApiAttempt,
  [Types.CHAT_API_FINISHED]: chatApiFinished,
  [Types.GET_CHATS_ATTEMPT]: getChatsAttempt,
  [Types.GET_CHATS_SUCCESS]: getChatsSuccess,
  [Types.GET_CHATS_FAILURE]: getChatsFailure,
  [Types.GET_MEDIA_ATTEMPT]: getMediaAttempt,
  [Types.GET_MEDIA_SUCCESS]: getMediaSuccess,
  [Types.GET_MEDIA_FAILURE]: getMediaFailure,
  [Types.START_CHAT_ATTEMPT]: chatApiAttempt,
  [Types.START_CHAT_SUCCESS]: startChatSuccess,
  [Types.START_CHAT_FAILURE]: chatApiFinished,
  [Types.DELETE_CHAT_SUCCESS]: deleteChatSuccess,
  [Types.LEAVE_CHAT_SUCCESS]: deleteChatSuccess,
  [Types.UPDATE_CHAT_ATTEMPT]: chatApiAttempt,
  [Types.CHAT_PARTICIPANTS_SUCCESS]: chatParticipantsSuccess,
  [Types.CHAT_FILTER_CHANGED]: chatFilterChanged,
  [Types.CHAT_MARK_AS_READ_SUCCESS]: chatMarkAsReadSuccess,
  [Types.CHAT_SELECTED]: chatSelected,
  [Types.CHAT_UPDATED]: chatUpdated,
  [Types.CHANGE_CHAT_LAYOUT]: changeChatLayout,
  [Types.PARTICIPANT_SELECTED]: participantSelected,
  [Types.PARTICIPANTS_DELETED]: participantsDeleted,
  [Types.PANEL_OPEN]: panelOpen,
  [Types.UPDATE_SEARCH_TERM]: updateSearchTerm,
  [Types.UPDATE_CREATING_CHAT]: updateCreatingChat
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
