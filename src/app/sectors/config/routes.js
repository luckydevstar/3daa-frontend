import React from 'react';
import { Route, IndexRoute } from 'react-router';

import SectorsRoute from '../containers/sectors-route';

const SectorsRoutes = (
  <Route>
    <IndexRoute component={SectorsRoute} />
    <Route path="sectors" component={SectorsRoute} />
  </Route>
);

export default SectorsRoutes;
