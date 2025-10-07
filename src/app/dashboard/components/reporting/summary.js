import React from 'react';
import Isvg from 'react-inlinesvg';
import { Link } from 'react-router';

import IconBrands from 'images/icon_brands.svg';
import IconTrainingProviders from 'images/icon_training_providers.svg';
import IconTutors from 'images/icon_tutors.svg';
import IconEmployers from 'images/icon_employers.svg';
import IconManagers from 'images/icon_managers.svg';
import IconInternalVerification from 'images/icon_internal_verification.svg';

const DashboardReportSummary = ({ userSummary }) => (
  <div className="dashboard-report-summary columns m-20">
    {/* <div className="column">
      <div className="box">
        <Isvg src={IconBrands} />
        <span>Brands</span>
        <span>07</span>
      </div>
    </div> */}
    <div className="column">
      <Link to="/community/centre-admins">
        <div className="box">
          <Isvg src={IconTrainingProviders} />
          <span>Centre</span>
          <span className="is-primary">
            {userSummary && userSummary.centres}
          </span>
        </div>
      </Link>
    </div>
    <div className="column">
      <Link to="/community/centre-tutors">
        <div className="box">
          <Isvg src={IconTutors} />
          <span>Tutors</span>
          <span>{userSummary && userSummary.tutors}</span>
        </div>
      </Link>
    </div>
    <div className="column">
      <Link to="/community/learners">
        <div className="box">
          <Isvg src={IconEmployers} />
          <span>Learners</span>
          <span>{userSummary && userSummary.learners}</span>
        </div>
      </Link>
    </div>
    <div className="column">
      <Link to="/community/centre-tutors">
        <div className="box">
          <Isvg src={IconManagers} />
          <span>Employers</span>
          <span>{userSummary && userSummary.employers}</span>
        </div>
      </Link>
    </div>
    <div className="column">
      <Link to="/community/eqas">
        <div className="box">
          <Isvg src={IconInternalVerification} />
          <span>EQAs</span>
          <span>{userSummary && userSummary.eqa}</span>
        </div>
      </Link>
    </div>
  </div>
);

export default DashboardReportSummary;
