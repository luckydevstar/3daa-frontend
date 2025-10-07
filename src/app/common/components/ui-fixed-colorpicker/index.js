import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import ColorPickerModal from './color-picker-modal';
import { noop } from '../../util/helpers';

class UIFixedColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: props.color,
      left: 0,
      top: 0
    };

    this.changeColor = this.changeColor.bind(this);
    this.openPortal = this.openPortal.bind(this);
  }

  changeColor(color) {
    this.setState({
      color: color.hex
    });
    this.props.onChange(color.hex);
  }

  checkPosition() {
    if (this.circle) {
      const rect = this.circle.getClientRects();
      this.setState({
        left: rect[0].x + rect[0].width / 2,
        top: rect[0].y + rect[0].height + 5
      });
    }
  }

  openPortal() {
    this.checkPosition();
    setTimeout(() => {
      this.portal.openPortal();
    }, 100);
  }

  render() {
    const { color, left, top } = this.state;

    return (
      <div className="ui-fixed-color-picker">
        <div
          ref={el => {
            this.circle = el;
          }}
          className="color-circle"
          style={{ backgroundColor: color }}
          onClick={this.openPortal}
        />
        <Portal
          closeOnEsc
          ref={el => {
            this.portal = el;
          }}
        >
          <ColorPickerModal
            {...{
              color,
              left,
              top,
              onChange: this.changeColor
            }}
          />
        </Portal>
      </div>
    );
  }
}

UIFixedColorPicker.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func
};

UIFixedColorPicker.defaultProps = {
  color: '#fff',
  onChange: noop
};

export default UIFixedColorPicker;
