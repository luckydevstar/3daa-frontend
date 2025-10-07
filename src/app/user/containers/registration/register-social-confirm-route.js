import React from 'react';
import { connect } from 'react-redux';
import { Creators as Actions } from 'app/user/actions';
import config from 'brand/config';

class RegisterSocialConfirmRoute extends React.Component {
  constructor(props) {
    super(props);
    this.handleContinue = this.handleContinue.bind(this);
  }

  handleContinue() {
    const { token } = this.props;
    this.props.handleContinue(token);
  }

  render() {
    let provider;
    const { user } = this.props;
    // TODO Make this dynamic
    if (user && user.social_providers && user.social_providers[0]) {
      provider = user.social_providers[0];
      provider = provider.charAt(0).toUpperCase() + provider.slice(1);
    } else {
      // Backup, this shouldnt ever be shown
      provider = 'Social';
    }

    return (
      <div className="page-basic register-social-confirm-route has-text-centered">
        <div className="container-smaller">
          <h1>{provider} account connected</h1>
          <p className="p-t-25">
            In future, you can sign in to {config.fulTitle} easily using the{' '}
            {this.props.vendor}button on our sign in page.
          </p>
          <p className="p-t-25">
            If you ever want to disconnect your {provider} account, go to My
            Profile under your profile menu.
          </p>
          <button className="button is-success" onClick={this.handleContinue}>
            Continue
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.profile && state.profile.user,
    token: state.persisted.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleContinue(token) {
      dispatch(Actions.loginSuccess({ token }));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterSocialConfirmRoute);
