import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { or } from 'ramda';
import { noop } from 'app/common/util/helpers';
import UIPortal from '../ui-portal';
import Modal from './modal';

class ContentModalNew extends Component {
  constructor(props) {
    super(props);
    this.state = { refShow: false };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  open() {
    this.props.onOpen();
    this.setState({ refShow: true });
  }

  close() {
    this.props.onClose();
    this.setState({ refShow: false });
  }

  render() {
    const { refShow } = this.state;
    const { isOpened } = this.props;
    const show = or(refShow, isOpened);

    return (
      <UIPortal isOpened={show}>
        <Modal {...{ ...this.props, show, close: this.close }}>
          {this.props.children}
        </Modal>
      </UIPortal>
    );
  }
}

ContentModalNew.propTypes = {
  isOpened: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func
};

ContentModalNew.defaultProps = {
  height: 'fixed',
  size: 'medium',
  isOpened: false,
  loadTabs: false,
  onClose: noop,
  onOpen: noop
};

export default ContentModalNew;
