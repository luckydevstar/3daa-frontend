import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Roles } from 'app/core/config/constants';
import FinanceCentresRoute from '../containers/finance-centres-route';
import FinanceCentreAccountsRoute from '../containers/finance-centre-accounts-route';

const { Finance } = Roles;

const FinanceRoutes = (
  <Route>
    <Route
      path="finance"
      allowRoles={[Finance]}
      component={FinanceCentresRoute}
    />
    <Route
      path="finance/accounts/(:centreId)"
      allowRoles={[Finance]}
      component={FinanceCentreAccountsRoute}
    />
  </Route>
);

export default FinanceRoutes;
