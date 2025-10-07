import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as lodash from 'lodash';
import common from 'app/common';
import PaymentDetails from '../../components/registration/payment-details';
import { Creators as Actions } from '../../actions';
import config from 'brand/config';

const {
  components: { UISteps, UILoading }
} = common;
class RegisterPaymentRoute extends Component {
  constructor(props) {
    super(props);

    this.confirmPurchase = this.confirmPurchase.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { getAvailableMemberships, availableMemberships } = this.props;
    if (!lodash.get(availableMemberships, 'length')) {
      getAvailableMemberships();
    }
  }

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {}

  confirmPurchase(data) {
    const {
      payMembership,
      voucherCode,
      changeLoadingStatus,
      token
    } = this.props;

    if (data.type === 'paypal') return;

    const Stripe = window.Stripe;
    Stripe.setPublishableKey(config.STRIPE_KEY);

    const expire = data.expire.split('/');

    Stripe.card.createToken(
      {
        number: data.card_number,
        cvc: data.cvc,
        exp_month: expire[0].trim(),
        exp_year: expire[1].trim()
      },
      (status, stripeToken) => {
        if (status === 200) {
          // data['data[stripeToken]'] = stripeToken.id;
          const membershipData = {
            type: data.type,
            membership_id: data.membership_id,
            data: {
              stripeToken: stripeToken.id,
              AccountNumber: stripeToken.card.last4,
              ExpirationMonth: stripeToken.card.exp_month,
              ExpirationYear: stripeToken.card.exp_year,
              CardType: stripeToken.card.brand
            }
          };

          if (
            lodash.get(voucherCode, 'voucher_code.voucher_code') ==
            data.voucher_code
          ) {
            membershipData['voucher_code'] = data.voucher_code;
          }
          console.log(membershipData);

          payMembership(membershipData, token);
        }
      }
    );
  }

  render() {
    const {
      params: { account_type },
      user,
      gettingMemberships,
      availableMemberships
    } = this.props;

    const is_business = account_type === 'personal' ? 0 : 1;
    const filteredMemberships = lodash.filter(
      availableMemberships,
      membership => membership.is_business == is_business
    );
    const initialValues = {
      membership_id:
        lodash.get(lodash.head(filteredMemberships), 'membership_id', 1) || 1,
      type: 'cc'
    };

    return (
      <div className="register container has-text-centered">
        <UISteps
          step={3}
          count={3}
          labels={['create_account', 'provide_details', 'begin_membership']}
          padding={60}
          width="100%"
          showLabel
        />
        {gettingMemberships ? (
          <UILoading isLoadingOverlay alignMiddle />
        ) : (
          <PaymentDetails
            initialValues={initialValues}
            memberships={filteredMemberships}
            onConfirmPurchase={this.confirmPurchase}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: lodash.get(state, 'persisted.token'),
  user: lodash.get(state, 'profile.user'),
  gettingMemberships: lodash.get(state, 'registration.gettingMemberships'),
  availableMemberships: lodash.get(state, 'registration.availableMemberships'),
  voucherCode: lodash.get(state, 'registration.voucherCode')
});

const mapDispatchToProps = dispatch => ({
  getAvailableMemberships: () =>
    dispatch(Actions.getAvailableMembershipsAttempt()),
  membershipVoucherCheck: data =>
    dispatch(Actions.membershipVoucherCheckAttempt(data)),
  payMembership: (data, token) =>
    dispatch(Actions.payMembershipAttempt(data, token))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPaymentRoute);
