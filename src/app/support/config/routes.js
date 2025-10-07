import React from 'react';
import { IndexRoute, Route } from 'react-router';

import SupportRoute from '../containers/support-route';
import common from 'app/common';

const JobsRoutes = (
  <Route path="help-and-support" component={SupportRoute}>
    <IndexRoute component={common.components.UIUnderDevelopment} />
    <Route path="faq" component={common.components.UIUnderDevelopment} />
    <Route path="feedback" component={common.components.UIUnderDevelopment} />
  </Route>
);

export default JobsRoutes;
