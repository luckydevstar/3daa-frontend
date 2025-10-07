import React from 'react';
import { Route } from 'react-router';

import InfoRoute from '../containers/info-route';
import { Cookies, Terms, Privacy } from '../components';

const InfoRoutes = (
  <Route component={InfoRoute}>
    <Route path="terms-and-use" component={Terms} />
    <Route path="privacy" component={Privacy} />
    <Route path="cookie" component={Cookies} />
  </Route>
);

export default InfoRoutes;
