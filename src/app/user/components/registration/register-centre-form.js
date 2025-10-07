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
const FORM_NAME = 'registerCenter';

const {
  components: { PasswordStrength }
} = common;

class RegisterCentreForm extends Component {
  componentDidMount() {
    const { setInitialValues } = this.props;
  }

  render() {
    const {
      registerCenterForm,
      onSubmitAttempt,
      activating,
      errorCode,
      error,
      handleSubmit
    } = this.props;

    const btnCls = classNames('button sign-up is-primary is-outlined');

    return (
      <div className="form">
        <form
          method="post"
          className="update-reset-password-form"
          onSubmit={handleSubmit(onSubmitAttempt)}
        >
          <h1 className="m-b-30">
            <Text iKey="create_password" />
          </h1>
          <div className="shrink">
            <div className="m-b-40">
              <Field
                name="password"
                type="password"
                placeholder="New Password"
                component={FormField}
              />
              <PasswordStrength
                password={lodash.get(registerCenterForm, 'values.password', '')}
              />
              <Field
                name="confirm_password"
                type="password"
                placeholder="Confirm New Password"
                component={FormField}
              />
            </div>
            {errorCode ? <p className="m-b-40">{errorCode}</p> : null}
            <div className="has-text-centered m-b-40">
              <button
                className={btnCls}
                type="submit"
                disabled={activating && !errorCode}
              >
                <Text iKey="assign_to_account" />
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

  FormUtil.validate(values, errors, 'password')
    .passwordLength()
    .required();
  FormUtil.validate(values, errors, 'confirm_password')
    .passwordLength()
    .required();

  if (values.password !== values.confirm_password) {
    errors.confirm_password = 'Passwords must match';
  }

  return errors;
};

RegisterCentreForm.propTypes = {
  onSubmitAttempt: PropTypes.func.isRequired,
  errorCode: PropTypes.string
};

RegisterCentreForm.defaultProps = {
  failureMessage: 'There was a problem, please try again'
};

RegisterCentreForm = reduxForm({
  form: FORM_NAME, // a unique name for this form
  validate
})(RegisterCentreForm);

const mapStateToProps = state => ({
  registerCenterForm: lodash.get(state, 'form.registerCenter')
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
)(RegisterCentreForm);
