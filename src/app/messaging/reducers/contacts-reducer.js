import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { Types } from '../actions';
import { findIndex, propEq, reject, union } from 'ramda';

export const INITIAL_STATE = Immutable({
  errorCode: null,
  filter: null,
  list: [],
  gettingContacts: false,
  selectedContacts: []
});

// Contacts users
const getContactsAttempt = state =>
  state.merge({
    gettingContacts: true
  });

const getContactsSuccess = (state, { contacts: list }) =>
  state.merge({
    gettingContacts: false,
    list: union(state.list, list)
  });

const getContactsFailure = (state, { errorCode }) =>
  state.merge({
    errorCode,
    gettingContacts: false
  });

const contactsFilterChanged = (state, { newFilter: filter }) =>
  state.merge({
    filter,
    gettingContacts: true
  });

const toggleContact = (state, { contact, multi }) => {
  if (!multi) {
    return state.merge({
      selectedContacts: [contact]
    });
  }

  const eqMemberId = propEq('member_id', contact.member_id);
  const findContact = findIndex(eqMemberId);
  const selectedContacts = state.selectedContacts;
  const i = findContact(selectedContacts);

  if (i < 0) {
    return state.merge({
      selectedContacts: [...selectedContacts, contact]
    });
  } else if (!selectedContacts[i].unremovable) {
    return state.merge({
      selectedContacts: reject(eqMemberId)(selectedContacts)
    });
  }

  return state;
};

const selectContacts = (state, { selectedContacts }) =>
  state.merge({ selectedContacts });

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.GET_CONTACTS_ATTEMPT]: getContactsAttempt,
  [Types.GET_CONTACTS_SUCCESS]: getContactsSuccess,
  [Types.GET_CONTACTS_FAILURE]: getContactsFailure,
  [Types.CONTACTS_FILTER_CHANGED]: contactsFilterChanged,
  [Types.TOGGLE_CONTACT]: toggleContact,
  [Types.SELECT_CONTACTS]: selectContacts
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
