// import Panes from 'app/messaging/constants';
import {
  takeEvery,
  takeLatest,
  put,
  call,
  select,
  all
} from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { checkResponse } from 'app/common/util/helpers';
import { Types, Creators as Actions } from '../actions';
import {
  difference,
  map,
  min,
  pipe,
  pluck,
  prop,
  reverse,
  sortBy
} from 'ramda';
import common from 'app/common';
import helpers from '../util/helpers';

const {
  notify: { notifyError, notifySuccess },
  helpers: { convertToFormData }
} = common.util;
const { mapMember, firstParticipant } = helpers;

const member_ids = pluck('member_id');
const object_ids = pluck('object_id');

export default api => {
  // Chats
  function* getChatsAttempt() {
    try {
      const resp = yield call(api.getChats);
      const {
        data: { chats }
      } = yield checkResponse(resp);
      yield put(Actions.getChatsSuccess(chats));
    } catch (err) {
      yield put(Actions.getChatsFailure(err));
    }
  }

  function* getMediaAttempt({ member_id }) {
    try {
      const resp = yield call(api.getMemberMedia, member_id);
      const {
        data: { media }
      } = yield checkResponse(resp);
      yield put(Actions.getMediaSuccess(member_id, media));
    } catch (err) {
      yield put(Actions.getMediaFailure(err));
    }
  }

  // New Chats
  function* startChatAttempt({
    participants,
    title,
    routeChange,
    file = null
  }) {
    try {
      const formData = new FormData();
      const participantArray = member_ids(participants);
      for (var i = 0; i < participantArray.length; i++) {
        formData.append('participants[]', participantArray[i]);
      }

      formData.append('title', title);
      if (file) {
        formData.append('file', file);
      }
      const resp = yield call(api.newChat, formData);
      const {
        data: { chat },
        message
      } = yield checkResponse(resp);
      yield put(Actions.startChatSuccess(chat));
      yield put(notifySuccess(message));
      if (routeChange) browserHistory.push('/messaging');
    } catch (error) {
      put(Actions.startChatFailure(error));
    }
  }

  function* startChatSuccess({ chat }) {
    const {
      profile: { user }
    } = yield select();
    const participant = firstParticipant(chat, user);
    if (participant) {
      yield put(Actions.participantSelected(participant.object_id));
    }
  }

  // Delete chat
  function* deleteChatAttempt({ chat_id }) {
    try {
      const resp = yield call(api.deleteChat, chat_id);
      yield checkResponse(resp);
      yield put(Actions.deleteChatSuccess(chat_id));
      yield put(Actions.removeChatMessages(chat_id));
    } catch (error) {
      yield put(notifyError(error));
    }
  }

  // Leave chat
  function* leaveChatAttempt({ chat_id }) {
    try {
      const resp = yield call(api.leaveChat, chat_id);
      yield checkResponse(resp);
      yield put(Actions.leaveChatSuccess(chat_id));
      yield put(Actions.removeChatMessages(chat_id));
    } catch (error) {
      yield put(notifyError(error));
    }
  }

  // Update chat
  function* updateChatAttempt({ chat_id, title, file }) {
    try {
      const formData = convertToFormData({ title, file });
      const resp = yield call(api.updateChat, chat_id, formData);
      yield checkResponse(resp);
      yield put(Actions.updateChatSuccess(chat_id));
    } catch (error) {
      yield put(notifyError(error));
      yield put(Actions.chatApiFinished());
    }
  }

  function* updateChatSuccess({ chat_id }) {
    try {
      const resp = yield call(api.getChat, chat_id);
      const { data } = yield checkResponse(resp);
      const { title, cloudinary_file_id } = data.chat;
      yield put(
        Actions.chatUpdated(chat_id, {
          title,
          cloudinary_file_id
        })
      );
    } catch (error) {
      yield put(notifyError(error));
    }
    yield put(Actions.chatApiFinished());
  }

  // Add chat participants
  function* chatParticipantsAttempt() {
    try {
      const {
        chats: { selectedChat, all: allChats },
        contacts: { selectedContacts },
        profile: { user }
      } = yield select();
      let prev = object_ids(allChats[selectedChat].participants);
      prev = difference(prev, [user.member_id]);
      let next = member_ids(selectedContacts);

      const removeList = difference(prev, next);
      if (removeList && removeList.length > 0) {
        const resp = yield call(
          api.removeChatParticipants,
          selectedChat,
          removeList
        );
        yield checkResponse(resp);
      }

      const addList = difference(next, removeList);
      if (addList && addList.length > 0) {
        const resp = yield call(api.addChatParticipants, selectedChat, addList);
        yield checkResponse(resp);
      }

      next = map(participant =>
        participant.object_id ? participant : mapMember(participant)
      )([user, ...selectedContacts]);

      yield put(Actions.chatParticipantsSuccess(next));
      yield put(Actions.startChatFailure());
    } catch (error) {
      yield put(notifyError(error));
      yield put(Actions.startChatFailure());
    }
    yield put(Actions.changeChatLayout('chats'));
  }

  // Messages
  function* getMessagesAttempt({ chat_id }) {
    const { chats } = yield select();
    const chat = chats.all[chat_id];
    const { current_count, unread_count, total_count } = chat;

    if (total_count && current_count === total_count) return;

    const per_page = unread_count < 10 ? 10 : unread_count;
    const current_page = Math.floor(current_count / per_page) + 1;
    try {
      const resp = yield call(api.getMessages, chat_id, current_page, per_page);
      const {
        data: { messages, meta }
      } = yield checkResponse(resp);

      // add unread to messages
      const msgs = pipe(
        sortBy(prop('created')),
        reverse
      )(messages);
      for (let i = 0; i < unread_count; i++) {
        msgs[i].unread = true;
      }
      //
      yield put(Actions.getMessagesSuccess(msgs, chat_id));
      const counts = {
        current_count: min(current_page * per_page, meta.messages_count),
        total_count: meta.messages_count
      };
      yield put(Actions.chatUpdated(chat_id, counts));
    } catch ({ message, stack }) {
      yield put(Actions.getMessagesFailure(message));
    }
  }

  function* chatMarkAsReadAttempt({ chat }) {
    if (chat && chat.unread_count > 0) {
      try {
        yield call(api.markChatRead, chat.chat_id);
        yield put(Actions.chatMarkAsReadSuccess(chat.chat_id));
      } catch (err) {
        console.log(err);
      }
    }
  }

  function* sendMessageAttempt({ chat_id, message }) {
    const {
      profile: {
        user: { member_id }
      }
    } = yield select();

    const pending_message_id = `pending-${new Date().getTime()}`;

    const pendingMessage = {
      message,
      object_id: member_id,
      message_id: pending_message_id,
      chat_id,
      sent: false
    };

    try {
      yield put(Actions.addPendingMessage(pendingMessage));
      const resp = yield call(api.sendMessage, chat_id, { message });
      const { data } = yield checkResponse(resp);
      yield put(Actions.sendMessageSuccess(data.message, pending_message_id));
    } catch (e) {
      yield put(Actions.sendMessageFailure(e));
    }
  }

  function* getChat(chat_id) {
    try {
      const resp = yield call(api.getChat, chat_id);
      const {
        data: { chat }
      } = yield checkResponse(resp);
      yield put(Actions.getChatsSuccess([chat]));
    } catch (err) {
      yield put(Actions.getChatsFailure(err));
    }
  }

  function* receiveMessage({ message, unread }) {
    const chat_id = message.chat_id;
    message.unread = unread;
    yield put(Actions.getMessagesSuccess([message], chat_id));

    if (unread) {
      const { chats } = yield select();
      const chat = chats.all[chat_id];

      if (chat) {
        const unread_count = chat.unread_count + 1 || 1;
        const current_count = chat.current_count + 1 || 1;
        const total_count = chat.total_count + 1 || undefined;

        yield put(
          Actions.chatUpdated(chat_id, {
            unread_count,
            current_count,
            total_count,
            recent_message: message
          })
        );
      } else {
        yield call(getChat, chat_id);
      }
    }
  }

  function* getContactsAttempt() {
    const {
      contacts: { filter }
    } = yield select();

    // Identify correct API call to make
    const params = {
      ...(filter && { search: filter })
    };

    try {
      const resp = yield call(api.getAllMembers, params);
      const {
        data: { members }
      } = yield checkResponse(resp);
      yield put(Actions.getContactsSuccess(members));
    } catch (error) {
      yield put(Actions.getContactsFailure(error));
    }
  }

  function* deleteMessages() {
    try {
      const {
        messages: { deleteMessages: msgs },
        chats: { selectedChat }
      } = yield select();
      yield all(msgs.map(msg => call(api.deleteMessage, selectedChat, msg)));
      yield put(Actions.removeMessages(msgs));
      yield put(Actions.selectMessageMode(false));
    } catch (err) {
      console.log(err);
    }
  }

  // The Main Watcher function
  // -----------
  function* startWatchers() {
    yield takeLatest(Types.GET_CHATS_ATTEMPT, getChatsAttempt);
    yield takeLatest(Types.GET_MEDIA_ATTEMPT, getMediaAttempt);
    yield takeEvery(Types.START_CHAT_ATTEMPT, startChatAttempt);
    yield takeEvery(Types.START_CHAT_SUCCESS, startChatSuccess);
    yield takeEvery(Types.DELETE_CHAT_ATTEMPT, deleteChatAttempt);
    yield takeEvery(Types.LEAVE_CHAT_ATTEMPT, leaveChatAttempt);
    yield takeEvery(Types.UPDATE_CHAT_ATTEMPT, updateChatAttempt);
    yield takeEvery(Types.UPDATE_CHAT_SUCCESS, updateChatSuccess);
    yield takeEvery(Types.CHAT_PARTICIPANTS_ATTEMPT, chatParticipantsAttempt);
    yield takeEvery(Types.GET_MESSAGES_ATTEMPT, getMessagesAttempt);
    yield takeEvery(Types.CHAT_MARK_AS_READ_ATTEMPT, chatMarkAsReadAttempt);
    yield takeEvery(Types.SEND_MESSAGE_ATTEMPT, sendMessageAttempt);
    yield takeEvery(Types.RECEIVE_MESSAGE, receiveMessage);
    yield takeEvery(Types.DELETE_MESSAGES, deleteMessages);
    yield takeEvery(Types.GET_CONTACTS_ATTEMPT, getContactsAttempt);
  }

  return {
    startWatchers
  };
};
