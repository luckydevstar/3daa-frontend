import React from 'react';
import { Route, IndexRoute } from 'react-router';

import containers from '../containers';

const {
  SelectQualification,
  ViewQualifications,
  Basket,
  Checkout,
  Accounts,
  AssignLicence
} = containers;

const StoreRoutes = (
  <Route path="store">
    <IndexRoute component={SelectQualification} />
    <Route path="course/(:qualificationId)" component={ViewQualifications} />
    <Route path="assign/(:qualificationId)" component={AssignLicence} />
    <Route path="basket" component={Basket} />
    <Route path="checkout" component={Checkout} />
    <Route path="accounts" component={Accounts} />
  </Route>
);

export default StoreRoutes;
