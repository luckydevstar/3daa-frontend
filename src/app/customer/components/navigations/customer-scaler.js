import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { noop } = common.util.helpers;

class CustomerScaler extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(val) {
    if (val >= 0 && val <= 100) {
      this.props.setScaleVal(val);
    }
  }

  render() {
    const { scaleVal, unit } = this.props;

    return (
      <div className="customer-scaler">
        <div className="scaler">{`${scaleVal}${unit}`}</div>
        <div className="btns">
          <span className="up" onClick={() => this.onChange(scaleVal + 1)} />
          <span className="down" onClick={() => this.onChange(scaleVal - 1)} />
        </div>
      </div>
    );
  }
}

CustomerScaler.propTypes = {
  scaleVal: PropTypes.number,
  unit: PropTypes.string,
  setScaleVal: PropTypes.func
};

CustomerScaler.defaultProps = {
  scaleVal: 100,
  unit: '%',
  setScaleVal: noop
};

export default CustomerScaler;
