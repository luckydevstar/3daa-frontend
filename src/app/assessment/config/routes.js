import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Roles } from 'app/core/config/constants';
// import { GalleryEvidenceRoute, QualificationProgressRoute } from '../containers';

import AssessmentSelectUserRoute from '../containers/assessment-select-user-route';
import GalleryEvidenceRoute from '../containers/gallery-evidence-route';
import QualificationProgressRoute from '../containers/qualification-progress-route';
import UnitProgressRoute from '../containers/unit-progress-route';
import ActionPlanRoute from '../containers/action-plan-route';

const {
  SuperAdmin,
  SiteAdmin,
  CentreAdmin,
  CentreTutor,
  CentreLearner
} = Roles;

const AssessmentToolRoutes = (
  <Route>
    <IndexRoute component={AssessmentSelectUserRoute} />
    <Route
      path="assessment/assessment-progress"
      component={AssessmentSelectUserRoute}
    />
    <Route
      path="assessment/gallery-evidence"
      component={GalleryEvidenceRoute}
    />
    <Route
      path="assessment/qualification-progress"
      component={QualificationProgressRoute}
    />
    <Route path="assessment/unit-progress" component={UnitProgressRoute} />
    <Route path="assessment/action-plan" component={ActionPlanRoute} />
  </Route>
);

export default AssessmentToolRoutes;

// <Route
//       path="assessment/action-plan"
//       component={ActionPlanRoute}
//     />
