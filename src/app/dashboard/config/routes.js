import React from 'react';
import { Route } from 'react-router';

import DashboardContainer from '../containers/dashboard-container';
import DashboardRoute from '../containers/dashboard-route';
import DashboardReporting from '../containers/dashboard-reporting';

const DashboardRoutes = (
  <Route>
    <Route path="dashboard" component={DashboardContainer} />
    <Route path="dashboard-new" component={DashboardRoute} />
    <Route path="dashboard-report" component={DashboardReporting} />
  </Route>
);

export default DashboardRoutes;
