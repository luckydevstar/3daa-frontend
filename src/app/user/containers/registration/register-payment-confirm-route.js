import React, { Component } from 'react';
import { connect } from 'react-redux';
import Isvg from 'react-inlinesvg';
import { browserHistory } from 'react-router';
import MobileDetect from 'mobile-detect';
import * as lodash from 'lodash';

import config from 'brand/config';
import { Text } from 'app/intl';
import { Creators as UserActions } from 'app/user/actions';

// import IconLogoCircle from 'images/icon-logo-circle.svg';
import IconLogo from 'brand/images/logo.svg';

class RegisterPaymentConfirmRoute extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      paymentConfirmed,
      params: { account_type },
      user
    } = this.props;

    let route = '/profile';
    let buttonKey = 'go_to_personal_profile';

    if (account_type != 'personal') {
      if (!lodash.get(user, ['centres', '0', 'centre_name'])) {
        route = '/register/business/create/business-profile';
        buttonKey = 'complete_business_profile';
      } else {
        buttonKey = 'go_to_business_profile';
      }
    }

    return (
      <div className="register container has-text-centered">
        <div className="payment-confirm">
          <h1>
            <Text iKey="payment_confirmation" />
          </h1>
          <div className="m-t-20">
            <Isvg src={IconLogo} />
          </div>
          <p>
            Congratulations, your payment was successful and your membership to
            the SLTA has begun. Please go to your Dashboard to start your
            learning.
          </p>
          {!new MobileDetect(window.navigator.userAgent).mobile() ? (
            <button
              className="button is-primary m-t-30"
              onClick={() => {
                paymentConfirmed();
                browserHistory.push(route);
              }}
            >
              <Text iKey={buttonKey} />
            </button>
          ) : (
            <div className="app-stores">
              <p>
                <Text iKey="download_learner_application" />
              </p>
              <div className="align-left">
                <div className="google" />
                <div className="apple" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ profile }) => ({
  user: lodash.get(profile, 'user')
});

const mapDispatchToProps = dispatch => ({
  paymentConfirmed: () =>
    dispatch(
      UserActions.updateLocalUser({
        showPaymentConfirmed: false
      })
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPaymentConfirmRoute);
