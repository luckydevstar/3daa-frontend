import React, { Component } from 'react';
import QualificationsSlider from './dashboard-qualifications-slider';
import DashboardList from './dashboard-list';
import AllNotifications from '../../notifications/components/all-notifications';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { Creators } from 'app/notifications/actions';
import { Link } from 'react-router';
import common from 'app/common';

const UILoading = common.components.UILoading;

class BodyTutor extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(Creators.getMemberNotificationsAttempt());
  }

  render() {
    const { centreLearners, centreQualifications } = this.props;
    return (
      <div className="columns">
        <div className="column is-one-quarter">
          <div className="column-wrapper">
            <div className="dashboard-column-header border-bottom">
              <span className="col-title">Qualification</span>
            </div>
            {R.isNil(centreQualifications) ? (
              <UILoading customClass="m-t-25" minHeight="75px" />
            ) : (
              <QualificationsSlider {...{ centreQualifications }} />
            )}
          </div>
        </div>
        <div className="column is-two-quarters">
          <div className="column-wrapper">
            <div className="dashboard-column-header border-bottom">
              <span className="col-title">Your Learners</span>
              <Link
                to="/community/learners"
                className="view-all-link is-pulled-right"
              >
                View All
              </Link>
            </div>
            <div className="your-qualifications-users">
              {!centreLearners ? (
                <UILoading customClass="m-t-25" minHeight="75px" />
              ) : (
                <DashboardList
                  {...{ users: centreLearners, type: 'learner' }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="column is-one-quarter">
          <div className="column-wrapper">
            <div className="dashboard-column-header border-bottom">
              <span className="col-title">Notifications</span>
            </div>
            <AllNotifications />
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(BodyTutor);
