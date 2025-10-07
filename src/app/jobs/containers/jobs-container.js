import React from 'react';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { connect } from 'react-redux';
import { Creators } from '../actions';

import JobsLearnerDashboardRoute from './learner/jobs-learner-dashboard-route';
import JobsAdminApplicantsRoute from './admin/jobs-admin-applicants-route';

const helpers = common.util.helpers;
const UserAccess = helpers.UserAccess;

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin,
  Member
} = Roles;

class JobsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      centreRoles: [CentreTutor, CentreAdmin],
      adminRoles: [SiteAdmin, SuperAdmin],
      learnerRoles: [CentreLearner, Member]
    };
  }

  render() {
    const { adminRoles, learnerRoles } = this.state;
    return (
      <div>
        <UserAccess allowRoles={adminRoles}>
          <JobsAdminApplicantsRoute />
        </UserAccess>
        <UserAccess allowRoles={learnerRoles}>
          <JobsLearnerDashboardRoute />
        </UserAccess>
      </div>
    );
  }
}

const mapStateToProps = ({ job }) => ({
  job
});

export default connect(mapStateToProps)(JobsContainer);
