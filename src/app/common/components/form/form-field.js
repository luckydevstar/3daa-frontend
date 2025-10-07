import React, { Component } from 'react';
import classNames from 'classnames';
import { Text } from 'app/intl';

class FormField extends Component {
  constructor(props) {
    super(props);
    this.classForInput = this.classForInput.bind(this);
    this.classForControl = this.classForControl.bind(this);
  }

  classForControl(className) {
    const {
      meta: { touched, error, asyncValidating }
    } = this.props;

    return classNames(className, {
      'has-error': touched && error,
      'is-loading': asyncValidating
    });
  }

  classForInput(className) {
    const {
      meta: { touched, error }
    } = this.props;
    return classNames(className, {
      'is-danger': touched && error,
      'is-success': touched && error === null
    });
  }

  render() {
    const {
      input,
      type,
      placeholder,
      disabled,
      className = 'control',
      inputClassName = 'input',
      inputStyle = {},
      onChange,
      onKeyUp,
      meta: { touched, error },
      value,
      readOnly
    } = this.props;
    const field = {
      type,
      disabled,
      placeholder
    };

    const events = {};

    if (onChange) {
      events.onChange = onChange;
    }

    if (onKeyUp) {
      events.onKeyUp = onKeyUp;
    }
    return (
      <p className={this.classForControl(className)}>
        <input
          className={this.classForInput(inputClassName)}
          style={inputStyle}
          {...input}
          {...field}
          {...events}
          value={value || input.value}
          readOnly={readOnly}
        />
        <span className="field-error">
          {touched && error ? <Text iKey={error} /> : null}
        </span>
      </p>
    );
  }
}

export default FormField;
