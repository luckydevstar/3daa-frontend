import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { noop } from '../../util/helpers';

class UIColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPicker: false
    };

    this.changeColor = this.changeColor.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  changeColor(color) {
    this.props.setPickVal(color.hex);
  }

  handleClick() {
    if (this.props.disabled) return;

    if (!this.state.isPicker) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      isPicker: !prevState.isPicker
    }));
  }

  handleOutsideClick(e) {
    if (!this.picker.contains(e.target)) {
      this.handleClick();
    }
  }

  render() {
    const { color, width, height } = this.props;
    const { isPicker } = this.state;

    return (
      <div className="ui-color-picker">
        <div
          className="viewer"
          style={{ backgroundColor: color, width, height }}
          onClick={() => this.handleClick()}
        >
          {color === '' && (
            <div className="in">
              <i className="fa fa-plus" />
            </div>
          )}
        </div>
        {isPicker && (
          <div
            className="picker"
            ref={node => {
              this.picker = node;
            }}
          >
            <SketchPicker color={color} onChangeComplete={this.changeColor} />
          </div>
        )}
      </div>
    );
  }
}

UIColorPicker.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  setPickVal: PropTypes.func,
  disabled: PropTypes.bool
};

UIColorPicker.defaultProps = {
  color: '',
  width: 90,
  height: 90,
  setPickVal: noop,
  disabled: false
};

export default UIColorPicker;
