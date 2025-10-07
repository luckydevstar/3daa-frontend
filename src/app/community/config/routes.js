import React from 'react';
import CommunityExplorer from '../containers/community-explorer';
import { Route, IndexRoute } from 'react-router';
import { Roles } from 'app/core/config/constants';

import ExportManagerNewReport from '../components/export-manager/new-report';
import ExportManagerReportsArchive from '../components/export-manager/reports-archive';
import ExportManager from '../components/export-manager';

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  CentreEQA,
  CentreIQA,
  SuperAdmin,
  SiteAdmin
} = Roles;

const TEST = () => <div>TEST</div>;

const CommunityRoutes = (
  <Route path="community/" component={CommunityExplorer}>
    <Route
      path="centre-admins"
      routeRole={CentreAdmin}
      userType="centre"
      oldApi
      allowRoles={[
        CentreAdmin,
        CentreTutor,
        CentreLearner,
        SuperAdmin,
        SiteAdmin
      ]}
    />
    <Route
      path="centre-tutors"
      routeRole={CentreTutor}
      userType="centre"
      oldApi
      allowRoles={[
        CentreAdmin,
        CentreTutor,
        CentreLearner,
        SuperAdmin,
        SiteAdmin
      ]}
    />
    <Route
      path="learners"
      routeRole={CentreLearner}
      userType="centre"
      allowRoles={[CentreAdmin, CentreTutor, SuperAdmin, SiteAdmin]}
    />
    <Route path="seats" userType="centreSeats" allowRoles={[CentreAdmin]} />
    {/* Disable friends route temporarily
    <Route path="friends" userType="member" /> */}
    <Route
      path="site-admins"
      routeRole={SiteAdmin}
      userType="site-admin"
      allowRoles={[SuperAdmin, SiteAdmin]}
    />
    <Route
      path="super-admins"
      routeRole={SuperAdmin}
      userType="super-admin"
      allowRoles={[SuperAdmin]}
    />
    <Route
      path="groups"
      allowRoles={[SuperAdmin, SiteAdmin, CentreAdmin, CentreTutor]}
    >
      <IndexRoute userType="groups" />
      <Route userType="group" path=":groupID" />
    </Route>
    <Route
      path="iqas"
      routeRole={CentreIQA}
      userType="eqa"
      allowRoles={[SuperAdmin, CentreIQA]}
    />
    <Route
      path="eqas"
      routeRole={CentreEQA}
      userType="eqa"
      allowRoles={[SuperAdmin, CentreEQA]}
    />
    <Route
      path="awaiting_users"
      userType="awaiting_user"
      allowRoles={[SuperAdmin, SiteAdmin, CentreAdmin]}
    />
    <Route path="export_manager">
      <IndexRoute component={ExportManager} />
      <Route path="new-report" component={ExportManagerNewReport} />
      <Route path="archive" component={ExportManagerReportsArchive} />
    </Route>
  </Route>
);

export default CommunityRoutes;
