import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  receiveNotification: ['payload'],
  receiveFriendRequest: ({ meta, body }, markAsRead, markAsNew) => ({
    type: 'RECEIVE_FRIEND_REQUEST',
    meta,
    body,
    markAsRead,
    markAsNew
  }),
  receiveChatMessage: ({ meta, body }, markAsRead) => ({
    type: 'RECEIVE_CHAT_MESSAGE',
    meta,
    body,
    markAsRead
  }),
  getMemberNotificationsAttempt: [],
  getMemberNotificationsSuccess: ['notifications'],
  getMemberNotificationsFailure: ['error']
});
