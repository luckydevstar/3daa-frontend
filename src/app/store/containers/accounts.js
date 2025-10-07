import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as lodash from 'lodash';
import common from 'app/common';
import config from 'brand/config';
import { Creators as Actions } from '../actions';
import components from '../components';

const { UILoading, UINavigation, Footer } = common.components;

const {
  StoreHeader,
  RecentOrdersTable,
  OrderDetails,
  AvailableLicensesTable,
  LicenseDetails
} = components;

const navTabs = [
  {
    key: 'available_licenses',
    text: 'Available Licenses'
  },
  {
    key: 'recent_orders',
    text: 'Recent Orders'
  }
];

class Accounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'available_licenses',
      searchQuery: ''
    };

    this.changeTab = this.changeTab.bind(this);
    this.onOrderDetailView = this.onOrderDetailView.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      centres,
      qualifications,
      getAllQualificationsInStoreAttempt,
      getOrdersInAccountAttempt,
      getQualificationLicensesAttempt
    } = this.props;

    if (lodash.get(centres, 'length')) {
      getQualificationLicensesAttempt(
        lodash.get(centres[0], 'centre_id'),
        null
      );
      getOrdersInAccountAttempt(lodash.get(centres[0], 'centre_id', ''), null);
    }

    if (!lodash.get(qualifications, 'length'))
      getAllQualificationsInStoreAttempt(null);
  }

  componentDidMount() {}

  changeTab(t) {
    this.setState({
      currentTab: t
    });
  }

  onOrderDetailView(e) {
    const { centres, getQualificationOrderAttempt } = this.props;

    if (lodash.get(centres, 'length')) {
      getQualificationOrderAttempt(
        lodash.get(centres[0], 'centre_id', ''),
        e.qualification_license_transaction_id
      );
    }
  }

  onQualificationLicenseView(e) {
    const { centres, getQualificationLicenseAttempt } = this.props;

    if (lodash.get(centres, 'length')) {
      getQualificationLicenseAttempt(
        lodash.get(centres[0], 'centre_id', ''),
        e.qualification_license_id
      );
    }
  }

  render() {
    const {
      orders,
      qualificationOrder,
      qualificationLicenses,
      qualificationLicense,
      addToCart,

      attemptingGetQualificationsInStore,
      attemptingOrdersInAccount,
      attemptingQualificationOrder,
      attemptingQualificationLicenses,
      attemptingQualificationLicense
    } = this.props;

    const { currentTab, searchQuery } = this.state;

    let filteredItems =
      lodash.get(qualificationLicenses, 'qualification_licenses') || [];

    if (searchQuery) {
      const phrase = searchQuery.trim().toLowerCase();
      filteredItems = filteredItems.filter(
        item => item.title.toLowerCase().indexOf(phrase) >= 0
      );
    }

    return (
      <div className="store accounts">
        <StoreHeader
          title="Accounts"
          subtitle={`Review your recent orders and account details`}
          showUploadFileButton={false}
          showBasketButton={false}
          showAccountBalance={true}
        />

        <section className="content-section navigation-section">
          <div className="container">
            <UINavigation
              active={currentTab}
              tabs={navTabs}
              change={this.changeTab}
              showSearch={currentTab === 'available_licenses'}
              onSearch={e => this.setState({ searchQuery: e })}
            />
          </div>
        </section>

        <section className="content-section account-section">
          {currentTab === 'available_licenses' && (
            <div className="container">
              {attemptingQualificationLicenses ||
              attemptingGetQualificationsInStore ? (
                <UILoading marginTop="100px" />
              ) : (
                <div className="store-account-container bg-white">
                  <div style={{ width: '100%' }}>
                    <AvailableLicensesTable
                      setActiveQualification={e =>
                        this.onQualificationLicenseView(e)
                      }
                      activeQualification={lodash.get(qualificationLicense, [
                        'qualification_license',
                        '0'
                      ])}
                      qualifications={filteredItems}
                    />
                  </div>
                  <div className="detail-column">
                    <div className="has-text-right m-b-20 m-t-20">
                      <Link
                        className="detail-link"
                        to={`/store/course/${lodash.get(qualificationLicense, [
                          'qualification_license',
                          '0',
                          'qualification_id'
                        ])}`}
                      >
                        View Full Details in Store
                      </Link>
                    </div>
                    <LicenseDetails
                      {...{ addToCart, attemptingQualificationLicense }}
                      qualification={lodash.get(qualificationLicense, [
                        'qualification_license',
                        '0'
                      ])}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentTab === 'recent_orders' && (
            <div className="container">
              {attemptingOrdersInAccount ||
              attemptingGetQualificationsInStore ? (
                <UILoading />
              ) : (
                <div className="store-account-container bg-white">
                  <div style={{ width: '100%' }}>
                    <RecentOrdersTable
                      {...{ orders }}
                      activeOrder={lodash.get(qualificationOrder, ['order'])}
                      detailView={e => this.onOrderDetailView(e)}
                    />
                  </div>
                  <div className="detail-column">
                    <OrderDetails
                      {...{ qualificationOrder, attemptingQualificationOrder }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ store, profile, form }) => ({
  centres: lodash.get(profile, 'user.centres', []),
  qualifications: lodash.get(store, 'qualifications', []),
  orders: lodash.get(store, 'orders'),
  qualificationOrder: lodash.get(store, 'qualificationOrder'),
  qualificationLicenses: lodash.get(store, 'qualificationLicenses'),
  qualificationLicense: lodash.get(store, 'qualificationLicense'),
  stripeCardForm: lodash.get(form, 'stripeCard', {}),

  attemptingOrdersInAccount: lodash.get(store, 'attemptingOrdersInAccount'),
  attemptingQualificationOrder: lodash.get(
    store,
    'attemptingQualificationOrder'
  ),
  attemptingQualificationLicenses: lodash.get(
    store,
    'attemptingQualificationLicenses'
  ),
  attemptingQualificationLicense: lodash.get(
    store,
    'attemptingQualificationLicense'
  ),
  attemptingGetQualificationsInStore: lodash.get(
    store,
    'attemptingGetQualificationsInStore'
  ),
  attemptingPurchase: lodash.get(store, 'attemptingPurchase')
});

const mapDispatchToProps = dispatch => ({
  addToCart: (qualification_id, num) => {
    dispatch(Actions.addToCart(qualification_id, num));
  },
  getAllQualificationsInStoreAttempt: params =>
    dispatch(Actions.getAllQualificationsInStoreAttempt(params)),

  getOrdersInAccountAttempt: (centre_id, params) =>
    dispatch(Actions.getOrdersInAccountAttempt(centre_id, params)),
  getQualificationOrderAttempt: (centre_id, transaction_id) =>
    dispatch(Actions.getQualificationOrderAttempt(centre_id, transaction_id)),
  getQualificationLicensesAttempt: centre_id =>
    dispatch(Actions.getQualificationLicensesAttempt(centre_id)),
  getQualificationLicenseAttempt: (centre_id, qualification_license_id) =>
    dispatch(
      Actions.getQualificationLicenseAttempt(
        centre_id,
        qualification_license_id
      )
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Accounts);
