import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';

import common from 'app/common';

const FormField = common.components.Form.field;

import FormUtil from '../../util/form-util';

const FORM_NAME = 'forgottenPasswordForm';

class ForgottenPasswordForm extends Component {
  render() {
    const { onSubmitAttempt, attempting, success, failure } = this.props;
    const { handleSubmit } = this.props;

    const btnCls = classNames('button is-primary is-medium', {
      'is-loading': attempting,
      'is-outlined': !attempting
    });

    return (
      <div className="form">
        {success ? (
          <div>
            <h1 className="m-b-40">An email has been sent</h1>
            <p className="m-b-40">please check your inbox</p>
          </div>
        ) : (
          <form
            method="post"
            className="password-reset-form"
            onSubmit={handleSubmit(onSubmitAttempt)}
          >
            <h1 className="m-b-40">Forgotten Password</h1>
            <div className="shrink">
              <div className="m-b-40">
                <Field
                  name="email"
                  type="email"
                  placeholder="Email address"
                  component={FormField}
                />
              </div>
              {failure ? (
                <p className="m-b-40">There was a problem - please try again</p>
              ) : null}
              <div className="has-text-centered m-b-40">
                <button
                  className={btnCls}
                  type="submit"
                  disabled={attempting && !failure}
                >
                  Send Reset Email
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}

const validate = values => {
  const errors = {};

  FormUtil.validate(values, errors, 'email')
    .email()
    .required();

  return errors;
};

ForgottenPasswordForm.propTypes = {
  onSubmitAttempt: PropTypes.func.isRequired,
  attempting: PropTypes.bool,
  success: PropTypes.bool,
  failure: PropTypes.bool
};

ForgottenPasswordForm = reduxForm({
  form: FORM_NAME,
  validate
})(ForgottenPasswordForm);

export default ForgottenPasswordForm;
