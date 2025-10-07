import React from 'react';
import PropTypes from 'prop-types';
import { findIndex, propEq } from 'ramda';
import common from 'app/common';
import { RoleNameMap } from 'app/core/config/constants';
import SelectableMediaItem from './selectable-media-item';

const UILoading = common.components.UILoading;
const noop = common.util.helpers.noop;

const ContactItem = ({ contact, multiSelect, onSelect, selected }) => {
  const {
    member_id,
    centre_roles,
    cloudinary_file_id,
    gender,
    screen_name
  } = contact;

  const role = RoleNameMap[centre_roles[0]];

  return (
    <SelectableMediaItem
      key={`contact-${member_id}`}
      photo={cloudinary_file_id}
      gender={gender}
      title={screen_name}
      subtitle={role}
      multiSelect={multiSelect}
      selected={selected}
      onSelect={() => onSelect(contact)}
    />
  );
};

const Contacts = ({
  contacts,
  gettingContacts,
  onSelect,
  multiSelect,
  selectedContacts
}) => {
  return gettingContacts ? (
    <UILoading alignMiddle />
  ) : (
    <ul>
      {contacts.length > 0 ? (
        contacts.map(contact => (
          <ContactItem
            key={`contact-${contact.member_id}`}
            {...{
              contact,
              onSelect,
              multiSelect,
              selected:
                findIndex(propEq('member_id', contact.member_id))(
                  selectedContacts
                ) >= 0
            }}
          />
        ))
      ) : (
        <li className="has-text-centered">No Result!</li>
      )}
    </ul>
  );
};

Contacts.defaultProps = {
  onSelect: noop,
  multiSelect: false,
  gettingContacts: false,
  contacts: [],
  selectedContacts: []
};

Contacts.propTypes = {
  onSelect: PropTypes.func,
  multiSelect: PropTypes.bool,
  gettingContacts: PropTypes.bool,
  contacts: PropTypes.array,
  selectedContacts: PropTypes.array
};

export default Contacts;
