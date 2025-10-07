import React from 'react';
import { Route } from 'react-router';
import {
  JobsContainer,
  JobsAdminApplicantsRoute,
  JobsAdminApprenticeRoute,
  JobsAdminDraftRoute,
  JobsAdminNewRoute,
  JobsLearnerAllRoute,
  JobsLearnerSavedRoute,
  JobsLearnerAppliedRoute,
  JobsLearnerDashboardRoute,
  JobsMain
} from '../containers';

const JobsRoutes = (
  <Route component={JobsMain}>
    <Route path="jobs" component={JobsContainer} />

    <Route path="jobs/admin/applicants" component={JobsAdminApplicantsRoute} />
    <Route path="jobs/admin/apprent" component={JobsAdminApprenticeRoute} />
    <Route path="jobs/admin/draft" component={JobsAdminDraftRoute} />
    <Route path="jobs/admin/new" component={JobsAdminNewRoute} />

    <Route path="jobs/learner/all" component={JobsLearnerAllRoute} />
    <Route path="jobs/learner/saved" component={JobsLearnerSavedRoute} />
    <Route path="jobs/learner/applied" component={JobsLearnerAppliedRoute} />
    <Route
      path="jobs/learner/dashboard"
      component={JobsLearnerDashboardRoute}
    />
  </Route>
);

export default JobsRoutes;
