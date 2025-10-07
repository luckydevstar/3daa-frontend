import React from 'react';
import moment from 'moment';
import IconBadgeSCPLH from 'images/qualifications/qualification-scplh.png';
import IconBadgeSCPS from 'images/qualifications/qualification-scps.png';

const JobsAdminCardBack = ({ join_date }) => (
  <div className="jobs-admin-card back">
    <div className="name">Jame McFee</div>
    <div className="sub-title">Member {moment(join_date).toNow()}</div>
    <div className="level">Level one</div>
    <div className="main-info">
      <span>
        <b>Location:</b>
      </span>
      <span>Manchester</span>
    </div>
    <div className="main-info">
      <span>
        <b>Current Role:</b>
      </span>
      <span>Bar Manager</span>
    </div>
    <div className="main-info">
      <span>
        <b>Year of Exp:</b>
      </span>
      <span>3 Yrs</span>
    </div>
    <div className="main-info">
      <span>
        <b>Digital Awards:</b>
      </span>
      <span>2 Awards</span>
    </div>
    <div className="badges">
      <span>
        <img src={IconBadgeSCPS} alt="scps" />
      </span>
      <span>
        <img src={IconBadgeSCPLH} alt="scplh" />
      </span>
    </div>
    <div className="last-award-info">
      <p>Latest Award</p>
      <p className="award">
        SCPLH. Scottish Certificate for Personal Licence Holders
      </p>
    </div>
  </div>
);

export default JobsAdminCardBack;
