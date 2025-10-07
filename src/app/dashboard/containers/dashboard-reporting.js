import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Creators as Actions } from '../actions';
import Isvg from 'react-inlinesvg';
import common from 'app/common';
import IconPlus from 'images/icon_plus.svg';
import {
  DashboardReportSummary,
  DashboardLineChart,
  DashboardPieChart,
  DashboardAreaChart,
  DashboardBarChart,
  DashboardGauge,
  AddChartDialogContent,
  PickDataDialogContent
} from '../components';

console.log(DashboardReportSummary);

const { UIPageHeader, UINavigation, ContentModalNew } = common.components;

class DashboardReporting extends Component {
  UNSAFE_componentWillMount() {
    const {
      getUserSummaryAttempt,
      getReportingTopCentresAttempt,
      getReportingMonthlyLearningHoursAttempt,
      getReportingDailyLoginsAttempt,
      getReportingTopQualificationsAttempt,
      getReportingMonthlyTopQualificationsAttempt
    } = this.props;

    getUserSummaryAttempt();
    getReportingTopCentresAttempt();
    getReportingMonthlyLearningHoursAttempt();
    getReportingDailyLoginsAttempt();
    getReportingTopQualificationsAttempt();
    getReportingMonthlyTopQualificationsAttempt();
  }

  render() {
    const {
      chartsToAdd,
      dialog,
      sector,
      changeDashboardDialog,
      toggleChartsToAdd,
      userSummary,
      topCentres,
      monthlyLearningHours,
      dailyLogins,
      topQualifications,
      monthlyTopQualifications
    } = this.props;

    return (
      <div className="dashboard-reporting">
        <UIPageHeader
          title="Admin Dashboard"
          subTitle="Whats happening across the platform"
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
        <DashboardReportSummary {...{ userSummary }} />
        <div className="columns m-20">
          <div className="column is-4 h-300">
            <DashboardGauge {...{ monthlyLearningHours }} />
          </div>
          <div className="column is-4 h-300">
            <DashboardLineChart {...{ dailyLogins }} />
          </div>
          <div className="column is-4 h-300">
            <DashboardPieChart {...{ topCentres }} />
          </div>
        </div>
        <div className="columns m-20">
          <div className="column is-8 h-600">
            <DashboardAreaChart {...{ monthlyTopQualifications }} />
          </div>
          <div className="column is-4 h-600">
            <DashboardBarChart {...{ topQualifications }} />
          </div>
        </div>
        <ContentModalNew
          className="dashboard-chart-dialog"
          ref={e => {
            this.addDialog = e;
          }}
        >
          {dialog === 1 && (
            <AddChartDialogContent
              {...{
                chartsToAdd,
                toggleChartsToAdd,
                onAdd: () => changeDashboardDialog(2)
              }}
            />
          )}
          {dialog === 2 && <PickDataDialogContent />}
        </ContentModalNew>
      </div>
    );
  }
}

const mapStateToProps = ({
  reporting: {
    chartsToAdd,
    dialog,
    userSummary,
    topCentres,
    monthlyLearningHours,
    dailyLogins,
    topQualifications,
    monthlyTopQualifications
  },
  persisted: { sector }
}) => ({
  chartsToAdd,
  dialog,
  sector,
  userSummary,
  topCentres,
  monthlyLearningHours,
  dailyLogins,
  topQualifications,
  monthlyTopQualifications
});

const mapDispatchToProps = dispatch => ({
  toggleChartsToAdd: type => dispatch(Actions.toggleChartsToAdd(type)),
  changeDashboardDialog: type => dispatch(Actions.changeDashboardDialog(type)),
  getUserSummaryAttempt: () => dispatch(Actions.getUserSummaryAttempt()),
  getReportingTopCentresAttempt: () =>
    dispatch(Actions.getReportingTopCentresAttempt()),
  getReportingMonthlyLearningHoursAttempt: () =>
    dispatch(Actions.getReportingMonthlyLearningHoursAttempt()),
  getReportingDailyLoginsAttempt: () =>
    dispatch(Actions.getReportingDailyLoginsAttempt()),
  getReportingTopQualificationsAttempt: () =>
    dispatch(Actions.getReportingTopQualificationsAttempt()),
  getReportingMonthlyTopQualificationsAttempt: () =>
    dispatch(Actions.getReportingMonthlyTopQualificationsAttempt())
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardReporting);
