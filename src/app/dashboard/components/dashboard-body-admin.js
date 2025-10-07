import React, { Component } from 'react';
import QualificationsSlider from './dashboard-qualifications-slider';
import DashboardList from './dashboard-list';
import AllNotifications from '../../notifications/components/all-notifications';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { Creators } from 'app/notifications/actions';
import { Link } from 'react-router';
import common from 'app/common';
import { Text } from 'app/intl';

const UILoading = common.components.UILoading;

class BodyTutor extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(Creators.getMemberNotificationsAttempt());
  }

  render() {
    const { centreSeats, centreQualifications } = this.props;

    return (
      <div className="columns">
        <div className="column is-3">
          <div className="column-wrapper">
            <div className="dashboard-column-header border-bottom">
              <span className="col-title">
                <Text iKey="qualification" />
              </span>
            </div>
            {R.isNil(centreQualifications) ? (
              <UILoading customClass="m-t-25" minHeight="75px" />
            ) : (
              <QualificationsSlider {...{ centreQualifications }} />
            )}
          </div>
        </div>
        <div className="column is-6">
          <div className="column-wrapper">
            <div className="dashboard-column-header border-bottom">
              <span className="col-title">
                <Text iKey="centre_seats" />
              </span>
              <Link
                to="/community/seats"
                className="view-all-link is-pulled-right"
              >
                <Text iKey="view_all" />
              </Link>
            </div>
            <div className="your-qualifications-users">
              {!centreSeats ? (
                <UILoading customClass="m-t-25" minHeight="75px" />
              ) : (
                <DashboardList
                  {...{ users: centreSeats, type: 'centreSeat' }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="column is-3">
          <div className="column-wrapper">
            <div className="dashboard-column-header border-bottom">
              <span className="col-title">
                <Text iKey="notifications" />
              </span>
            </div>
            <AllNotifications />
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(BodyTutor);
