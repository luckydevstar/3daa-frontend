import React from 'react';
import { IndexRoute, Route } from 'react-router';

import ProfileRoute from '../containers/profile-route';

const ProfileRoutes = (
  <Route path="profile">
    <IndexRoute component={ProfileRoute} />
    <Route
      path="(:memberId)(/:activeTab)"
      component={props => (
        <ProfileRoute
          memberId={props.params.memberId && parseInt(props.params.memberId)}
          activeTab={props.params.activeTab}
        />
      )}
    />
  </Route>
);

export default ProfileRoutes;
