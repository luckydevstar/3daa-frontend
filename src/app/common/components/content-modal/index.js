/* eslint-disable no-unused-expressions */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import { noop } from '../../util/helpers';
import cx from 'classnames';

class ContentModal extends Component {
  constructor(props) {
    super(props);

    const { className } = this.props;

    this.state = {
      className: cx('modal', className)
    };

    this.isOpen = false;
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    // this.beforeClose = this.beforeClose.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.modalRef = null;
  }

  onOpen(node) {
    // HACK
    setTimeout(() => {
      const type = this.props.type || 'flex';

      // // Force browser to accomodate
      // // animamtion
      window.getComputedStyle(node).display;
      window.getComputedStyle(node).opacity;

      const modalElement =
        node.querySelector('.modal') || node.firstChild || this.modalRef;

      // Add class to animate modal in
      modalElement.className = cx(this.state.className, type);

      window.getComputedStyle(node).display;
      window.getComputedStyle(node).opacity;
      node.querySelector('.modal').className = cx(
        this.state.className,
        type,
        'open'
      );
    }, 10);

    this.isOpen = true;
    this.props.onStateChange(true);
  }

  onClose() {
    this.isOpen = false;
    this.props.onStateChange(false);
    this.props.onClose();
  }

  open(params) {
    this.setState({
      ...params
    });
    this.portalRef.openPortal();
  }

  close() {
    this.portalRef.closePortal();
  }

  render() {
    // TODO have to replace with new modal because
    // can't access methods from UIPortal because
    // responsive decorator removes them...
    return (
      <Portal
        ref={el => {
          this.portalRef = el;
        }}
        onOpen={this.onOpen}
        onClose={this.onClose}
        // beforeClose={this.beforeClose}
      >
        <div
          ref={el => {
            this.modalRef = el;
          }}
          className={this.state.className}
        >
          <div className="modal-background" onClick={this.close} />
          <div className="modal-content old-modal">
            {!this.props.noCloseButton ? (
              <button className="modal-close" onClick={this.close} />
            ) : null}
            {this.props.children}
          </div>
        </div>
      </Portal>
    );
  }
}

ContentModal.propTypes = {
  noCloseButton: PropTypes.string,
  type: PropTypes.string,
  onStateChange: PropTypes.func,
  onClose: PropTypes.func
};

ContentModal.defaultProps = {
  noCloseButton: '',
  type: '',
  onStateChange: noop,
  onClose: noop
};

export default ContentModal;
