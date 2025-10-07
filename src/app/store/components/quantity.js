import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { noop } = common.util.helpers;

class Quantity extends Component {
  constructor(props) {
    super(props);

    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
  }

  increase() {
    const { quantity, onUpdate } = this.props;
    onUpdate(quantity + 1);
  }

  decrease() {
    const { quantity, onUpdate } = this.props;
    onUpdate(quantity > 1 ? quantity - 1 : 0);
  }

  render() {
    const { quantity, showLabel } = this.props;

    return (
      <div className="quantity">
        {showLabel && (
          <span className="is-primary label semibold">Quantity</span>
        )}
        <a className="left btn" onClick={this.decrease}>
          <i className="fa fa-angle-left" />
        </a>
        <span className="quantity-number opensans-semibold">{quantity}</span>
        <a className="right btn" onClick={this.increase}>
          <i className="fa fa-angle-right" />
        </a>
      </div>
    );
  }
}

Quantity.propTypes = {
  quantity: PropTypes.number,
  onUpdate: PropTypes.func,
  showLabel: PropTypes.bool
};

Quantity.defaultProps = {
  quantity: 1,
  onUpdate: noop,
  showLabel: true
};

export default Quantity;
