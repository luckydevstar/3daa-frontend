import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UIClickablePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      left: props.left
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.movePanel(this.props);
    if (this.props.listenResize) {
      window.addEventListener('resize', this.movePanel);
    }
    document.removeEventListener('click', this.handleClick);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.left !== this.props.left) {
      this.movePanel(nextProps);
    }

    if (nextProps.open && !this.props.open) {
      document.addEventListener('click', this.handleClick, false);
    } else if (!nextProps.open && this.props.open) {
      document.removeEventListener('click', this.handleClick);
    }
  }

  componentWillUnmount() {
    if (this.props.listenResize) {
      window.removeEventListener('resize', this.movePanel);
    }
  }

  handleClick(e) {
    if (!this.el || this.el.contains(e.target)) {
      return;
    }

    this.props.closePanel();
  }

  handleResize() {
    this.movePanel(this.props);
  }

  movePanel(props) {
    const { left, width } = props;
    if (width > window.innerWidth) {
      this.setState({
        left: 0
      });
      return;
    } else if (left > window.innerWidth - width) {
      this.setState({
        left: window.innerWidth - width
      });
      return;
    }

    this.setState({ left });
  }

  render() {
    const { children, top, width, height, open } = this.props;

    const { left } = this.state;

    const styles = { left, top, width };
    if (height > 0) {
      styles.height = height;
    }

    return (
      open && (
        <div
          className="ui-clickable-panel"
          style={styles}
          ref={el => {
            this.el = el;
          }}
        >
          {children}
        </div>
      )
    );
  }
}

UIClickablePanel.propTypes = {
  left: PropTypes.number,
  top: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  open: PropTypes.bool,
  listenResize: PropTypes.bool,
  closePanel: PropTypes.func.isRequired
};

UIClickablePanel.defaultProps = {
  left: 0,
  top: 80,
  width: 220,
  height: 0,
  open: false,
  listenResize: false
};

export default UIClickablePanel;
