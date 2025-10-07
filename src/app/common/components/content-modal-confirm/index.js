/**
 * To open call open(cb) through ref
 *
 * parameters cb - callback function, to be called on confirm button click.
 *
 * Props
 * * body - required JSX element (Content of a modal)
 * * className - optional String (replace default className)
 */

// CORE
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// ADDONS
import ContentModal from '../content-modal';

class ContentModalConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmClass: 'content-modal-confirm'
    };
    // Callback function passed from parent component
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.className) {
      this.setState({ confirmClass: nextProps.className });
    }
  }

  open() {
    this.modalRef.open();
  }

  close() {
    this.modalRef.close();
  }

  confirm() {
    // close confirm modal
    this.close();
    // call calback fucniton on confirm
    this.props.callback();
  }

  render() {
    return (
      <ContentModal
        ref={el => {
          this.modalRef = el;
        }}
      >
        <div className={this.state.confirmClass}>
          <div className="content-modal-confirm-inner">
            {this.props.children}
          </div>
          <div className="content-modal-confirm-control">
            <button
              className="button is-success is-pulled-right"
              onClick={this.confirm}
            >
              Confirm
            </button>
            <button className="button is-outlined" onClick={this.close}>
              Cancel
            </button>
          </div>
        </div>
      </ContentModal>
    );
  }
}

ContentModalConfirm.propTypes = {
  callback: PropTypes.func.isRequired
};

export default ContentModalConfirm;
