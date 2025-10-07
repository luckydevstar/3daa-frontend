import React, { Component } from 'react';
import classNames from 'classnames';

class TextareaField extends Component {
  constructor(props) {
    super(props);
    this.classForField = this.classForField.bind(this);
    this.classForControl = this.classForControl.bind(this);
  }

  classForControl(className) {
    const { meta: { touched, error, asyncValidating } } = this.props;

    return classNames(className, {
      'has-error': touched && error,
      'is-loading': asyncValidating
    });
  }

  classForField(className) {
    const { meta: { touched, error } } = this.props;
    return classNames(className, {
      'is-danger': touched && error,
      'is-success': touched && error === null
    });
  }

  render() {
    const {
      input,
      placeholder,
      disabled,
      className = 'control',
      fieldClassName = 'textarea',
      onChange,
      onKeyUp,
      meta: { touched, error }
    } = this.props;

    const field = {
      disabled
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
        <textarea
          placeholder={placeholder}
          className={this.classForField(fieldClassName)}
          {...input}
          {...field}
          {...events}
        />
        <span className="field-error">{touched && error ? error : null}</span>
      </p>
    );
  }
}

export default TextareaField;
