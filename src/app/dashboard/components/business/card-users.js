import React, { Component } from 'react';
import { Link } from 'react-router';

class DashboardBusinessCardUsers extends Component {
  render() {
    const { mockData, centreProfile } = this.props;
    return (
      <div className="dashboard-business-users m-t-20">
        <div className="card p-25">
          <div className="dashboard-business-users__active-tutors-container">
            {centreProfile.learners && (
              <div className="dashboard-business-users__active-users">
                <i className="fa fa-users" />
                <div className="dashboard-business-users__active-users__count">
                  {centreProfile.learners}
                </div>
                <div className="dashboard-business-users__active-users__title">
                  Active Learners
                </div>
              </div>
            )}
            {/* <div className="dashboard-business-tutors-users">
              <i className="fa fa-user-o" />
              <div className="dashboard-business-users__active-users__count">5</div>
              <div className="dashboard-business-users__active-users__title">Tutors</div>
            </div> */}
          </div>
          <div className="dashboard-business-users__add-more-staff">
            <Link to="/community/centre-tutors">
              <button>ADD MORE STAFF</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardBusinessCardUsers;
