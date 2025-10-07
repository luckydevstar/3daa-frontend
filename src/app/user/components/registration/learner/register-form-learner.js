import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import common from 'app/common';
import { Field, Text } from 'app/intl';
import { Creators as Actions } from 'app/user/actions';
import FormUtil from '../../../util/form-util';

const FORM_NAME = 'register-email';
const FormRegisterField = common.components.Form.registerfield;

const RegisterLearnerForm = ({
  onRegisterAttempt,
  invalid,
  handleSubmit,
  submitting
}) =>
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
    </div>
    <button
      type="submit"
      disabled={invalid || submitting}
      className="button sign-up is-primary is-outlined"
    >
      <Text iKey="sign_up" />
    </button>
  </form>;

const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'email').email().required();
  return errors;
};

const asyncValidate = (values, dispatch) =>
  new Promise((resolve, reject) => {
    const payload = {
      email: values.email
    };
    const formPromise = {
      resolve,
      reject
    };
    setTimeout(() =>
      dispatch(Actions.validateEmailAttempt(payload, formPromise))
    );
  });

RegisterLearnerForm.propTypes = {
  onRegisterAttempt: PropTypes.func.isRequired
};

const ReduxRegisterLearnerForm = reduxForm({
  form: FORM_NAME,
  validate,
  asyncValidate,
  asyncBlurFields: ['email']
})(RegisterLearnerForm);

export default ReduxRegisterLearnerForm;
