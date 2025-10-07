import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as lodash from 'lodash';
import common from 'app/common';
import config from 'brand/config';

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { Creators as StoreActions } from 'app/store/actions';
import { Creators as MessagingActions } from 'app/messaging/actions';
import { Creators as Actions } from '../actions';

import StoreComponents from 'app/store/components';

import {
  FinanceModalSuspend,
  CentreAnalyticsCard,
  CentreAnalyticsRevenue
} from '../components';

const { UILoading, UINavigation, Footer, ContentModalNew } = common.components;

const {
  StoreHeader,
  RecentOrdersTable,
  OrderDetails,
  AvailableLicensesTable,
  LicenseDetails
} = StoreComponents;

const navTabs = [
  {
    key: 'available_licenses',
    text: 'Available Licenses'
  },
  {
    key: 'recent_orders',
    text: 'Recent Orders'
  },
  {
    key: 'analytics',
    text: 'Analytics'
  }
];

const COLORS = [
  '#CA3A8A',
  '#0080A3',
  '#84BC01',
  '#F5A623',
  '#FFBB28',
  '#FF8042'
];

class FinanceAccountsRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCentre: null,
      activeLicense: null,
      currentTab: 'available_licenses',
      searchTerm: '',
      suspendingLicenseId: null,
      tempQuantities: {}
    };

    this.changeTab = this.changeTab.bind(this);
    this.onOrderDetailView = this.onOrderDetailView.bind(this);
    this.openChat = this.openChat.bind(this);
    this.onActiveLicense = this.onActiveLicense.bind(this);
    this.onSuspend = this.onSuspend.bind(this);
    this.onSuspendAllLicenses = this.onSuspendAllLicenses.bind(this);
    this.onQuantityUpdate = this.onQuantityUpdate.bind(this);
    this.onAddLicense = this.onAddLicense.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      centres,
      licenses,

      financeGetCentreLicensesAttempt,
      getOrdersInAccountAttempt,
      params
    } = this.props;

    if (!lodash.get(licenses, 'length')) {
      financeGetCentreLicensesAttempt(params.centreId, null);
      getOrdersInAccountAttempt(params.centreId, null);
    }

    const centre = lodash.find(
      centres,
      centre => centre.centre_id == params.centreId
    );
    this.setState({ activeCentre: centre });
  }

  componentDidMount() {}

  changeTab(t) {
    this.setState({
      currentTab: t
    });
  }

  onOrderDetailView(e) {
    const { params, getQualificationOrderAttempt } = this.props;

    getQualificationOrderAttempt(
      params.centreId,
      e.qualification_license_transaction_id
    );
  }

  onQualificationLicenseView(e) {
    this.setState({ activeLicense: e });
  }

  openChat(member) {
    const { startChatAttempt } = this.props;
    startChatAttempt([member], screen_name, true);
  }

  onQuantityUpdate(license, quantity) {
    const tempQuantities = lodash.cloneDeep(this.state.tempQuantities);
    tempQuantities[license.qualification_id] = quantity;
    this.setState({ tempQuantities: tempQuantities });
  }

  onAddLicense(license) {
    const { financeAddCentreQualificationLicensesAttempt } = this.props;
    const { tempQuantities } = this.state;
    financeAddCentreQualificationLicensesAttempt(license.centre_id, {
      qualification_id: license.qualification_id,
      quantity: lodash.get(tempQuantities, [license.qualification_id]) || 1
    });
  }

  onActiveLicense(e, item) {
    const { financeRestoreCentreLicenseAttempt, params } = this.props;
    const checked = lodash.get(e, 'checked');

    if (checked) {
      financeRestoreCentreLicenseAttempt(
        params.centreId,
        item.qualification_license_id
      );
    } else {
      this.setState({ suspendingLicenseId: item.qualification_license_id });
      this.suspendModal.open();
    }
  }

  onSuspend() {
    const {
      financeSuspendCentreLicenseAttempt,
      financeSuspendCentreLicensesAttempt,
      params
    } = this.props;
    const { suspendingLicenseId } = this.state;
    this.suspendModal.close();

    if (!suspendingLicenseId) {
      financeSuspendCentreLicensesAttempt(params.centreId);
    } else {
      financeSuspendCentreLicenseAttempt(params.centreId, suspendingLicenseId);
    }
  }

  onSuspendAllLicenses() {
    this.setState({ suspendingLicenseId: null });
    this.suspendModal.open();
  }

  render() {
    const {
      licenses,
      orders,
      qualificationOrder,
      qualificationLicense,

      attemptingFinanceGetCentreLicenses,
      attemptingFinanceSuspendCentre,
      attemptingFinanceRestoreCentre,
      attemptingFinanceSuspendCentreLicense,
      attemptingFinanceRestoreCentreLicense,
      attemptingFinanceSuspendCentreLicenses,
      attemptingFinanceRestoreCentreLicenses,
      attemptingFinanceAddQualificationLicenses,

      attemptingOrdersInAccount,
      attemptingQualificationOrder
    } = this.props;

    const {
      activeCentre,
      activeLicense,
      currentTab,
      searchTerm,
      tempQuantities
    } = this.state;

    let filteredItems = lodash.get(licenses, 'qualification_licenses') || [];

    const topQualifications = [
      {
        progress_percentage: 1300,
        qualification_id: 40,
        title: 'Qualification1',
        reference: '603/2611/6'
      },
      {
        progress_percentage: 1100,
        qualification_id: 74,
        title: 'Qualification2',
        reference: '603/2611/6'
      },
      {
        progress_percentage: 900,
        qualification_id: 39,
        title: 'Qualification3',
        reference: '603/2611/6'
      },
      {
        progress_percentage: 700,
        qualification_id: 38,
        title: 'Qualification4',
        reference: '603/2611/6'
      },
      {
        progress_percentage: 500,
        qualification_id: 37,
        title: 'Qualification5',
        reference: '603/2611/6'
      },
      {
        progress_percentage: 300,
        qualification_id: 36,
        title: 'Qualification6',
        reference: '603/2611/6'
      }
    ];

    if (searchTerm) {
      const phrase = searchTerm.trim().toLowerCase();
      filteredItems = filteredItems.filter(
        item => item.title.toLowerCase().indexOf(phrase) >= 0
      );
    }

    return (
      <div className="store accounts">
        <StoreHeader
          title={lodash.get(activeCentre, 'screen_name') || 'Centre Name'}
          subtitle={`Review your customers available licenses and Recent orders`}
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
              onSearch={e => this.setState({ searchTerm: e })}
            />
          </div>
        </section>

        <section className="content-section account-section">
          {currentTab === 'available_licenses' && (
            <div className="container">
              {attemptingFinanceGetCentreLicenses ? (
                <UILoading marginTop="100px" />
              ) : (
                <div className="store-account-container bg-white">
                  <div style={{ width: '100%' }}>
                    <AvailableLicensesTable
                      activeQualification={activeLicense}
                      qualifications={filteredItems}
                      isDetailView={false}
                      tempQuantities={tempQuantities}
                      setActiveQualification={e =>
                        this.onQualificationLicenseView(e)
                      }
                      onActiveLicense={this.onActiveLicense}
                      onSuspendAllLicenses={this.onSuspendAllLicenses}
                      onQuantityUpdate={this.onQuantityUpdate}
                      onAddLicense={this.onAddLicense}
                      openChat={e => {}}
                      activatingLicense={attemptingFinanceRestoreCentreLicense}
                      suspendingLicense={attemptingFinanceSuspendCentreLicense}
                      activatingAllLicenses={
                        attemptingFinanceRestoreCentreLicenses
                      }
                      suspendingAllLicenses={
                        attemptingFinanceSuspendCentreLicenses
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentTab === 'recent_orders' && (
            <div className="container">
              {attemptingOrdersInAccount ? (
                <UILoading marginTop="100px" />
              ) : (
                <div className="store-account-container bg-white">
                  <div style={{ width: '100%' }}>
                    <RecentOrdersTable
                      {...{ orders }}
                      activeOrder={lodash.get(qualificationOrder, ['order'])}
                      isViewButton={false}
                      isViewChat={true}
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

          {currentTab === 'analytics' && (
            <div className="container">
              {attemptingOrdersInAccount ? (
                <UILoading marginTop="100px" />
              ) : (
                <div className="store-account-container bg-white">
                  <div className="is-flex" style={{ width: '100%' }}>
                    <CentreAnalyticsCard centre={activeCentre} />
                    <div style={{ width: 'calc(100% - 400px)' }}>
                      <CentreAnalyticsRevenue centre={activeCentre} />
                      <div
                        style={{
                          paddingLeft: '1.5rem',
                          paddingRight: '1.5rem',
                          width: '100%'
                        }}
                      >
                        <div className="fiance-revenue-card">
                          <div className="semibold p-b-5 m-b-15 border-bottom">
                            Total Performing Qualifications
                          </div>

                          <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer>
                              <BarChart
                                data={topQualifications}
                                margin={{
                                  top: 10,
                                  right: 30,
                                  left: 0,
                                  bottom: 0
                                }}
                              >
                                <XAxis dataKey="title" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                  type="monotone"
                                  dataKey="progress_percentage"
                                  fill={config.primaryColor}
                                  barSize={94}
                                >
                                  {topQualifications.map((entry, index) => {
                                    let color = COLORS[index];
                                    return (
                                      <Cell key={`bar${index}`} fill={color} />
                                    );
                                  })}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <Footer />

        <ContentModalNew
          ref={e => {
            this.suspendModal = e;
          }}
        >
          <FinanceModalSuspend
            content="You're about to suspend their licenses"
            onSuspend={this.onSuspend}
          />
        </ContentModalNew>
      </div>
    );
  }
}

const mapStateToProps = ({ finance, store, profile }) => ({
  centres: lodash.get(finance, 'centres') || [],
  licenses: lodash.get(finance, 'licenses') || [],

  orders: lodash.get(store, 'orders'),
  qualificationOrder: lodash.get(store, 'qualificationOrder'),
  qualificationLicense: lodash.get(store, 'qualificationLicense'),

  attemptingFinanceGetCentreLicenses: lodash.get(
    finance,
    'attemptingFinanceGetCentreLicenses'
  ),
  attemptingFinanceSuspendCentre: lodash.get(
    finance,
    'attemptingFinanceSuspendCentre'
  ),
  attemptingFinanceRestoreCentre: lodash.get(
    finance,
    'attemptingFinanceRestoreCentre'
  ),
  attemptingFinanceSuspendCentreLicense: lodash.get(
    finance,
    'attemptingFinanceSuspendCentreLicense'
  ),
  attemptingFinanceRestoreCentreLicense: lodash.get(
    finance,
    'attemptingFinanceRestoreCentreLicense'
  ),
  attemptingFinanceSuspendCentreLicenses: lodash.get(
    finance,
    'attemptingFinanceSuspendCentreLicenses'
  ),
  attemptingFinanceRestoreCentreLicenses: lodash.get(
    finance,
    'attemptingFinanceRestoreCentreLicenses'
  ),
  attemptingFinanceAddQualificationLicenses: lodash.get(
    finance,
    'attemptingFinanceAddQualificationLicenses'
  ),

  attemptingOrdersInAccount: lodash.get(store, 'attemptingOrdersInAccount'),
  attemptingQualificationOrder: lodash.get(
    store,
    'attemptingQualificationOrder'
  ),
  attemptingQualificationLicense: lodash.get(
    store,
    'attemptingQualificationLicense'
  ),
  attemptingPurchase: lodash.get(store, 'attemptingPurchase')
});

const mapDispatchToProps = dispatch => ({
  financeGetCentreLicensesAttempt: (centre_id, params) =>
    dispatch(Actions.financeGetCentreLicensesAttempt(centre_id, params)),

  financeRestoreCentreAttempt: centre_id =>
    dispatch(Actions.financeRestoreCentreAttempt(centre_id)),
  financeSuspendCentreAttempt: centre_id =>
    dispatch(Actions.financeSuspendCentreAttempt(centre_id)),

  financeSuspendCentreLicenseAttempt: (centre_id, qualification_license_id) =>
    dispatch(
      Actions.financeSuspendCentreLicenseAttempt(
        centre_id,
        qualification_license_id
      )
    ),

  financeRestoreCentreLicenseAttempt: (centre_id, qualification_license_id) =>
    dispatch(
      Actions.financeRestoreCentreLicenseAttempt(
        centre_id,
        qualification_license_id
      )
    ),

  financeSuspendCentreLicensesAttempt: centre_id =>
    dispatch(Actions.financeSuspendCentreLicensesAttempt(centre_id)),

  financeRestoreCentreLicensesAttempt: centre_id =>
    dispatch(Actions.financeRestoreCentreLicensesAttempt(centre_id)),

  financeAddCentreQualificationLicensesAttempt: (centre_id, params) =>
    dispatch(
      Actions.financeAddCentreQualificationLicensesAttempt(centre_id, params)
    ),

  getQualificationLicenseAttempt: (centre_id, qualification_license_id) =>
    dispatch(
      StoreActions.getQualificationLicenseAttempt(
        centre_id,
        qualification_license_id
      )
    ),
  getOrdersInAccountAttempt: (centre_id, params) =>
    dispatch(StoreActions.getOrdersInAccountAttempt(centre_id, params)),
  getQualificationOrderAttempt: (centre_id, transaction_id) =>
    dispatch(
      StoreActions.getQualificationOrderAttempt(centre_id, transaction_id)
    ),

  startChatAttempt: (participants, title, routeChange) =>
    MessagingActions.startChatAttempt(participants, title, routeChange)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinanceAccountsRoute);
