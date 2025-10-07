import React from 'react';
import { IndexRoute, Route } from 'react-router';
import containers from '../containers';

const { ExamStaff, ExamScreen } = containers;

const ExamRoutes = (
  <Route path="test">
    <IndexRoute component={ExamStaff} />
    <Route path="start" component={ExamScreen} />
  </Route>
);

export default ExamRoutes;
