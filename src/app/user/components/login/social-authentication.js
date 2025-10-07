import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import TwitterLogin from 'react-twitter-auth';
import { Creators as Actions } from 'app/user/actions';
import common from 'app/common';
import { Text } from 'app/intl';

const noop = common.util.helpers.noop;

const MODE = {
  SIGNIN: 'signin',
  SIGNUP: 'signup'
};

const SocialAuthentication = ({
  onGoogleResponse,
  onFacebookResponse,
  onTwitterResponse,
  mode
}) => {
  let textFbButton;
  let textGgButton;
  let textTwButton;

  if (mode === MODE.SIGNIN) {
    textFbButton = <Text iKey="sign_in_with_facebook" />;
    textGgButton = 'Sign in with Google';
    textTwButton = 'Sign in with Twitter';
  } else {
    textFbButton = <Text iKey="sign_up_with_facebook" />;
    textGgButton = 'Sign up with Google';
    textTwButton = 'Sign up with Twitter';
  }

  return (
    <div className="social-login">
      <div className="columns">
        <div className="column">
          <GoogleLogin
            clientId="670568423543-i5i3o4i16a94kpvs3kg6a8qj8okkoh3k.apps.googleusercontent.com"
            buttonText={textGgButton}
            className="google"
            onSuccess={onGoogleResponse}
            onFailure={onGoogleResponse}
          />
        </div>
        <div className="column">
          <TwitterLogin
            text={textTwButton}
            loginUrl="http://localhost:4000/api/v1/auth/twitter"
            className="twitter"
            onFailure={onTwitterResponse}
            onSuccess={onTwitterResponse}
            requestTokenUrl="http://localhost:4000/api/v1/auth/twitter/reverse"
          />
        </div>
        <div className="column">
          <FacebookLogin
            appId="733745163448945"
            autoLoad={false}
            fields="name,email,picture"
            scope="public_profile,email,user_birthday"
            cssClass="facebook"
            textButton={textFbButton}
            callback={onFacebookResponse}
          />
        </div>
      </div>
    </div>
  );
};

SocialAuthentication.propTypes = {
  onFacebookResponse: PropTypes.func,
  onGoogleResponse: PropTypes.func,
  onTwitterResponse: PropTypes.func,
  mode: PropTypes.string
};

SocialAuthentication.defaultProps = {
  onFacebookResponse: noop,
  onGoogleResponse: noop,
  onTwitterResponse: noop,
  mode: MODE.SIGNIN
};

const mapDispatchToProps = dispatch => ({
  onFacebookResponse: response => {
    if (response && response.accessToken) {
      dispatch(Actions.loginWithFbAttempt(response.accessToken));
    } else {
      console.log(response);
    }
  },
  onGoogleResponse: response => {
    if (response && response.accessToken) {
      dispatch(Actions.loginWithGoogleAttempt(response.accessToken));
    } else {
      console.log(response);
    }
  },
  onTwitterResponse: response => {
    console.log(response);
  }
});

export default connect(null, mapDispatchToProps)(SocialAuthentication);
