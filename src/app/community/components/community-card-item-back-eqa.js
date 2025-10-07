import React from 'react';
import classNames from 'classnames';
import { Link, browserHistory } from 'react-router';
import common from 'app/common';
import { Text } from 'app/intl';
import { contains } from 'ramda';
import moment from 'moment';
import { RoleNameMap } from 'app/core/config/constants';

const {
  isEmptySeat,
  isGroup,
  isLearner,
  createCloudinaryUrl
} = common.util.helpers;

const CommunityCardItemBackTutor = ({ activeSection, itemData }) => {
  const {
    member_id,
    centre_roles,
    centre_name,
    roles,
    screen_name,
    media,
    cloudinary_file_id,
    town_city,
    number_of_learners,
    total_centre_learners,
    centres_per_sector
  } = itemData;

  let construction, engineering;
  try {
    let sectorsArray = Object.values(centres_per_sector.sectors);
    construction = sectorsArray[0].centres;
    engineering = sectorsArray[1].centres;
  } catch (e) {}

  return (
    <div className="view">
      <div className="user-name">{screen_name}</div>
      <div className="join-date">Member for 1 year</div>
      <div className="has-text-centered p-5">
        <span className="role-view is-secondary">
          {activeSection === 'iqas' ? 'IQA' : <Text iKey="EQA" />}
        </span>
      </div>
      <div className="sub-content m-t-20 m-b-10">
        <span className="sub-title">Sector coverage</span>
        <span className="sub-title">Centres</span>
      </div>
      <div className="sub-content m-b-10">
        <span className="sub-text">Construction</span>
        <span className="sub-text">{construction}</span>
      </div>
      <div className="sub-content m-b-10">
        <span className="sub-text">Engineering</span>
        <span className="sub-text">{engineering}</span>
      </div>
      <div className="sub-content m-t-20">
        <span className="sub-title">Total Learners</span>
        <span className="sub-title">{total_centre_learners}</span>
      </div>
    </div>
  );
};

export default CommunityCardItemBackTutor;
