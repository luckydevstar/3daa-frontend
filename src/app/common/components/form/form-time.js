import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatN2 } from '../../util/helpers';

class FormTime extends Component {
  constructor(props) {
    super(props);

    const values = props.input.value.split(':');
    this.state = {
      hour: values[0] ? values[0] : '00',
      minute: values[1] ? values[1] : '00'
    };

    this.changeHour = this.changeHour.bind(this);
    this.changeMinute = this.changeMinute.bind(this);
  }

  changeHour(ev) {
    this.setState({
      hour: ev.target.value
    });
    this.updateInputValue();
  }

  changeMinute(ev) {
    this.setState({
      minute: ev.target.value
    });
    this.updateInputValue();
  }

  updateInputValue() {
    const { hour, minute } = this.state;

    this.props.input.onChange(`${formatN2(hour)}:${formatN2(minute)}`);
  }

  render() {
    const { hour, minute } = this.state;

    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(
        <option key={i}>
          {formatN2(i)}
        </option>
      );
    }

    const minutes = [];
    for (let i = 0; i < 12; i++) {
      minutes.push(
        <option key={i}>
          {formatN2(i * 5)}
        </option>
      );
    }

    return (
      <div className="control form-time">
        <span className="select">
          <select value={hour} onChange={this.changeHour}>
            {hours}
          </select>
        </span>
        <span className="select">
          <select value={minute} onChange={this.changeMinute}>
            {minutes}
          </select>
        </span>
      </div>
    );
  }
}

FormTime.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string
  })
};

FormTime.defaultProps = {
  input: {
    value: '00:00'
  }
};

export default FormTime;
