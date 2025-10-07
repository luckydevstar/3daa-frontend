import React from 'react';
import { Route } from 'react-router';
// import BookstandRoute from '../containers/bookstand-route';
import QualificationsRoute from '../containers/qualifications-route';
import QualificationRoute from '../containers/qualification-route';
import { Roles } from 'app/core/config/constants';

// TODO move to common as container ???
import WorkbookPreview from 'app/workbooks/components/workbook-preview/workbook-preview';

const {
  SuperAdmin,
  SiteAdmin,
  CentreAdmin,
  CentreTutor,
  CentreLearner
} = Roles;

const WorkbookPreviewRoute = (
  <Route path="preview/(:unitId)/(:workbookId)" component={WorkbookPreview} />
);

const BookstandRoutes = (
  <Route>
    <Route
      path="bookstand"
      allowRoles={[
        SuperAdmin,
        SiteAdmin,
        CentreAdmin,
        CentreTutor,
        CentreLearner
      ]}
      component={QualificationsRoute}
    />
    <Route
      path="bookstand/preview/(:unitId)/(:workbookId)"
      component={WorkbookPreview}
    />
    <Route
      path="bookstand/assess/(:learnerId)"
      allowRoles={[
        // SuperAdmin,
        // SiteAdmin,
        CentreAdmin,
        CentreTutor
        // CentreLearner
      ]}
      component={props => (
        <QualificationsRoute
          {...props}
          isAssess
          learnerId={props.params.learnerId && parseInt(props.params.learnerId)}
        />
      )}
    >
      {WorkbookPreviewRoute}
    </Route>
  </Route>
);

export default BookstandRoutes;
