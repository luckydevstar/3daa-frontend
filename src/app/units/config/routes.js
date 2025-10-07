import React from 'react';
import { Route } from 'react-router';

import UnitsRoute from '../containers/units-route';
import UnitDetailsRoute from '../containers/unit-details-route';

const UnitsRoutes = (
  <Route>
    <Route path="units" component={UnitsRoute} />
    <Route path="units/:id" component={UnitDetailsRoute} />
  </Route>
);

export default UnitsRoutes;
