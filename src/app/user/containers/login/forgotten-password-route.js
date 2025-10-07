import React from 'react';
import { connect } from 'react-redux';

import ForgottenPasswordForm from '../../components/password/forgotten-password-form';
import { Creators as Actions } from 'app/user/actions';

class ForgottenPasswordRoute extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmitAttempt = this.handleSubmitAttempt.bind(this);
  }

  handleSubmitAttempt(values, someFunc, form) {
    if (form && form.valid) {
      this.props.attemptPasswordReset(values);
    }
  }

  render() {
    return (
      <div className="login-container">
        <section className="section">
          <div className="container">
            <ForgottenPasswordForm
              attempting={this.props.attempting}
              success={this.props.success}
              failure={this.props.failure}
              onSubmitAttempt={this.handleSubmitAttempt}
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
  attempting: state.password.attemptingPasswordReset,
  success: state.password.passwordResetSuccess,
  failure: state.password.passwordResetFailure
});

const mapDispatchToProps = dispatch => ({
  attemptPasswordReset: email => {
    dispatch(Actions.passwordResetAttempt(email));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgottenPasswordRoute);
