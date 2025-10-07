import React from 'react';
import { IndexRoute, Route } from 'react-router';

import { UserConflictList } from '../containers';

const UserConflictRoutes = (
  <Route path="user-conflict">
    <IndexRoute component={UserConflictList} />
  </Route>
);
export default UserConflictRoutes;
