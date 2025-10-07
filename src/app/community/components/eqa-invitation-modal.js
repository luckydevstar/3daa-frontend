import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EQAInvitationModal extends Component {
  render() {
    const { isOpen, onClose } = this.props;
    if (!isOpen) return null;
    return (
      <div className="eqa-invitation-modal">
        <div className="eqa-invitation-modal-backdrop" onClick={onClose} />
        <div className="eqa-invitation-modal-block">
          {this.props.children}
          <div className="eqa-invitation-modal-block__shadow" />
        </div>
      </div>
    );
  }
}
EQAInvitationModal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
};
EQAInvitationModal.defaultProps = {
  isOpen: false
};

export default EQAInvitationModal;
