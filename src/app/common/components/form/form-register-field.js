import React, { Component } from 'react';
import classNames from 'classnames';
import { Text } from 'app/intl';
import Isvg from 'react-inlinesvg';

import IconPaypal from 'images/icon-paypal.svg';
import IconDirectDebit from 'images/icon-direct-debit.svg';
import IconSpecCard from 'images/icon-spec-card.svg';

const PaymentMethod = ({ method }) => (
  <div className="special-icon">
    <span className="icons">
      {method === 'cc' && <Isvg src={IconSpecCard} />}
      {method === 'debit' && <Isvg src={IconDirectDebit} />}
      {method === 'paypal' && <Isvg src={IconPaypal} />}
    </span>
  </div>
);

class FormRegisterField extends Component {
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
      method = null,
      onChange,
      onKeyUp,
      meta: { touched, error }
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
      <div className={this.classForControl(className)}>
        <div className="register-input">
          <input
            className={this.classForInput(inputClassName)}
            {...input}
            {...field}
            {...events}
          />
          {method ? <PaymentMethod method={method} /> : ''}
        </div>
        <div className="field-error">
          {touched && error ? <Text iKey={error} /> : null}
        </div>
      </div>
    );
  }
}

export default FormRegisterField;
