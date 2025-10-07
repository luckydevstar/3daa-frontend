import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import common from 'app/common';
import { Field, Text } from 'app/intl';
import FormUtil from '../../../util/form-util';
import { Creators as Actions } from 'app/user/actions';

const FORM_NAME = 'registerCenter';
const FormRegisterField = common.components.Form.registerfield;

const RegisterEducatorForm = ({
  onRegisterAttempt,
  invalid,
  handleSubmit,
  submitting
}) =>
  <form onSubmit={handleSubmit(onRegisterAttempt)}>
    <h3>
      <Text iKey="sign_up_with_your_corporate" />
    </h3>
    <div className="inner">
      <Field
        type="text"
        placeholder="work_email_address"
        name="email"
        component={FormRegisterField}
      />
    </div>
    <button
      type="submit"
      disabled={invalid || submitting}
      className="button sign-up is-primary is-outlined"
    >
      <Text iKey="get_started_signup_now" />
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

RegisterEducatorForm.propTypes = {
  onRegisterAttempt: PropTypes.func.isRequired
};

const ReduxRegisterEducatorForm = reduxForm({
  form: FORM_NAME,
  validate,
  asyncValidate,
  asyncBlurFields: ['email']
})(RegisterEducatorForm);

export default ReduxRegisterEducatorForm;
