import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import common from 'app/common';
import { Field, Text } from 'app/intl';
import { Creators as Actions } from 'app/user/actions';
import FormUtil from '../../../util/form-util';

const FORM_NAME = 'registration-other';
const FormRegisterField = common.components.Form.registerfield;

const RegisterFormOther = ({
  onRegisterAttempt,
  invalid,
  handleSubmit,
  submitting
}) => (
  <form onSubmit={handleSubmit(onRegisterAttempt)}>
    <h3>
      <Text iKey="sign_up_with_email" />
    </h3>
    <div className="inner">
      <Field
        type="text"
        placeholder="email_address"
        name="email"
        component={FormRegisterField}
      />
      <Field
        type="text"
        placeholder="confirm_email_address"
        name="confirm_email"
        component={FormRegisterField}
      />
      <div className="columns">
        <div className="column">
          <Field
            type="password"
            placeholder="password"
            name="password"
            component={FormRegisterField}
          />
        </div>
        <div className="column">
          <Field
            type="password"
            placeholder="Confirm Password"
            name="confirm_password"
            component={FormRegisterField}
          />
        </div>
      </div>
    </div>
    <button
      type="submit"
      disabled={invalid || submitting}
      className="button sign-up is-primary is-outlined"
    >
      <Text iKey="sign_up" />
    </button>
  </form>
);

const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'email')
    .email()
    .required();
  FormUtil.validate(values, errors, 'password')
    .passwordLength()
    .required();
  FormUtil.validate(values, errors, 'confirm_password')
    .passwordLength()
    .required();
  if (values.password !== values.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }
  if (values.email !== values.confirm_email) {
    errors.confirm_email = 'Email addresses do not match';
  }
  return errors;
};

const asyncValidate = (values, dispatch) =>
  new Promise((resolve, reject) => {
    const payload = {
      email: values.email,
      password: values.password
    };
    const formPromise = {
      resolve,
      reject
    };
    setTimeout(() =>
      dispatch(Actions.validateEmailAttempt(payload, formPromise))
    );
  });

RegisterFormOther.propTypes = {
  onRegisterAttempt: PropTypes.func.isRequired
};

const ReduxRegisterFormOther = reduxForm({
  form: FORM_NAME,
  validate,
  asyncValidate,
  asyncBlurFields: ['email']
})(RegisterFormOther);

export default ReduxRegisterFormOther;
