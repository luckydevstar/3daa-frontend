import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import classNames from 'classnames';
import config from 'brand/config';

import common from 'app/common';
import { Field, Text } from 'app/intl';

const FormField = common.components.Form.field;

import SocialAuthentication from './social-authentication';

import FormUtil from '../../util/form-util';

const LoginForm = ({
  onLoginAttempt,
  onFacebookResponse,
  attempting,
  handleSubmit
}) => {
  const btnCls = classNames('button is-primary is-outlined is-medium', {
    'is-loading': attempting
  });

  return (
    <div className="form">
      <form
        method="post"
        className="login-form"
        onSubmit={handleSubmit(onLoginAttempt)}
      >
        <h1 className="m-b-40">
          <Text iKey="sign_in" />
        </h1>
        <div className="shrink">
          <div className="m-b-40">
            <Field
              name="email"
              type="email"
              placeholder="email_address"
              component={FormField}
            />
            <Field
              name="password"
              type="password"
              placeholder="password"
              component={FormField}
            />
            <Link to={'/password/forgotten'} className="align-left">
              <Text iKey="forgotten_password" />
            </Link>
          </div>
          <div className="has-text-centered m-b-40">
            <button className={btnCls} type="submit">
              <Text iKey="sign_in" />
            </button>
            {/* <Field name="rememberMe" type="checkbox" label="Remember me" component={FormCheckbox} /> */}
          </div>

          {config.uiIsSocialLogin && (
            <div className="or">
              <span>
                <Text iKey="or" />
              </span>
            </div>
          )}
        </div>

        {config.uiIsSocialLogin && (
          <div className="control">
            <SocialAuthentication
              onFacebookResponse={onFacebookResponse}
              mode="signin"
            />
          </div>
        )}

        <p>
          <Text
            iKey="by_clicking_on_sign_in_you_agree"
            vals={['title']}
            translateValue
          />{' '}
          <Link to="/terms-and-use">
            <Text iKey="terms_and_conditions" />
          </Link>
          {', '}
          <a
            href="https://www.skillsandeducationgroup.co.uk/protecting-your-privacy/"
            target="_blank"
          >
            <Text iKey="privacy_policy" />
          </a>{' '}
          {/* <Text iKey="and" />{' '}
          <Link to="/cookie">
            <Text iKey="cookie_policy" />
          </Link> */}
        </p>
      </form>
    </div>
  );
};

const validate = values => {
  const errors = {};

  FormUtil.validate(values, errors, 'password').required();
  FormUtil.validate(values, errors, 'email')
    .email()
    .required();

  return errors;
};

LoginForm.propTypes = {
  onLoginAttempt: PropTypes.func.isRequired,
  onFacebookResponse: PropTypes.func.isRequired
};

const ReduxLoginForm = reduxForm({
  form: 'login', // a unique name for this form
  validate
})(LoginForm);

export default ReduxLoginForm;
