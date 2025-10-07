import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { keys } from 'ramda';
import { SketchPicker } from 'react-color';
import Isvg from 'react-inlinesvg';

import UIClickablePanel from '../ui-clickable-panel';
import IconColor from 'images/icon_color.svg';

class UINavColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      panelOpen: false,
      left: 900,
      type: 'background' // background | text
    };

    this.handleResize = this.handleResize.bind(this);
    this.openPanel = this.openPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
  }

  UNSAFE_componentWillMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentDidMount() {
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    const rect = this.el.getBoundingClientRect();
    this.setState({
      left: rect.left
    });
  }

  openPanel() {
    this.handleResize();
    this.setState({
      panelOpen: true,
      type: 'background'
    });
  }

  closePanel() {
    this.setState({
      panelOpen: false
    });
  }

  clickColor(type) {
    this.setState({ type });
  }

  render() {
    const { panelOpen, left, type } = this.state;
    const { colors, labels, changable, onColorChange } = this.props;

    const colorTypes = keys(colors);

    return (
      <div
        className="ui-nav-color-picker"
        ref={el => {
          this.el = el;
        }}
      >
        <a className="icon-button" onClick={this.openPanel}>
          <Isvg src={IconColor} />
        </a>
        <UIClickablePanel
          left={left}
          open={panelOpen}
          closePanel={this.closePanel}
        >
          {colorTypes.map(t => (
            <div className="color-row" key={t}>
              <div
                className={cx('color', { selected: type === t })}
                style={{ backgroundColor: colors[t] }}
                onClick={() => this.clickColor(t)}
              />
              <span>{labels[t]}</span>
            </div>
          ))}
          {type !== '' && changable && (
            <div>
              <p>Select a colour:</p>
              <SketchPicker
                color={colors[type]}
                onChange={c => onColorChange(type, c)}
              />
            </div>
          )}
        </UIClickablePanel>
      </div>
    );
  }
}

UINavColorPicker.propTypes = {
  colors: PropTypes.object,
  labels: PropTypes.object,
  changable: PropTypes.bool,
  onColorChange: PropTypes.func.isRequired
};

UINavColorPicker.defaultProps = {
  colors: {
    background: 'white',
    text: 'black'
  },
  labels: {
    background: 'Background',
    text: 'Font'
  },
  changable: false
};

export default UINavColorPicker;
