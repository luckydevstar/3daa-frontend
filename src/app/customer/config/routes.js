import React from 'react';
import { Route, IndexRoute } from 'react-router';

import {
  CustomerAddRoute,
  CustomerLogoRoute,
  CustomerFontsRoute,
  CustomerColorRoute,
  CustomerAssetsRoute,
  CustomerSummaryRoute,
  CustomersList,
  CustomerMain
} from '../containers';

const CustomerRoutes = (
  <Route path="customer">
    <IndexRoute component={CustomersList} />
    <Route component={CustomerMain}>
      <Route path="add" component={CustomerAddRoute} />
      <Route path="logo" component={CustomerLogoRoute} />
      <Route path="fonts" component={CustomerFontsRoute} />
      <Route path="colours" component={CustomerColorRoute} />
      <Route path="assets" component={CustomerAssetsRoute} />
      <Route path="summary" component={CustomerSummaryRoute} />
    </Route>
  </Route>
);

export default CustomerRoutes;
