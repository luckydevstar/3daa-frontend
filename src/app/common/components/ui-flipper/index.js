import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Text } from 'app/intl';
import Isvg from 'react-inlinesvg';

import IconFlip from 'images/icon_flip_primary.svg';

class UIFlipper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
      extraClass: ''
    };
    this.toggleFlippedState = this.toggleFlippedState.bind(this);
  }
  toggleFlippedState() {
    const { flipped } = this.state;
    const { transitionDuration } = this.props;
    this.setState({
      flipped: !flipped
    });
    // The following code sets an extra class, 'back-visible'
    // if the component has finished animating and is flipped

    // If curr state is !flipped then next will be
    if (!flipped) {
      this.timeout = setTimeout(
        () =>
          this.setState({
            extraClass: 'back-visible'
          }),
        transitionDuration
      );
    } else {
      clearTimeout(this.timeout);
      this.setState({
        extraClass: ''
      });
    }
  }
  render() {
    const { flipped, extraClass } = this.state;
    const {
      front,
      back,
      className: propClasses,
      transitionDuration
    } = this.props;
    const cx = classNames(
      'ui-component-flipper-container',
      propClasses,
      extraClass,
      { flipped }
    );
    const transitionStyle = {
      transitionDuration: `${transitionDuration}ms`,
      WebkitTransitionDuration: `${transitionDuration}ms`
    };
    return (
      <div className={cx}>
        <div className="toggle" onClick={this.toggleFlippedState}>
          <Isvg src={IconFlip} />
          <Text iKey="flip" />
        </div>
        <div className="front" style={transitionStyle}>
          {front}
        </div>
        <div className="back" style={transitionStyle}>
          {back}
        </div>
      </div>
    );
  }
}

UIFlipper.propTypes = {
  front: PropTypes.element,
  back: PropTypes.element,
  transitionDuration: PropTypes.number
};

UIFlipper.defaultProps = {
  front: <div className="no-front" />,
  back: <div className="no-back" />,
  transitionDuration: 550
};

export default UIFlipper;
