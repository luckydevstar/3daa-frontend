import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { omit } from 'ramda';

class FormFile extends Component {
  constructor(props) {
    super(props);
    this.classForInput = this.classForInput.bind(this);
    this.classForControl = this.classForControl.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.props.onChange(this.inputRef.files);
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

  classForControl(className) {
    const {
      meta: { touched, error, asyncValidating }
    } = this.props;

    return classNames(className, {
      'has-error': touched && error,
      'is-loading': asyncValidating
    });
  }

  render() {
    const {
      input,
      type,
      accept,
      placeholder,
      disabled,
      className = 'control',
      inputClassName = 'input',
      meta: { touched, error }
    } = this.props;

    return (
      <p className={this.classForControl(className)}>
        <input
          ref={el => {
            this.inputRef = el;
          }}
          className={this.classForInput(inputClassName)}
          onChange={this.onChange}
          type={type}
          accept={accept}
          disabled={disabled}
          placeholder={placeholder}
          {...omit('value', input)}
          value={undefined}
        />
        <span className="field-error">{touched && error ? error : null}</span>
      </p>
    );
  }
}

FormFile.propTypes = {
  onChange: PropTypes.func
};

FormFile.defaultProps = {
  onChange: () => true
};

export default FormFile;
