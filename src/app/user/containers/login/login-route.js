import React from 'react';
import { connect } from 'react-redux';

import LoginForm from '../../components/login/login-form';
import { Creators as Actions } from 'app/user/actions';

class LoginRoute extends React.Component {
  constructor(props) {
    super(props);

    this.handleLoginAttempt = this.handleLoginAttempt.bind(this);
    this.handleFacebookResponse = this.handleFacebookResponse.bind(this);
  }

  handleLoginAttempt(values, someFunc, form) {
    if (form && form.valid) {
      this.props.attemptLogin(values);
    }
  }

  handleFacebookResponse(response) {
    if (response && response.accessToken) {
      this.props.loginWithFbAttempt(response.accessToken);
    }
  }

  render() {
    return (
      <div className="login-container">
        <section className="section">
          <div className="container">
            <LoginForm
              loginError={this.props.errorCode}
              attempting={this.props.attempting}
              onLoginAttempt={this.handleLoginAttempt}
              onFacebookResponse={this.handleFacebookResponse}
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
  attempting: state.auth.attemptingToLogin,
  errorCode: state.auth.errorCode
});

const mapDispatchToProps = dispatch => ({
  attemptLogin: user => {
    dispatch(Actions.loginAttempt(user));
  },
  loginWithFbAttempt: token => {
    dispatch(Actions.loginWithFbAttempt(token));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginRoute);
