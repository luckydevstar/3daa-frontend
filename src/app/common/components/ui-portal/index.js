import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import Responsive from 'react-responsive-decorator';
import cx from 'classnames';
import { MIN_WINDOW_WIDTH } from 'app/core/config/constants';

const portalClasses = isNotSupported =>
  cx({
    hide: isNotSupported
  });

class UIPortal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNotSupported: false
    };

    this.executeMediaQueries = this.executeMediaQueries.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.executeMediaQueries);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.executeMediaQueries);
  }

  executeMediaQueries() {
    this.props.media({ minWidth: MIN_WINDOW_WIDTH }, () => {
      this.setState({
        isNotSupported: false
      });
    });

    this.props.media({ maxWidth: MIN_WINDOW_WIDTH - 1 }, () => {
      this.setState({
        isNotSupported: true
      });
    });
  }

  render() {
    const {
      children,
      isOpened,
      openByClickOn,
      closeOnEsc,
      closeOnOutsideClick,
      onOpen,
      beforeClose,
      onClose,
      onUpdate
    } = this.props;
    const { isNotSupported } = this.state;

    return (
      <Portal
        ref={c => {
          this.portal = c;
        }}
        isOpened={isOpened}
        openByClickOn={openByClickOn}
        closeOnEsc={closeOnEsc}
        closeOnOutsideClick={closeOnOutsideClick}
        onOpen={onOpen}
        beforeClose={beforeClose}
        onClose={onClose}
        onUpdate={onUpdate}
      >
        <div className={`portal-view ${portalClasses(isNotSupported)}`}>
          {children}
        </div>
      </Portal>
    );
  }
}

UIPortal.contextTypes = {
  open: PropTypes.func,
  close: PropTypes.func
};

UIPortal.propTypes = {
  isOpened: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool
};

UIPortal.defaultProps = {
  isOpened: false,
  closeOnEsc: false,
  closeOnOutsideClick: false
};

export default Responsive(UIPortal);
