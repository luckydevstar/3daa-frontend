import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Creators as Actions } from '../actions';
import common from 'app/common';
import {
  DashboardLatestOrders,
  DashboardPieChart,
  DashboardBarChart,
  DashboardCentreSummary,
  DashboardSalesTable
} from '../components';

const { UIPageHeader, UINavigation, ContentModalNew } = common.components;

class DashboardFinance extends Component {
  UNSAFE_componentWillMount() {
    const {
      getUserSummaryAttempt,
      getReportingTopCentresAttempt,
      getReportingTopQualificationsAttempt,
      getReportingOrdersAttempt,
      getReportingOrdersMonthlyAttempt
    } = this.props;

    getUserSummaryAttempt();
    getReportingTopCentresAttempt();
    getReportingTopQualificationsAttempt();
    getReportingOrdersAttempt();
    getReportingOrdersMonthlyAttempt();
  }

  render() {
    const {
      sector,
      userSummary,
      topCentres,
      topQualifications,
      adminOrders,
      adminOrdersMonthly
    } = this.props;
    console.log(adminOrdersMonthly);
    return (
      <div className="dashboard-reporting">
        <UIPageHeader
          title="Dashboard"
          subTitle="Whats happening on Platform One"
          sector={sector}
        >
          {/* <button
            className="button add-chart is-dark is-outlined"
            onClick={() => this.addDialog.open()}
          >
            <Isvg src={IconPlus} /> Add a Chart
          </button> */}
        </UIPageHeader>
        <UINavigation tabs={[]} />
        <div className="columns m-20">
          <div className="column is-4 h-350">
            <DashboardLatestOrders {...{ adminOrders }} />
          </div>
          <div className="column is-2 h-350">
            <DashboardCentreSummary {...{ userSummary }} />
          </div>
          <div className="column is-6 h-350">
            <DashboardPieChart {...{ topCentres }} />
          </div>
        </div>
        <div className="columns m-20">
          <div className="column is-4 h-400">
            <DashboardSalesTable {...{ adminOrdersMonthly }} />
          </div>
          <div className="column is-8 h-400">
            <DashboardBarChart {...{ topQualifications }} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  reporting: {
    userSummary,
    topCentres,
    topQualifications,
    adminOrders,
    adminOrdersMonthly
  },
  persisted: { sector }
}) => ({
  sector,
  userSummary,
  topCentres,
  topQualifications,
  adminOrders,
  adminOrdersMonthly
});

const mapDispatchToProps = dispatch => ({
  getUserSummaryAttempt: () => dispatch(Actions.getUserSummaryAttempt()),
  getReportingTopCentresAttempt: () =>
    dispatch(Actions.getReportingTopCentresAttempt()),
  getReportingTopQualificationsAttempt: () =>
    dispatch(Actions.getReportingTopQualificationsAttempt()),
  getReportingOrdersAttempt: () =>
    dispatch(Actions.getReportingOrdersAttempt()),
  getReportingOrdersMonthlyAttempt: () =>
    dispatch(Actions.getReportingOrdersMonthlyAttempt())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardFinance);
