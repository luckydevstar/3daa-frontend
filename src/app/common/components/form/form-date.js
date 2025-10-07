import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { or, and, isNil, not, equals } from 'ramda';

import { Option } from 'app/intl';

class FormDate extends Component {
  constructor(props) {
    super(props);
    this.classForInput = this.classForInput.bind(this);
    this.classForControl = this.classForControl.bind(this);
    this.generateDate = this.generateDate.bind(this);

    const value = this.props.input.value;
    this.state = {
      day: moment(value).format('DD'),
      month: moment(value).format('MM'),
      year: moment(value).format('YYYY'),
      touched: this.props.meta.touched,
      error: this.props.meta.error
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      touched: nextProps.meta.touched,
      error: nextProps.meta.error
    });
  }

  classForControl(className) {
    const {
      meta: { asyncValidating }
    } = this.props;
    const { touched, error } = this.state;
    return classNames(className, {
      'has-error': touched && error,
      'is-loading': asyncValidating
    });
  }

  classForInput(className) {
    const { touched, error } = this.state;
    return classNames(className, {
      'is-danger': touched && error,
      'is-success': touched && error === null
    });
  }

  generateDate() {
    if (
      or(
        or(this.dayInput.value < 0, this.dayInput.value > 99),
        or(this.yearInput.value < 0, this.yearInput.value > 9999)
      )
    )
      return;

    this.setState({
      year: this.yearInput.value,
      month: this.monthInput.value,
      day: this.dayInput.value
    });
    const newDate = `${this.yearInput.value}-${this.monthInput.value}-${
      this.dayInput.value
    }`;
    this.props.input.onChange('');

    if (
      and(equals(this.yearInput.value, ''), equals(this.dayInput.value, ''))
    ) {
      this.setState({
        touched: true,
        error: 'Required!'
      });
      return;
    }
    if (equals(this.dayInput.value, '')) {
      return;
    }
    if (or(equals(this.yearInput.value, ''), this.yearInput.value < 1000)) {
      return;
    }
    this.props.input.onBlur();
    if (
      and(
        moment(this.props.maxDate).isBefore(newDate),
        not(isNil(this.props.maxDate))
      )
    ) {
      this.setState({
        touched: true,
        error: `Must be low than ${this.props.maxDate}!`
      });
      return;
    }
    if (
      and(
        moment(this.props.minDate).isAfter(newDate),
        not(isNil(this.props.minDate))
      )
    ) {
      this.setState({
        touched: true,
        error: `Must be large than ${this.props.minDate}!`
      });
      return;
    }

    if (moment(newDate, 'YYYY-MM-D', true).isValid()) {
      this.props.input.onChange(newDate);
      this.setState({
        touched: false,
        error: ''
      });
    } else {
      this.setState({
        touched: true,
        error: 'Please provide valid date!'
      });
    }
  }

  render() {
    const {
      input,
      disabled,
      className = 'control',
      inputClassName = 'input'
    } = this.props;
    const { year, month, day, touched, error } = this.state;
    const { generateDate } = this;

    return (
      <div className={this.classForControl(className)}>
        <div className="date-form_container">
          <span className="date-field day">
            <input
              type="Number"
              value={day !== 'Invalid date' ? day : ''}
              className={this.classForInput(inputClassName)}
              disabled={disabled}
              placeholder="DD"
              onChange={() => generateDate()}
              onBlur={() => generateDate()}
              ref={inputValue => {
                this.dayInput = inputValue;
              }}
            />
          </span>
          <span className="date-field select">
            <select
              className={this.classForInput('')}
              disabled={disabled}
              onChange={e => generateDate(e)}
              value={month !== 'Invalid date' ? month : '01'}
              ref={inputValue => {
                this.monthInput = inputValue;
              }}
            >
              <Option iKey="january" value="01" />
              <Option iKey="febuary" value="02" />
              <Option iKey="march" value="03" />
              <Option iKey="april" value="04" />
              <Option iKey="may" value="05" />
              <Option iKey="june" value="06" />
              <Option iKey="july" value="07" />
              <Option iKey="august" value="08" />
              <Option iKey="september" value="09" />
              <Option iKey="october" value="10" />
              <Option iKey="november" value="11" />
              <Option iKey="december" value="12" />
            </select>
          </span>
          <span className="date-field year">
            <input
              type="Number"
              value={year !== 'Invalid date' ? year : ''}
              className={this.classForInput(inputClassName)}
              disabled={disabled}
              placeholder="YYYY"
              onChange={() => generateDate()}
              onBlur={() => generateDate()}
              ref={inputValue => {
                this.yearInput = inputValue;
              }}
            />
          </span>
        </div>
        <span className="field-error">{touched && error ? error : null}</span>
      </div>
    );
  }
}

FormDate.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string
  })
};

FormDate.defaultProps = {
  input: {
    value: '0000-00-00'
  }
};

export default FormDate;
