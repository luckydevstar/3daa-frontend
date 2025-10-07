import React, { Component } from 'react';
import Isvg from 'react-inlinesvg';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as lodash from 'lodash';
import { IntercomAPI } from 'react-intercom';

import config from 'brand/config';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { translate } from 'app/intl';

import { Creators as Actions } from '../actions';
import components from '../components';
import { Terms, Privacy } from '../../info/components';
import { getCartDetails, getTotalAmount } from '../utils';

import IconMessage from 'images/icon_message.svg';

const { StoreHeader, StoreStepbar } = components;

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin,
  Member
} = Roles;

const {
  components: {
    UIStripeCard,
    UICheckbox,
    Footer,
    ContentModal,
    ContentModalConfirm
  },
  util: {
    helpers: { extractUserRole },
    notify: { notifySuccess, notifyError }
  }
} = common;

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: ['Select Course', 'Assign Licence', 'Summary', 'Checkout'],
      active: 3,
      userRole: null
    };

    this.openIntercom = this.openIntercom.bind(this);
    this.openTermsModal = this.openTermsModal.bind(this);
    this.openPrivacyModal = this.openPrivacyModal.bind(this);
    this.onPurchase = this.onPurchase.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { user, selectedCentreMembers, cart } = this.props;

    const centreRoles = [CentreTutor, CentreAdmin];
    const role = extractUserRole(user);
    const assignView =
      centreRoles.indexOf(role) >= 0 &&
      lodash.get(selectedCentreMembers, 'length', 0) > 0;

    this.setState({
      steps: assignView
        ? ['Select Course', 'Assign Licence', 'Summary', 'Checkout']
        : ['Select Course', 'Summary', 'Checkout'],
      active: assignView ? 3 : 2
    });
  }

  openIntercom() {
    IntercomAPI('showNewMessage', 'Hi');
  }

  openTermsModal() {
    setTimeout(() => {
      this.termsViewModal.open();
    }, 100);
  }

  openPrivacyModal() {
    setTimeout(() => {
      this.privacyViewModal.open();
    }, 100);
  }

  onPurchase() {
    const {
      user,
      cart,
      qualifications,
      selectedCentreMembers,
      stripeCardForm,

      postPurchaseLicencesCentreAttempt
    } = this.props;

    const centre_id = lodash.get(user, 'centres[0].centre_id', '');
    const learners = [];
    const data = stripeCardForm.values;

    if (!centre_id) {
      notifyError(translate('no_centre_exist'));
      return;
    }

    if (!lodash.get(cart, 'length')) {
      notifyError('Your cart is empty.');
      return;
    }

    selectedCentreMembers.forEach(sm => {
      learners.push(sm.member_id);
    });

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
      (status, token) => {
        if (status === 200) {
          // data['data[stripeToken]'] = token.id;
          // const purchasingQualifications = lodash.filter(
          //   qualifications,
          //   q =>
          //     lodash.findIndex(
          //       cart,
          //       c => c.qualification_id == q.qualification_id
          //     ) >= 0
          // );

          const qualificationIds = [];
          const quantities = [];

          cart.forEach(item => {
            qualificationIds.push(item.qualification_id);
            quantities.push(item.count);
          });

          postPurchaseLicencesCentreAttempt(centre_id, {
            payment_type: data.type,
            quantity: quantities,
            qualification_id: qualificationIds,
            learners: learners,
            data: {
              stripeToken: token.id,
              AccountNumber: token.card.last4,
              ExpirationMonth: token.card.exp_month,
              ExpirationYear: token.card.exp_year,
              CardType: token.card.brand
            }
          });
        }
      }
    );
  }

  render() {
    const {
      total,
      qualifications,
      cart,
      stripeCardForm,

      attemptingPurchase
    } = this.props;
    const { steps, active } = this.state;

    const purchasingQualifications = lodash.filter(
      qualifications,
      q =>
        lodash.findIndex(cart, c => c.qualification_id == q.qualification_id) >=
        0
    );

    return (
      <div className="store checkout">
        <StoreHeader
          title="Checkout"
          subtitle={`Welcome to the ${config.title} Store`}
          backLink="/store/basket"
          showUploadFileButton={false}
        />

        <StoreStepbar active={active} steps={steps} placeholder="" />

        <div className="container">
          <div className="content-section p-t-30 p-b-30">
            <div className="box columns">
              <div className="column is-5 b-r">
                <div className="p-60">
                  <h2 className="m-b-20">Your billing information</h2>
                  <UIStripeCard />
                  <p className="m-t-20">
                    By confirming, you agree to The Scottish Licensed Trade
                    Association{' '}
                    <span className="is-primary" onClick={this.openTermsModal}>
                      Terms and Use
                    </span>{' '}
                    and{' '}
                    <span
                      className="is-primary"
                      onClick={this.openPrivacyModal}
                    >
                      privacy policy
                    </span>
                  </p>
                </div>
              </div>
              <div className="column">
                <div className="p-60">
                  <div className="columns">
                    <div className="column">
                      {<h2>Your Purchasing</h2>}
                      {purchasingQualifications.map((pq, k) => (
                        <div key={`purchasing_${k}`} className="m-b-20">
                          <h3>
                            {lodash.get(pq, 'title', '').length > 78
                              ? `${lodash.get(pq, 'title', '').slice(0, 75)}...`
                              : lodash.get(pq, 'title', '')}
                          </h3>
                          <span>£{lodash.get(pq, 'price', 0)}</span>
                        </div>
                      ))}

                      <div className="auto-renewal">
                        <UICheckbox checked />
                        <span className="m-l-15">Automatic renewal</span>
                      </div>
                    </div>
                    <div className="column">
                      <div className="p-30 box">
                        <div className="columns">
                          <div className="column m-t-25">
                            <span className="is-primary">Total</span>
                          </div>
                          <div className="column">
                            <span className="total-price">£{total || 0}</span>
                          </div>
                        </div>
                        <button
                          className={`button is-primary m-b-10 ${attemptingPurchase &&
                            'is-loading'}`}
                          disabled={
                            stripeCardForm.syncErrors || attemptingPurchase
                          }
                          onClick={() => this.confirmPurchaseModal.open()}
                        >
                          Confirm Purchase
                        </button>
                        <Link
                          className="button is-primary is-outlined"
                          disabled={attemptingPurchase}
                          to="/store"
                        >
                          Continue Shopping
                        </Link>
                      </div>
                      <div className="m-t-20">
                        <div
                          className="columns m-b-0"
                          onClick={this.openIntercom}
                        >
                          <div className="column flex-none">
                            <a className="speech">
                              <Isvg src={IconMessage} />
                            </a>
                          </div>
                          <div className="column">
                            <h3 style={{ color: 'black' }}>Have a question?</h3>
                            <div className="em">
                              Help and advice available 24 hours a day, 7 days a
                              week
                            </div>
                          </div>
                        </div>
                        <div>
                          Please note: Live chat is available in English only
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />

        <ContentModal
          className="news-view-modal"
          ref={e => {
            this.termsViewModal = e;
          }}
        >
          <Terms />
        </ContentModal>

        <ContentModal
          className="news-view-modal"
          ref={e => {
            this.privacyViewModal = e;
          }}
        >
          <Privacy />
        </ContentModal>
        <ContentModalConfirm
          callback={this.onPurchase}
          ref={e => {
            this.confirmPurchaseModal = e;
          }}
        >
          <h3>
            <p>You are about to purchase this qualification.</p>
            <p>Are you willing to continue?</p>
          </h3>
        </ContentModalConfirm>
      </div>
    );
  }
}

const mapStateToProps = ({ store, profile, form }) => ({
  user: lodash.get(profile, 'user', {}),
  total: getTotalAmount(store),
  qualification: lodash.get(store, 'currentQualification'),
  qualifications: lodash.get(store, 'qualifications'),
  cart: lodash.get(store, 'cart'),
  selectedCentreMembers: lodash.get(store, 'selectedCentreMembers', []),
  stripeCardForm: lodash.get(form, 'stripeCard', {}),

  attemptingPurchase: lodash.get(store, 'attemptingPurchase')
});

const mapDispatchToProps = dispatch => ({
  addToCart: qualification_id => {
    dispatch(Actions.addToCart(qualification_id, 1));
    browserHistory.push('/store/basket');
  },
  setActiveQualification: qualification => {
    dispatch(Actions.setActiveQualification(qualification));
  },
  selectCentreMember: member => {
    dispatch(Actions.selectCentreMember(member));
  },
  getQualificationInStoreAttempt: (qualification_id, view_error) =>
    dispatch(
      Actions.getQualificationInStoreAttempt(qualification_id, view_error)
    ),
  getCentreMembersNotQualificationAttempt: (centre_id, params) =>
    dispatch(
      Actions.getCentreMembersNotQualificationAttempt(centre_id, params)
    ),

  postPurchaseLicencesCentreAttempt: (centre_id, params) =>
    dispatch(Actions.postPurchaseLicencesCentreAttempt(centre_id, params))
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);

// <ContentModal
//           className="news-view-modal"
//           ref={e => {
//             this.confirmPurchaseModal = e;
//           }}
//         >
//           <h1 className="has-text-primary has-text-centered p-t-50 p-b-50 is-size-4">
//             You have purcharsed this qualification successfully.
//           </h1>
//         </ContentModal>
