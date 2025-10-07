import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const noop = common.util.helpers.noop;

const AddButton = ({ onAdd }) => (
  <a className="chat-add-button" onClick={onAdd}>
    add <i className="fa fa-plus-circle" />
  </a>
);

AddButton.propTypes = {
  onAdd: PropTypes.func
};

AddButton.defaultProps = {
  onAdd: noop
};

export default AddButton;
