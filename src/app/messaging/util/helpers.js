import moment from 'moment-timezone';
import {
  always,
  both,
  complement,
  cond,
  defaultTo,
  either,
  equals,
  findIndex,
  join,
  map,
  pipe,
  prop,
  propEq,
  reject,
  T
} from 'ramda';

const compareInt = (i1, i2) => parseInt(i1) === parseInt(i2);

const findTheOthers = (chat, member_id) => {
  const selfOrDeleted = either(
    propEq('object_id', member_id),
    propEq('is_deleted', 1)
  );

  // prettier-ignore
  return pipe(
    defaultTo([]),
    reject(selfOrDeleted)
  )(chat.participants);
};

/**
 * Give chats a title, for chat lists, and chat windows
 * @param {object} chat - a chat, as from state.chats.all[chat_id]
 * @param {object} current_user - such as from state.profile.user
 * @return {string} the title of a chat
 */
const getChatTitle = (chat, current_user) => {
  const others = findTheOthers(chat, current_user);
  const chatTitle = join(', ', map(prop('screen_name'))(others));

  return chat.title || chatTitle;
};

const getChatPhoto = (chat, current_user) => {
  const others = findTheOthers(chat, current_user);
  if (others.length === 1) return others[0].photo;

  return null;
};

const getMessagesInChat = (messages, chat_id) =>
  messages.filter(msg => msg.chat_id === chat_id);

const getSelectedChat = (chats, selectedChat) =>
  chats.find(chat => chat.chat_id === selectedChat);

const formatTimestamp = then => {
  const lastTime = moment(then, 'YYYY-MM-DD hh:mm:ss');

  if (lastTime.get('date') === moment().get('date')) {
    return `Today ${lastTime.format('HH:mm')}`;
  }

  return lastTime.format('Do MMM, HH:mm');
};

const mapParticipant = participant => ({
  ...participant,
  member_id: participant.object_id,
  cloudinary_file_id: participant.photo
});

const mapMember = participant => ({
  object_id: participant.member_id,
  type: 'member',
  screen_name: participant.screen_name,
  photo: participant.cloudinary_file_id,
  gender: participant.gender,
  email: participant.email
});

const firstParticipant = ({ participants }, user) =>
  participants[0].object_id === user.member_id
    ? participants[1]
    : participants[0];

const currentTab = cond([
  [equals('chats'), always('chats')],
  [equals('group'), always('group')],
  [T, always('contacts')]
]);

const participants = chat => {
  if (chat && chat.participants)
    return chat.participants.filter(p => !p.is_deleted);
  return [];
};

const participantsRemoveMe = (chat, member_id) => {
  if (chat && chat.participants)
    return chat.participants.filter(
      p => !p.is_deleted && p.object_id !== member_id
    );
  return [];
};

const findParticipant = (participant_id, chat) =>
  findIndex(
    both(
      propEq('object_id', participant_id),
      complement(propEq('is_deleted', 1))
    ),
    chat.participants
  );

export default {
  compareInt,
  currentTab,
  findParticipant,
  findTheOthers,
  firstParticipant,
  formatTimestamp,
  getChatTitle,
  getChatPhoto,
  getMessagesInChat,
  getSelectedChat,
  mapParticipant,
  mapMember,
  participants,
  participantsRemoveMe
};
