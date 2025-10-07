// CORE
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// ADDONS
import { Field, reduxForm, initialize } from 'redux-form';
import { Link } from 'react-router';
import classNames from 'classnames';

// COMPONENTS
import common from 'app/common';
import FormUtil from '../../util/form-util';

// CONSTS
const FormField = common.components.Form.field;
const FORM_NAME = 'resetPasswordForm';

class ResetPasswordForm extends Component {
  componentDidMount() {
    const { setInitialValues, resetCode } = this.props;

    setInitialValues({
      reset_code: resetCode
    });
  }

  render() {
    const {
      onSubmitAttempt,
      attempting,
      success,
      failure,
      failureMessage
    } = this.props;
    const { error, handleSubmit } = this.props;

    const btnCls = classNames('button is-primary is-medium', {
      'is-loading': attempting,
      'is-outlined': !attempting
    });

    return (
      <div className="form">
        {success ? (
          <div>
            <h1 className="m-b-40">Your passord has been reset</h1>
            <Link to={'/login'} className={btnCls}>
              Sign in
            </Link>
          </div>
        ) : (
          <form
            method="post"
            className="update-reset-password-form"
            onSubmit={handleSubmit(onSubmitAttempt)}
          >
            <h1 className="m-b-40">Reset Password</h1>
            <div className="shrink">
              <div className="m-b-40">
                <Field
                  name="password"
                  type="password"
                  placeholder="New Password"
                  component={FormField}
                />
                <Field
                  name="password_confirm"
                  type="password"
                  placeholder="Confirm New Password"
                  component={FormField}
                />
                <Field
                  name="reset_code"
                  type="hidden"
                  placeholder="Reset code"
                  component={FormField}
                />
              </div>
              {failure ? <p className="m-b-40">{failureMessage}</p> : null}
              <div className="has-text-centered m-b-40">
                <button
                  className={btnCls}
                  type="submit"
                  disabled={attempting && !failure}
                >
                  Update password
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

  FormUtil.validate(values, errors, 'password')
    .passwordLength()
    .required();
  FormUtil.validate(values, errors, 'password_confirm')
    .passwordLength()
    .required();

  if (values.password !== values.password_confirm) {
    errors.password_confirm = 'Passwords must match';
  }

  FormUtil.validate(values, errors, 'reset_code').required(
    'A reset code is required, please check your email'
  );

  return errors;
};

ResetPasswordForm.propTypes = {
  onSubmitAttempt: PropTypes.func.isRequired,
  attempting: PropTypes.bool,
  success: PropTypes.bool,
  failure: PropTypes.bool,
  failureMessage: PropTypes.string
};

ResetPasswordForm.defaultProps = {
  failureMessage: 'There was a problem, please try again'
};

ResetPasswordForm = reduxForm({
  form: FORM_NAME, // a unique name for this form
  validate
})(ResetPasswordForm);

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  // Action to inject data into the form
  setInitialValues: data => {
    dispatch(initialize(FORM_NAME, data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordForm);
