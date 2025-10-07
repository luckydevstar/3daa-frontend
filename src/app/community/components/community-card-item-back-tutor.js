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
    centre_address,
    roles,
    screen_name,
    media,
    cloudinary_file_id,
    registration_number,
    town_city,
    number_of_learners
  } = itemData;

  return (
    <div className="view">
      <div className="user-name">{screen_name}</div>
      <div className="join-date">Member for 1 year</div>
      <div className="has-text-centered p-5">
        <span className="role-view">
          <Text iKey="Tutor" />
        </span>
      </div>
      {/* <div className="sub-content m-t-20 m-b-10">
        <span className="sub-title opensans-regular">Sector coverage</span>
        <span className="sub-title opensans-regular">Learners</span>
      </div>
      <div className="sub-content m-b-10">
        <span className="sub-text opensans-regular">Construction</span>
        <span className="sub-text opensans-regular">36</span>
      </div>
      <div className="sub-content m-b-10">
        <span className="sub-text opensans-regular">Engineering</span>
        <span className="sub-text opensans-regular">9</span>
      </div>
      <div className="sub-content m-b-10">
        <span className="sub-text opensans-regular">Automotive</span>
        <span className="sub-text opensans-regular">2</span>
      </div>
      <div className="sub-content m-t-10">
        <span className="sub-title opensans-regular">Total Learners</span>
        <span className="sub-title opensans-regular">14</span>
      </div> */}
      <hr />
      <div className="view-centre opensans-regular" onClick={() => {}}>
        <span>
          <u>View Centre</u>
        </span>
      </div>
      <div className="sub-title m-t-15 m-b-5 opensans-regular">
        {centre_name}
      </div>
      {centre_address && (
        <div className="sub-title m-t-15 m-b-5 opensans-regular">
          {`${centre_address.address_line_1}, ${centre_address.city}`}
        </div>
      )}
    </div>
  );
};

export default CommunityCardItemBackTutor;
