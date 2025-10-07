import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { IntercomAPI } from 'react-intercom';
import Isvg from 'react-inlinesvg';
import * as lodash from 'lodash';

import config from 'brand/config';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { translate } from 'app/intl';

import { Creators as Actions } from '../actions';
import components from '../components';
import { getCartDetails, getTotalAmount } from '../utils';

import IconMessage from 'images/icon_message.svg';

const { StoreHeader, StoreStepbar, StoreCheckoutTable } = components;

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin,
  Member
} = Roles;

const {
  components: { Footer, MemberListView },
  util: {
    helpers: { extractUserRole },
    notify: { notifySuccess, notifyError }
  }
} = common;

class Basket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        {
          title:
            'The Scottish Certificate for Personal Licence Holders at SCQF Level 6',
          price: 55,
          quantity: 2
        }
      ],
      members: [],
      steps: config.purchaseWithBilling
        ? ['Select Course', 'Assign Licence', 'Summary', 'Checkout']
        : ['Select Course', 'Assign Licence', 'My Account'],
      active: 2
    };

    this.handleQuantityUpdate = this.handleQuantityUpdate.bind(this);
    this.openIntercom = this.openIntercom.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.onPurchase = this.onPurchase.bind(this);
    this.assignLicenses = this.assignLicenses.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { user, selectedCentreMembers } = this.props;

    const centreRoles = [CentreTutor, CentreAdmin];
    const role = extractUserRole(user);
    const assignView =
      centreRoles.indexOf(role) >= 0 &&
      lodash.get(selectedCentreMembers, 'length', 0) > 0;

    this.setState({
      steps: assignView
        ? ['Select Course', 'Assign Licence', 'Summary', 'My Account']
        : [
            'Select Course',
            'Basket',
            config.purchaseWithBilling ? 'Checkout' : 'My Account'
          ],
      active: assignView ? 2 : 1,
      members: selectedCentreMembers
    });
  }

  handleQuantityUpdate(i, q) {
    const { items } = this.state;
    const newItems = items.slice(0);
    newItems[i].quantity = q;

    this.setState({
      quantities: newItems
    });
  }

  openIntercom() {
    IntercomAPI('showNewMessage', 'Hi');
  }

  onRemoveItem(item) {
    const { removeItemFromCart, cleanSelectedCentreMembers } = this.props;
    removeItemFromCart(lodash.get(item, 'qualification_id', ''));
    cleanSelectedCentreMembers();
    this.setState({ members: [] });
  }

  onPurchase() {
    const {
      user,
      cart,
      selectedCentreMembers,

      postPurchaseLicencesCentreAttempt
    } = this.props;

    const centre_id = lodash.get(user, 'centres[0].centre_id', '');
    const learners = [];

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

    const qualificationIds = [];
    const quantities = [];

    cart.forEach(item => {
      qualificationIds.push(item.qualification_id);
      quantities.push(item.count);
    });

    postPurchaseLicencesCentreAttempt(centre_id, {
      payment_type: 'cc',
      quantity: quantities,
      qualification_id: qualificationIds,
      learners: learners,
      data: {
        SendInvoice: 1,
        InvoiceDue: 7,
        EmailInvoice: 1
      }
    });
    // browserHistory.push('/store/accounts');
  }

  assignLicenses() {
    const {
      postAssignQualificationLicencesLearnersAttempt,
      user,
      qualification,
      items,
      selectedCentreMembers
    } = this.props;

    const centre_id = lodash.get(user, 'centres[0].centre_id', '');
    const learners = [];

    if (!centre_id) {
      notifyError(translate('no_centre_exist'));
      return;
    }

    selectedCentreMembers.forEach(sm => {
      learners.push(sm.member_id);
    });

    postAssignQualificationLicencesLearnersAttempt(
      qualification.qualification_id,
      centre_id,
      { learners: learners }
    );
  }

  renderResultLicences() {
    const {
      qualification,
      items,
      total,
      setItemCount,
      selectedCentreMembers,

      attemptingAssign
    } = this.props;

    const totalLicences = lodash.get(qualification, 'free_licenses') || 0;

    return (
      <div className="result">
        <div className="has-border p-15">
          <div className="p-t-30">
            <span className="is-primary">Licences Unused: &nbsp;</span>
            <span className="amount">
              {totalLicences - lodash.get(selectedCentreMembers, 'length', 0)}
            </span>
          </div>

          <div>
            <div>
              {lodash.get(
                qualification,
                'title',
                'The Scottish Certificate for Personal Licence Holders at SCQF Level 6'
              )}
            </div>
            <div>
              <span>LARA Ref: &nbsp;</span>
              <span>{lodash.get(qualification, 'reference', '6/502/H12')}</span>
            </div>
          </div>

          <hr />

          <div>
            <span className="is-primary">Licences to Assign: &nbsp;</span>
            <span className="amount">
              {lodash.get(selectedCentreMembers, 'length', 0)}
            </span>
          </div>

          <div>
            <div>
              {lodash.get(
                qualification,
                'title',
                'The Scottish Certificate for Personal Licence Holders at SCQF Level 6'
              )}
            </div>
            <div>
              <span>LARA Ref: &nbsp;</span>
              <span>{lodash.get(qualification, 'reference', '6/502/H12')}</span>
            </div>
          </div>

          <div className="m-t-15">
            <a
              className={`button is-primary checkout ${attemptingAssign &&
                'is-loading'}`}
              style={{ width: '100%' }}
              disabled={
                !lodash.get(selectedCentreMembers, 'length', false) ||
                attemptingAssign
              }
              onClick={() => this.assignLicenses()}
            >
              Assign your Licences
            </a>
          </div>
        </div>
      </div>
    );
  }

  renderProceed() {
    const {
      items,
      total,
      setItemCount,
      removeItemFromCart,
      selectedCentreMembers,
      selectCentreMember,
      deselectCentreMember,
      attemptingPurchase
    } = this.props;

    return (
      <div className="result">
        <div className="has-border p-15">
          <div
            className="is-flex p-t-30 p-b-15"
            style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}
          >
            <span className="is-primary" style={{ paddingBottom: '12px' }}>
              Total
            </span>
            <span className="total-price">£{total || 0}</span>
          </div>
          <div>
            <a
              className="button is-primary checkout is-outlined"
              className={`button is-primary checkout is-outlined ${attemptingPurchase &&
                'is-loading'}`}
              style={{ width: '100%' }}
              disabled={!lodash.get(items, 'length', false)}
              onClick={() => this.onPurchase()}
            >
              {config.purchaseWithBilling
                ? 'Proceed To Checkout'
                : 'Add to Account'}
            </a>
          </div>
          {/*
              <div className="m-b-15">
                <Link
                  className="button is-primary checkout"
                  disabled={!lodash.get(items, 'length', false)}
                  to="/store/checkout"
                >
                  {`Buy Now with ${lodash.get(
                    items,
                    'length',
                    0
                  )} Credits`}
                </Link>
              </div>
              <div className="m-b-15">
                <Link
                  className="button is-primary checkout is-outlined"
                  disabled={!lodash.get(items, 'length', false)}
                  to="/store/checkout"
                >
                  Buy Now for £{total}
                </Link>
              </div>
              <div>
                <Link
                  className="button is-primary checkout is-outlined"
                  disabled={!lodash.get(items, 'length', false)}
                  to="/store/checkout"
                >
                  Add To Basket
                </Link>
              </div>
            */}
        </div>
        <div className="m-t-20" onClick={this.openIntercom}>
          <div className="columns m-b-0">
            <div className="column flex-none">
              <a className="speech">
                <Isvg src={IconMessage} />
              </a>
            </div>
            <div className="column">
              <h3 style={{ color: 'black' }}>Have a question?</h3>
              <div className="em">
                Help and advice available 24 hours a day, 7 days a week
              </div>
            </div>
          </div>
          <div className="small chat-desc">
            Please note: Live chat is available in English only
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      qualification,
      items,
      total,
      setItemCount,
      removeItemFromCart,
      selectedCentreMembers,
      selectCentreMember,
      deselectCentreMember
    } = this.props;

    const { members, steps, active } = this.state;
    const assignView = active == 2;

    return (
      <div className="store basket">
        <StoreHeader
          title="Your Basket"
          subtitle={`Welcome to the ${config.title} Store`}
          backLink="/store/asign"
          showCheckoutButton={false}
          showUploadFileButton={false}
          showBasketButton={false}
        />
        <StoreStepbar
          active={active}
          steps={steps}
          placeholder="Search Users"
        />
        <div className="container m-t-20 m-b-20">
          <div className="content-section">
            <div className="has-border basket-content">
              <div className="left-side">
                <StoreCheckoutTable
                  {...{
                    items,
                    total,
                    selectedCentreMembers
                  }}
                  showQuantity={!assignView}
                  onQuantityUpdate={setItemCount}
                  removeItem={e => this.onRemoveItem(e)}
                />

                {members.length > 0 && (
                  <div className="is-flex m-t-45">
                    <div style={{ width: '100%' }}>
                      <MemberListView
                        members={members}
                        selectedCentreMembers={selectedCentreMembers}
                        showHeader={false}
                        showChat={false}
                        showRemove={true}
                        showProfile={false}
                        onCheckBoxChange={e => selectCentreMember(e)}
                        onRemove={e => deselectCentreMember(e)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="right-side">
                {assignView
                  ? this.renderResultLicences()
                  : this.renderProceed()}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ store, profile }) => ({
  user: lodash.get(profile, 'user', {}),
  items: getCartDetails(store),
  total: getTotalAmount(store),
  qualification: lodash.get(store, 'currentQualification'),
  cart: lodash.get(store, 'cart'),
  selectedCentreMembers: lodash.get(store, 'selectedCentreMembers', []),

  attemptingPurchase: lodash.get(store, 'attemptingPurchase'),
  attemptingAssign: lodash.get(store, 'attemptingAssign')
});

const mapDispatchToProps = dispatch => ({
  setItemCount: (i, c) => dispatch(Actions.setItemCount(i, c)),
  removeItemFromCart: course_id => dispatch(Actions.removeFromCart(course_id)),
  selectCentreMember: member => {
    dispatch(Actions.selectCentreMember(member));
  },
  deselectCentreMember: member => {
    dispatch(Actions.deselectCentreMember(member));
  },
  cleanSelectedCentreMembers: () =>
    dispatch(Actions.cleanSelectedCentreMembers()),

  postPurchaseLicencesCentreAttempt: (centre_id, params) =>
    dispatch(Actions.postPurchaseLicencesCentreAttempt(centre_id, params)),

  postAssignQualificationLicencesLearnersAttempt: (
    qualification,
    centre_id,
    learners
  ) => {
    dispatch(
      Actions.postAssignQualificationLicencesLearnersAttempt(
        qualification,
        centre_id,
        learners
      )
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Basket);

// <div
//   className="is-flex no-grow"
//   style={{
//     padding: '0 30px 25px 30px',
//     alignItems: 'flex-end'
//   }}
// >
//   <a className="button is-primary checkout is-outlined">
//     Update Basket
//   </a>
// </div>

// <div className="columns m-b-0">
//   <div className="column">
//     <span className="is-primary">Regular Price:</span>
//   </div>
//   <div className="column">
//     <span>£{total}</span>
//   </div>
// </div>

// <div className="columns m-b-0">
//   <div className="column">
//     <span className="is-primary">
//       Or {lodash.get(items, 'length', 0)} credits
//     </span>
//   </div>
//   <div className="column">
//     <span>{lodash.get(items, 'length', 0)} credits</span>
//   </div>
// </div>
