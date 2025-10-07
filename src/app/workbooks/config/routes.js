import React from 'react';
import { Route, IndexRoute } from 'react-router';
import WorkbookPreview from '../components/workbook-preview/workbook-preview';
// import WorkbooksExplorer from '../containers/workbooks-explorer';
import WorkbooksRoute from '../containers/workbooks-route';
// import WorkbooksAssessWorkbooksRoute
//   from '../containers/workbooks-assess-workbooks-route';
import WorkbooksQualificationManagerRoute
  from '../containers/workbooks-qualification-manager-route';
import { Roles } from 'app/core/config/constants';

const {
  CentreAdmin,
  CentreTutor
  // SiteAdmin,
  // SuperAdmin,
  // CentreLearner
} = Roles;

const WorkbooksRoutes = (
  <Route>
    <Route
      path="workbooks/qualification-manager"
      component={WorkbooksRoute}
      allowRoles={[CentreAdmin]}
    >
      {/* <IndexRoute
        component={WorkbooksExplorer}
        allowRoles={[
          SiteAdmin,
          SuperAdmin,
          // CentreAdmin,
          // CentreTutor,
          CentreLearner
        ]}
      /> */}
      {/* <Route
        allowRoles={[CentreAdmin, CentreTutor]}
        path="assess-workbooks"
        component={WorkbooksAssessWorkbooksRoute}
      >
        <Route
          path="(:learnerID)"
          component={WorkbooksExplorer}
          allowRoles={[CentreAdmin, CentreTutor]}
        />
      </Route> */}
      {/* <Route
        allowRoles={[CentreAdmin, CentreTutor]}
        path="qualification-manager"
        component={WorkbooksQualificationManagerRoute}
      /> */}
      <IndexRoute component={WorkbooksQualificationManagerRoute} />
      <Route
        path="(:qualificationID)"
        component={WorkbooksQualificationManagerRoute}
      >
        <Route
          path="preview/(:unitId)/(:workbookId)"
          component={WorkbookPreview}
        />
      </Route>
      {/* <Route
        allowRoles={[CentreAdmin, CentreTutor]}
        path="preview/:unitId/:workbookId/:learnerID"
        component={WorkbookPreview}
      /> */}
    </Route>
  </Route>
);

export default WorkbooksRoutes;
