import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Creators as Actions } from '../actions';
import ChatSearchBar from './chat-search';
import Contacts from './contacts';
import { debounce } from 'lodash';
import { unionWith, eqBy, prop } from 'ramda';
import selectors from '../util/selectors';
import cx from 'classnames';

const { filterContacts } = selectors;

class ContactsFilter extends Component {
  componentDidMount() {
    const { contacts, contactsFilterChanged } = this.props;
    if (contacts.length === 0) contactsFilterChanged('');
  }

  render() {
    const {
      contacts,
      contactsFilterChanged,
      filter,
      gettingContacts,
      multiSelect,
      onBack,
      selectContact,
      selectedContacts,
      side
    } = this.props;

    const containerClass = cx('contacts', {
      side
    });

    return (
      <div className={containerClass}>
        <ChatSearchBar
          searchPhrase={filter}
          onBack={onBack}
          onChange={debounce(contactsFilterChanged, 500)}
          placeholder="Find a Contact"
          side={side}
        />
        <Contacts
          {...{
            gettingContacts,
            contacts,
            selectedContacts,
            multiSelect,
            onSelect: contact => selectContact(contact, multiSelect)
          }}
        />
        {side &&
          <button
            className="button create-button is-primary"
            disabled={!selectedContacts || selectedContacts.length === 0}
          >
            Create chat
          </button>}
      </div>
    );
  }
}

ContactsFilter.defaultProps = {
  onBack: null,
  multiSelect: false,
  side: false
};

ContactsFilter.propTypes = {
  onBack: PropTypes.func,
  multiSelect: PropTypes.bool,
  side: PropTypes.bool
};

const mapStateToProps = (
  { contacts: { list, gettingContacts, filter, selectedContacts } },
  ownProps
) => {
  let contacts = filterContacts(list, filter);
  if (ownProps.side) {
    contacts = unionWith(eqBy(prop('member_id')))(selectedContacts, contacts);
  }

  return {
    gettingContacts,
    contacts,
    filter,
    selectedContacts
  };
};

const mapDispatchToProps = dispatch => ({
  contactsFilterChanged: newFilter => {
    dispatch(Actions.contactsFilterChanged(newFilter));
    dispatch(Actions.getContactsAttempt());
  },
  selectContact: (contact, multi) =>
    dispatch(Actions.toggleContact(contact, multi))
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsFilter);
