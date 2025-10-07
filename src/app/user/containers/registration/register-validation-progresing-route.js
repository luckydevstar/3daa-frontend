import React, { Component } from 'react';
import common from 'app/common';
import { connect } from 'react-redux';
import { Text } from 'app/intl';
import { Creators as Actions } from '../../actions';
import { Link } from 'react-router';
import { path } from 'ramda';
import cx from 'classnames';
import config from 'brand/config';

const UILoading = common.components.UILoading;

class RegisterValidationProgresingRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registrationFlow: config.registrationFlow
    };
  }
  componentDidMount() {
    const {
      user,
      params,
      verifyInvitationEmailAttempt,
      verifyOtherEmailAttempt,
      verifyTutorInvitationEmail,
      verifyLearnerInvitationEmail
    } = this.props;
    const { registrationFlow } = this.state;
    const { account_type, verification_key } = params;
    const email = path(['email'], user);
    const isLearner = account_type === 'learner';
    console.log(verification_key !== 'key');
    // if (
    //   isLearner &&
    //   verification_key === 'key' &&
    //   email &&
    //   registrationFlow === '2'
    // ) {
    //   resendVerificationEmail(email);
    // }
    if (isLearner && verification_key !== 'key' && registrationFlow === '2') {
      verifyLearnerInvitationEmail(verification_key);
    } else if (verification_key !== 'key') {
      verifyInvitationEmailAttempt(verification_key, account_type);
    }
    // if(registrationFlow === '2' && account_type === 'learner') {
    //   verifyLearnerInvitationEmail(verification_key);
    // }
    // else if (registrationFlow === '2' && params.account_type !== 'centre') {
    //   // verifyOtherEmailAttempt({
    //   //   verification_key: params.verification_key
    //   // });
    //   verifyInvitationEmailAttempt(
    //     params.verification_key,
    //     params.account_type
    //   );
    // } else {
    //   verifyInvitationEmailAttempt(
    //     params.verification_key,
    //     params.account_type
    //   );
    // }
  }

  renderBody = () => {
    const {
      errorCode,
      verifyingEmail,
      user,
      emailResendAttempt,
      resendVerificationEmail
    } = this.props;
    const email = path(['email'], user);
    if (!errorCode && verifyingEmail) {
      return (
        <div>
          <UILoading />
          <p>Validating</p>
        </div>
      );
    } else if (errorCode) {
      return (
        <p>
          Verification key is invalid or Email must be verified already, Please,
          try to sign in with your email and password.
        </p>
      );
    } else {
      return (
        <div>
          <h2 className="m-b-30">
            We've sent an email to verify your address.
          </h2>
          {email && (
            <button
              className={cx('button is-primary', {
                'is-loading': emailResendAttempt
              })}
              onClick={() => {
                resendVerificationEmail(email);
              }}
            >
              Resend
            </button>
          )}
          {/* <Link to="/dashboard">
            <button className="button is-primary">Go to Dashboard</button>
          </Link> */}
        </div>
      );
    }
  };

  render() {
    const { registrationFlow } = this.state;

    return (
      <div className="register validation-progress has-text-centered">
        <h1>
          {registrationFlow !== '2' && <Text iKey="email_address_validation" />}
          {registrationFlow === '2' && 'Email address verification'}
        </h1>
        {this.renderBody()}
      </div>
    );
  }
}

const mapStateToProps = ({ registration, profile }) => ({
  errorCode: registration.errorCode,
  emailResendAttempt: registration.emailResendAttempt,
  verifyingEmail: registration.verifyingEmail,
  user: path(['user'], profile)
});

const mapDispatchToProps = dispatch => ({
  verifyInvitationEmailAttempt: (verification_key, account_type) =>
    dispatch(
      Actions.verifyInvitationEmailAttempt(verification_key, account_type)
    ),

  verifyOtherEmailAttempt: params =>
    dispatch(Actions.verifyOtherEmailAttempt(params)),
  verifyTutorInvitationEmail: verification_key =>
    dispatch(Actions.verifyTutorInvitationEmailAttempt(verification_key)),
  verifyLearnerInvitationEmail: verification_key =>
    dispatch(Actions.verifyLearnerInvitationEmailAttempt(verification_key)),
  resendVerificationEmail: email =>
    dispatch(Actions.resendVerificationEmailAttempt(email))
  // verifyEmail: (verification_key, account_type) =>
  //   dispatch(Actions.verifyEmailAttempt(verification_key, account_type)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterValidationProgresingRoute);
