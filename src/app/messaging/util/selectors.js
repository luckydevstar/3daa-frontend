import {
  any,
  both,
  complement,
  contains,
  defaultTo,
  filter,
  mapObjIndexed,
  path,
  pipe,
  propEq,
  propOr,
  reverse,
  slice,
  sort,
  toLower,
  values
} from 'ramda';
import helpers from './helpers';

const { getChatTitle } = helpers;

// Helpers

const addId = mapObjIndexed((chat, chat_id) => ({ ...chat, chat_id }));

const setRecentActivity = mapObjIndexed(chat => {
  const recent_activity =
    path(['recent_message', 'created'])(chat) || chat.created;
  return { ...chat, recent_activity };
});

const mostRecentFirst = sort(
  (a, b) =>
    new Date(b.recent_activity).getTime() -
    new Date(a.recent_activity).getTime()
);

const viewableChats = pipe(
  addId,
  setRecentActivity,
  values,
  mostRecentFirst
);

// Selectors

const filterGroupChats = (allChats, chatFilter, user) => {
  const chats = filter(chat => chat.participants.length > 2)(
    viewableChats(allChats)
  );
  const chatFilterOp = pipe(
    chat => getChatTitle(chat, user),
    toLower,
    contains(toLower(chatFilter))
  );

  const rst = !chatFilter ? chats : filter(chatFilterOp)(chats);

  return rst;
};

const allChatParticipants = (allChats, user, searchTerm = '') => {
  const participants = {};

  values(allChats).forEach(chat => {
    chat.participants.forEach(p => {
      if (p.object_id === user.member_id) return;
      if (
        searchTerm !== '' &&
        p.screen_name !== null &&
        !contains(toLower(searchTerm), toLower(p.screen_name))
      )
        return;

      const participant = participants[p.object_id];
      if (participant) {
        if (
          participant.latest_chat.recent_message.created <
          chat.recent_message.created
        ) {
          participant.latest_chat = chat;
        }
        participant.unread_count += chat.unread_count;
      } else if (!p.is_deleted) {
        participants[p.object_id] = {
          ...p,
          latest_chat: chat,
          unread: chat.unread_count
        };
      }
    });
  });
  return values(participants);
};

const filterChatsByParticipant = (allChats, participant_id) => {
  const participantFilter = chat =>
    any(
      both(
        propEq('object_id', participant_id),
        complement(propEq('is_deleted', 1))
      ),
      chat.participants
    );

  return pipe(
    filter(participantFilter),
    values
  )(allChats);
};

const filterContacts = (contacts, _filter) => {
  if (!_filter) return reverse(slice(0, 10)(contacts));

  const contactFilter = pipe(
    propOr('', 'screen_name'),
    defaultTo(''),
    toLower,
    contains(toLower(_filter))
  );
  return reverse(filter(contactFilter)(contacts));
};

export default {
  allChatParticipants,
  filterChatsByParticipant,
  filterGroupChats,
  filterContacts
};
