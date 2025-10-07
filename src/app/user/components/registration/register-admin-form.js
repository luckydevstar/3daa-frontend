// CORE
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// ADDONS
import { Field, reduxForm, initialize } from 'redux-form';
import { Link } from 'react-router';
import classNames from 'classnames';
import * as lodash from 'lodash';

// COMPONENTS
import { Text } from 'app/intl';
import common from 'app/common';
import FormUtil from '../../util/form-util';

// CONSTS
const FormField = common.components.Form.field;
const FORM_NAME = 'registerAdmin';

const {
  components: { PasswordStrength }
} = common;

class RegisterAdminForm extends Component {
  componentDidMount() {
    const { setInitialValues } = this.props;
  }

  render() {
    const {
      registerAdminForm,
      onSubmitAttempt,
      activating,
      errorCode,
      error,
      handleSubmit
    } = this.props;

    const disabled = lodash.get(registerAdminForm, 'syncErrors') && activating;

    const btnCls = classNames('button sign-up is-primary is-outlined');

    return (
      <div className="form">
        <form
          method="post"
          className="update-reset-password-form"
          onSubmit={handleSubmit(onSubmitAttempt)}
        >
          <h1 className="m-b-30">
            <Text iKey="get_started_signup_now" />
          </h1>
          <div className="shrink">
            <div className="m-b-15">
              <Field
                name="first_name"
                type="text"
                placeholder="First Name"
                component={FormField}
              />
            </div>

            <div className="m-b-15">
              <Field
                name="last_name"
                type="text"
                placeholder="Last Name"
                component={FormField}
              />
            </div>

            <div className="m-b-40">
              <Field
                name="password"
                type="password"
                placeholder="New Password"
                component={FormField}
              />
              <PasswordStrength
                password={lodash.get(registerAdminForm, 'values.password', '')}
              />
              <Field
                name="password_confirm"
                type="password"
                placeholder="Confirm New Password"
                component={FormField}
              />
            </div>
            {errorCode ? <p className="m-b-40">{errorCode}</p> : null}
            <div className="has-text-centered m-b-40">
              <button className={btnCls} type="submit" disabled={disabled}>
                <Text iKey="get_started_signup_now" />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'first_name').required();
  FormUtil.validate(values, errors, 'last_name').required();
  FormUtil.validate(values, errors, 'password')
    .passwordLength()
    .required();
  FormUtil.validate(values, errors, 'password_confirm')
    .passwordLength()
    .required();

  if (values.password !== values.password_confirm) {
    errors.password_confirm = 'Passwords must match';
  }

  return errors;
};

RegisterAdminForm.propTypes = {
  onSubmitAttempt: PropTypes.func.isRequired,
  errorCode: PropTypes.any
};

RegisterAdminForm.defaultProps = {
  // failureMessage: 'There was a problem, please try again'
};

RegisterAdminForm = reduxForm({
  form: FORM_NAME, // a unique name for this form
  validate
})(RegisterAdminForm);

const mapStateToProps = state => ({
  registerAdminForm: lodash.get(state, 'form.registerAdmin')
});

const mapDispatchToProps = dispatch => ({
  // Action to inject data into the form
  setInitialValues: data => {
    dispatch(initialize(FORM_NAME, data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterAdminForm);

// {activated ? (
//   <div>
//     <h1 className="m-b-40">Your account has been activated.</h1>
//   </div>
// ) : (
