import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import { Text } from 'app/intl';

const noop = common.util.helpers.noop;

const NewChatButton = ({ handler }) =>
  <button onClick={handler} className="newchat button is-primary is-outlined">
    <i className="fa fa-plus" /> <Text iKey="new_chat" />
  </button>;

NewChatButton.defaultProps = {
  handler: noop
};

NewChatButton.propTypes = {
  handler: PropTypes.func
};

export default NewChatButton;
