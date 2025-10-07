import React from 'react';
import common from 'app/common';

const { ProfileAvatar } = common.components;

const TesterInfo = () =>
  <div className="tester-info has-text-centered">
    <div className="avatar">
      <ProfileAvatar avatarSize={140} title={'Profile'} />
    </div>
    <h2 className="m-t-10 m-b-10">Tad Briason</h2>
    <span className="m-b-5">07 / 03 / 89</span>
    <a>View Full Profile</a>
  </div>;

export default TesterInfo;
