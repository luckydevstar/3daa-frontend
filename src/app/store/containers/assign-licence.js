import React, { Component } from 'react';
import Isvg from 'react-inlinesvg';
import { Link, browserHistory } from 'react-router';
import * as lodash from 'lodash';
import { Creators as Actions } from '../actions';
import { Creators as MessagingActions } from 'app/messaging/actions';
import components from '../components';
import common from 'app/common';
import { connect } from 'react-redux';
import { getCartDetails, getTotalAmount } from '../utils';
import config from 'brand/config';
import { IntercomAPI } from 'react-intercom';

import IconMessage from 'images/icon_message.svg';

const {
  StoreHeader,
  StoreStepbar,
  StoreQualificationLicenceCardFront,
  StoreExplorerNav
} = components;

const {
  UILoading,
  Footer,
  ContentModal,
  SelectedItemList,
  MemberListView,
  MemberCardListView
} = common.components;

class AssignLicence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedWarning: false,
      selectedCentreMembers: [],
      viewMode: 'list',
      searchQuery: ''
    };
    this.checkLicences = this.checkLicences.bind(this);
    this.onCheckout = this.onCheckout.bind(this);
    this.openChat = this.openChat.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      centres,
      qualification,
      getQualificationInStoreAttempt,
      getCentreMembersNotQualificationAttempt,
      params
    } = this.props;

    if (
      !qualification ||
      lodash.get(qualification, 'qualification_id') !=
        lodash.get(this.props, 'params.qualificationId')
    ) {
      getQualificationInStoreAttempt(
        lodash.get(this.props, 'params.qualificationId'),
        true
      );
    }
    if (lodash.get(centres, 'length')) {
      getCentreMembersNotQualificationAttempt(
        lodash.get(centres[0], 'centre_id', ''),
        {
          not_qualification_id: params.qualificationId,
          centre_roles: ['CENTRE_LEARNER_ROLE']
        }
      );
    }
  }

  componentDidMount() {
    this.checkLicences();
  }

  UNSAFE_componentWillReceiveProps() {
    this.checkLicences();
  }

  checkLicences() {
    const { qualification, attemptingGetQualificationInStore } = this.props;
    const { openedWarning } = this.state;

    if (!qualification || openedWarning || attemptingGetQualificationInStore)
      return;

    const free_licenses = lodash.get(qualification, 'free_licenses', 0);

    this.setState({ openedWarning: true });

    if (!free_licenses) this.lackLicencesModal.open();
  }

  onCheckout() {
    const { qualification, selectedCentreMembers, addToCart } = this.props;

    const freeLicenses = lodash.get(qualification, 'free_licenses', 0);

    if (!selectedCentreMembers.length || !freeLicenses) return;

    addToCart(lodash.get(qualification, 'qualification_id', 60));
  }

  openChat(member) {
    const { startChatAttempt } = this.props;
    const screen_name = lodash.get(member, 'screen_name', '');
    startChatAttempt([member], screen_name, true, null);
  }

  render() {
    const {
      qualification,
      selectedCentreMembers,
      attemptingGetCentreMembers,
      attemptingGetQualificationInStore,
      addToCart,
      centreMembers,
      selectCentreMember
    } = this.props;

    const { viewMode, searchQuery } = this.state;
    const freeLicenses = lodash.get(qualification, 'free_licenses', 0);

    const preContent = (
      <div className="selected-members">
        <span>Select User&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span className="numbers">
          {lodash.get(selectedCentreMembers, 'length', 0)}&nbsp;Member selected
        </span>
      </div>
    );

    let filteredItems = centreMembers.members;

    if (searchQuery) {
      const phrase = searchQuery.trim().toLowerCase();
      filteredItems = filteredItems.filter(
        item => item.screen_name.toLowerCase().indexOf(phrase) >= 0
      );
    }

    return (
      <div className="store assign-licences">
        <ContentModal
          ref={e => {
            this.lackLicencesModal = e;
          }}
        >
          <div className="p-25 oops">
            <div className="has-text-centered">
              <h2 className="oops-header">oops!</h2>
            </div>
            <div
              className="p-t-5 p-b-5 p-l-15 p-r-15"
              style={{ fontSize: '18px' }}
            >
              <p className="p-b-15">
                You don’t seem to have enough licences in your account.
              </p>
              <p className="oops-desc">
                That’s not a problem just&nbsp;
                <Link to="/store/accounts" className="oops-link">
                  click here
                </Link>
                &nbsp;and top up to make some more.
                <br />
                Once you have done that you can continue to add your guys the
                qualification they want.
              </p>
            </div>
          </div>
        </ContentModal>

        <StoreHeader
          title="Assign Licence"
          subtitle={`Welcome to the Example store | Purchase your Licences here`}
          backLink="/store/basket"
          showCheckoutButton={false}
          showUploadFileButton={true}
          showBasketButton={false}
          showAccountBalance={false}
        />
        <StoreStepbar
          active={1}
          placeholder="Search Users"
          onSearch={e => this.setState({ searchQuery: e })}
        />
        {attemptingGetCentreMembers || attemptingGetQualificationInStore ? (
          <div className="container is-flex">
            <UILoading isLoadingOverlay alignMiddle />
          </div>
        ) : (
          <div className="container is-flex">
            <div>
              <StoreQualificationLicenceCardFront {...{ qualification }} />
            </div>
            <div className="p-l-30" style={{ width: '100%' }}>
              <StoreExplorerNav
                {...{ preContent }}
                setView={e => this.setState({ viewMode: e })}
              />
              <SelectedItemList
                items={selectedCentreMembers}
                showAvatar={false}
                showPdfIcon={false}
                showTtrainingIcon={false}
                onClose={e => selectCentreMember(e)}
              />

              {viewMode == 'list' ? (
                <MemberListView
                  members={filteredItems}
                  selectedCentreMembers={selectedCentreMembers}
                  showHeader={false}
                  showChat={true}
                  showRemove={false}
                  openChat={e => this.openChat(e)}
                  onCheckBoxChange={e => selectCentreMember(e)}
                />
              ) : (
                <MemberCardListView
                  members={filteredItems}
                  selectedCentreMembers={selectedCentreMembers}
                  showHeader={false}
                  showChat={true}
                  showRemove={false}
                  openChat={true}
                  onCheckBoxChange={e => selectCentreMember(e)}
                />
              )}
              <div className="has-text-right p-b-20">
                <a
                  className="button is-primary checkout"
                  disabled={!selectedCentreMembers.length || !freeLicenses}
                  onClick={() => this.onCheckout()}
                >
                  Checkout
                </a>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ store, profile }) => ({
  attemptingGetQualificationInStore: lodash.get(
    store,
    'attemptingGetQualificationInStore'
  ),
  attemptingGetCentreMembers: lodash.get(store, 'attemptingGetCentreMembers'),
  qualification: lodash.get(store, 'currentQualification'),
  centreMembers: lodash.get(store, 'centreMembers', { total: 0, members: [] }),
  selectedCentreMembers: lodash.get(store, 'selectedCentreMembers', []),
  centres: lodash.get(profile, 'user.centres', [])
});

const mapDispatchToProps = dispatch => ({
  addToCart: qualification_id => {
    dispatch(Actions.addToCart(qualification_id, 1));
    browserHistory.push('/store/basket');
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
  startChatAttempt: (participants, title, routeChange, file) =>
    dispatch(
      MessagingActions.startChatAttempt(participants, title, routeChange, file)
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(AssignLicence);
