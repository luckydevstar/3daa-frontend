import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classNames from 'classnames';
import {
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import moment from 'moment';
import Isvg from 'react-inlinesvg';
import common from 'app/common';
import config from 'brand/config';

import { Creators as QualificationActions } from 'app/qualifications/actions';
import IconLearningHours from 'images/icon-learning-hours.svg';
import IconLearnerProgress from 'images/icon-learner-progress.svg';
import IconUnitProgress from 'images/icon-unit-progress.svg';

const {
  components: { ProgressBadge }
} = common;

const CHART_TITLES = [
  'Student Logins This Week',
  'Most Popular Study Time',
  'E-learning Hours Breakdown'
];

class DashboardCohortsLearningHours extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
      totalHours: 0
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { learningHours } = nextProps;
    const data1 = Object.values(learningHours);
    let totalHours = 0;

    const newData = data1.map(item => {
      totalHours += parseFloat(item.hours);
      const newItem = {
        date: moment(item.date).format('DD/M'),
        hours: item.hours
      };
      return newItem;
    });

    this.setState({
      chartData: newData,
      totalHours
    });
  }

  toggleChat(index) {
    const { getLearingHours, selectedGroupId } = this.props;
    let params = {
      type: index,
      groupId: selectedGroupId
    };

    if (index > -1) {
      getLearingHours(params);
    } else {
      getLearingHours({});
    }

    this.setState({
      activeTab: index
    });
  }

  render() {
    const { isChartView, selectedGroupTitle, selectedLearnerName } = this.props;
    const { activeTab, chartData, totalHours } = this.state;

    return (
      <div className="your-learning-hours">
        <div className="chart-details p-t-15">
          <div className="columns chart-tab-container">
            <div
              className={classNames('button', 'column', 'chart-tab', 'b', {
                active: activeTab === 0
              })}
              onClick={() => this.toggleChat(0)}
            >
              <Isvg src={IconLearnerProgress} />
              <span className="chart-tab-text">{CHART_TITLES[0]}</span>
            </div>
            <div
              className={classNames('button', 'column', 'chart-tab', 'b', {
                active: activeTab === 1
              })}
              onClick={() => this.toggleChat(1)}
            >
              <Isvg src={IconUnitProgress} />
              <span className="chart-tab-text">{CHART_TITLES[1]}</span>
            </div>
            <div
              className={classNames('button', 'column', 'chart-tab', 'b', {
                active: activeTab === 2
              })}
              onClick={() => this.toggleChat(2)}
            >
              <Isvg src={IconLearningHours} />
              <span className="chart-tab-text">{CHART_TITLES[2]}</span>
            </div>
          </div>
          <div className="columns">
            <div className={classNames('column', { 'is-4': isChartView })}>
              <div>
                <div className="total-hours b">
                  <p>
                    {selectedGroupTitle} | {CHART_TITLES[activeTab]} |{' '}
                    {totalHours}hrs
                  </p>
                </div>
                <div className="active-learner b">{selectedLearnerName}</div>
                <div className="all-tab" onClick={() => this.toggleChat(-1)}>
                  <span>
                    <u>View All Cohorts</u>
                  </span>
                </div>
              </div>
            </div>
            {isChartView && (
              <div className="column is-8">
                <div className="columns">
                  <div className="column learning-hour">
                    <div className="title">Profile CV</div>
                    <div className="badge">
                      <ProgressBadge
                        dimensions={50}
                        strokeWidth={3}
                        percentage={12}
                        strokeColorSecondary="rgba(0, 0, 0, .1)"
                        percentageFontSize={14}
                        label="12.5 hrs"
                      />
                    </div>
                  </div>
                  <div className="column learning-hour">
                    <div className="title">Videos</div>
                    <div className="badge">
                      <ProgressBadge
                        dimensions={50}
                        strokeWidth={3}
                        percentage={12}
                        strokeColorSecondary="rgba(0, 0, 0, .1)"
                        percentageFontSize={14}
                        label="0.5 hrs"
                      />
                    </div>
                  </div>
                  <div className="column learning-hour">
                    <div className="title">Activities</div>
                    <div className="badge">
                      <ProgressBadge
                        dimensions={50}
                        strokeWidth={3}
                        percentage={12}
                        strokeColorSecondary="rgba(0, 0, 0, .1)"
                        percentageFontSize={14}
                        label="3.2 hrs"
                      />
                    </div>
                  </div>
                  <div className="column learning-hour">
                    <div className="title">Workbooks</div>
                    <div className="badge">
                      <ProgressBadge
                        dimensions={50}
                        strokeWidth={3}
                        percentage={12}
                        strokeColorSecondary="rgba(0, 0, 0, .1)"
                        percentageFontSize={14}
                        label="32.1 hrs"
                      />
                    </div>
                  </div>
                  <div className="column learning-hour">
                    <div className="title">News</div>
                    <div className="badge">
                      <ProgressBadge
                        dimensions={50}
                        strokeWidth={3}
                        percentage={12}
                        strokeColorSecondary="rgba(0, 0, 0, .1)"
                        percentageFontSize={14}
                        label="0.5 hrs"
                      />
                    </div>
                  </div>
                  <div className="column learning-hour">
                    <div className="title">Chat</div>
                    <div className="badge">
                      <ProgressBadge
                        dimensions={50}
                        strokeWidth={3}
                        percentage={12}
                        strokeColorSecondary="rgba(0, 0, 0, .1)"
                        percentageFontSize={14}
                        label="0.1 hrs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="chart">
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="hours"
                stroke={config.primaryColor}
                strokeWidth={3}
                fill={config.primaryColor}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ qualifications }) => ({
  learningHours: qualifications.learingHours
});

const mapDispatchToProps = dispatch => ({
  getLearingHours: params =>
    dispatch(QualificationActions.getLearingHoursAttempt(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardCohortsLearningHours);
