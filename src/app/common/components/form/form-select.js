import React from 'react';
import cx from 'classnames';
import { noop } from 'app/common/util/helpers';

const FormSelect = ({
  input,
  children,
  disabled,
  innerClassName = '',
  className = '',
  onChange = noop,
  loading = false,
  meta: { touched, error }
}) => (
  <p
    className={cx(className, {
      'has-error': touched && error,
      'is-loading': loading
    })}
  >
    <span className="select" onChange={onChange}>
      <select
        className={cx(innerClassName, {
          'is-danger': touched && error
        })}
        {...input}
        disabled={disabled}
      >
        {children}
      </select>
    </span>
    <span className="field-error">{touched && error ? error : null}</span>
  </p>
);

export default FormSelect;
