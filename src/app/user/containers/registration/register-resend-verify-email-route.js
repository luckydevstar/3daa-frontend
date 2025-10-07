import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import config from 'brand/config';

import common from 'app/common';
import { Field, Text } from 'app/intl';
import { Creators as Actions } from 'app/user/actions';
import FormUtil from '../../util/form-util';

const FORM_NAME = 'register-resend-email';
const FormRegisterField = common.components.Form.registerfield;

class RegisterResendVerifyEmailRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registrationFlow: config.registrationFlow
    };

    this.resendVerifyEmail = this.resendVerifyEmail.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { registerData, user } = this.props;

    if ((!registerData || !registerData.email) && !user) {
      browserHistory.push('/');
    }
  }

  resendVerifyEmail(values, someFunc, form) {
    const {
      params: { account_type },
      resendEmail,
      resendEmailOther,
      registerData
    } = this.props;
    const { registrationFlow } = this.state;
    if (form && form.valid) {
      if (registrationFlow === '2') {
        resendEmailOther(registerData);
      } else if (account_type === 'personal') {
        resendEmail(values);
      } else {
        resendEmail({
          ...values,
          is_business: 1
        });
      }
    }
  }

  render() {
    const { handleSubmit, attempting, registerData, user } = this.props;
    const { resendVerifyEmail } = this;
    const btnCls = classNames('button is-primary m-t-20 p-l-30 p-r-30', {
      'is-loading': attempting
    });
    let email = null;
    if (registerData && registerData.email) email = registerData.email;
    else if (user) {
      email = user.email;
    }

    return email ? (
      <div className="register container has-text-centered">
        <h1>
          <Text iKey="check_email" />
        </h1>
        <p className="p-t-20 p-b-20">
          <Text iKey="msg_check_email" vals={[<b>{email}</b>]} />
        </p>
        <hr />
        <h2 className="subtitle p-t-20 p-b-20 m-b-0">
          <Text iKey="not_received_email" />
        </h2>
        <p className="p-b-30">
          <Text iKey="msg_check_spam_folder" />
        </p>
        <form onSubmit={handleSubmit(resendVerifyEmail)} className="form">
          <div className="m-t-20 m-b-10">
            <div className="email-box">
              <Field
                type="text"
                placeholder="email_address"
                name="email"
                component={FormRegisterField}
              />
            </div>
          </div>
          <button type="submit" className={btnCls}>
            <Text iKey="resend_account_validation" />
          </button>
        </form>
      </div>
    ) : null;
  }
}

const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'email')
    .email()
    .required();
  return errors;
};

const RegisterResendVerifyEmailForm = reduxForm({
  form: FORM_NAME,
  validate
})(RegisterResendVerifyEmailRoute);

/**
 * Redux mappings
 */
const mapStateToProps = ({
  registration: { sendingEmail, errorCode, registerData },
  profile: { user }
}) => ({
  attempting: sendingEmail,
  errorCode,
  registerData,
  user,
  initialValues: {
    email: user && user.email,
    ...registerData
  }
});

const mapDispatchToProps = dispatch => ({
  resendEmail: user => dispatch(Actions.registerAttempt(user)),
  resendEmailOther: user => dispatch(Actions.registerOtherAttempt(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterResendVerifyEmailForm);
