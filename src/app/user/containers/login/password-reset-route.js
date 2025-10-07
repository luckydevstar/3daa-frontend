import React from 'react';
import { connect } from 'react-redux';

import ResetPasswordForm from '../../components/password/reset-password-form';
import { Creators as Actions } from 'app/user/actions';

class PasswordResetRoute extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmitAttempt = this.handleSubmitAttempt.bind(this);
  }

  handleSubmitAttempt(values, someFunc, form) {
    if (form && form.valid) {
      this.props.attemptUpdateResetPassword(values);
    }
  }

  render() {
    const { attempting, success, failure, failureMessage } = this.props;

    return (
      <div className="login-container">
        <section className="section">
          <div className="container">
            <ResetPasswordForm
              onSubmitAttempt={this.handleSubmitAttempt}
              attempting={attempting}
              success={success}
              failure={failure}
              failureMessage={failureMessage}
              resetCode={this.props.params.reset_code || ''}
            />
          </div>
        </section>
      </div>
    );
  }
}

/**
 * Redux mappings
 */
const mapStateToProps = state => ({
  attempting: state.password.attemptingUpdateResetPassword,
  success: state.password.updateResetPasswordSuccess,
  failure: state.password.updateResetPasswordFailure,
  failureMessage: state.password.updateResetPasswordErrorMessage
});

const mapDispatchToProps = dispatch => ({
  attemptUpdateResetPassword: values => {
    dispatch(Actions.updateResetPasswordAttempt(values));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetRoute);
