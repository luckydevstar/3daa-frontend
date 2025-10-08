import React, { useEffect } from 'react';
// import { Router } from "@reach/router";
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import user from 'app/user';
import jobs from 'app/jobs';
import support from 'app/support';
import dashboard from 'app/dashboard';
import workbooks from 'app/workbooks';
import video from 'app/video';
import units from 'app/units';
import community from 'app/community';
import info from 'app/info';
import common from 'app/common';
import profile from 'app/profile';
import messaging from 'app/messaging';
import PairingWheel from 'app/pairing-wheel';

import qualifications from 'app/qualifications';

// Version 2
import bookstand from 'app/bookstand1';
import exam from 'app/exams';
import customer from 'app/customer';
import news from 'app/news';
import sectors from 'app/sectors';
import storeModule from 'app/store';
import assessment from 'app/assessment';
import finance from 'app/finance';
import userConflict from 'app/user-conflict';

import ProtectedRoute from 'app/user/config/protected-route';

// For testing
import development from 'app/under-development';

import Main from '../containers/main/main';
import Home from '../../__new/home/index';
import Contact from '../../__new/contact/index';
import About from '../../__new/about/index';

/**
 * Extract module routes
 */
const UserRoutes = user.routes;
const DashboardRoutes = dashboard.routes;
const VideoRoutes = video.routes;
const WorkbooksRoutes = workbooks.routes;
const UnitsRoutes = units.routes;
const QualificationsRoutes = qualifications.routes;
const CommunityRoutes = community.routes;
const JobsRoutes = jobs.routes;
const SupportRoutes = support.routes;
const InfoRoutes = info.routes;
const ProfileRoutes = profile.routes;
const MessagingRoutes = messaging.routes;
const UIPageNotSupported = common.components.UIPageNotSupported;
const StoreRoutes = storeModule.routes;
// Version 2
const BookstandRoutes = bookstand.routes;
const ExamRoutes = exam.routes;
const CustomerRoutes = customer.routes;
const NewsRoutes = news.routes;
const SetorsRoutes = sectors.routes;
const AssessmentRoutes = assessment.routes;
const Finance = finance.routes;
const PairingWheelRoutes = PairingWheel.routes;
const UserConflictRoutes = userConflict.routes;

const Routes = store => {
  return (
    <Router history={syncHistoryWithStore(browserHistory, store)}>
      <Route path="/" component={Main}>
        <IndexRoute component={Home}></IndexRoute>
        <Route path="contact" component={Contact} />
        <Route path="about" component={About} />

        {UserRoutes}
        {InfoRoutes}
        {/* Primary app routes (authenticated) */}
        <Route component={ProtectedRoute}>
          <Route allowRoles={['SUPER_ADMIN']}>{DashboardRoutes}</Route>
          {VideoRoutes}
          {UnitsRoutes}
          {CommunityRoutes}
          {JobsRoutes}
          {MessagingRoutes}
          {SupportRoutes}
          {ProfileRoutes}
          {BookstandRoutes}
          {WorkbooksRoutes}
          {CustomerRoutes}
          {NewsRoutes}
          {QualificationsRoutes}
          {StoreRoutes}
          {SetorsRoutes}
          {AssessmentRoutes}
          {Finance}
          {PairingWheelRoutes}
          {UserConflictRoutes}
          <Route path="under-development" component={development.Route} />
          <Route
            path="under-development/profile"
            component={development.Profile}
          />
        </Route>
      </Route>
      {ExamRoutes}
      <Route path="*" component={UIPageNotSupported} />
    </Router>
  );
};

export default Routes;
