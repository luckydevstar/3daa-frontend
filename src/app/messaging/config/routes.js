import React from 'react';
import { Route } from 'react-router';
import containers from '../containers';

const MessagingRoutes = (
  <Route path="messaging" component={containers.MessageLayout} />
);

export default MessagingRoutes;
