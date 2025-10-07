import React from 'react';
import classNames from 'classnames';
import { Link, browserHistory } from 'react-router';
import common from 'app/common';
import { Text } from 'app/intl';
import { contains } from 'ramda';
import moment from 'moment';
import { RoleNameMap } from 'app/core/config/constants';
import CommunityProgressBadge from './community-progress-badge';
import ProgressBadge from '../../common/components/progress-badge/progress-badge';

const {
  isEmptySeat,
  isGroup,
  isLearner,
  createCloudinaryUrl,
  formatDate
} = common.util.helpers;

const CommunityCardItemBackGroup = ({ activeSection, itemData }) => {
  const {
    member_id,
    centre_roles,
    centre_name,
    roles,
    screen_name,
    media,
    date_of_birth,
    title,
    cloudinary_file_id,
    registration_number,
    town_city,
    learner_count,
    start_date,
    expected_completion_date,
    qualification_title,
    sector
  } = itemData;

  return (
    <div className="view">
      <div className="user-name">{title}</div>
      <div className="join-date">Member for 1 year</div>
      <div className="has-text-centered p-5">
        <span className="role-view">
          <Text iKey="Group" />
        </span>
      </div>
      <div className="sub-title m-t-20 m-b-10">{sector}</div>
      <div className="sub-content m-b-10">
        <span className="sub-text">Number of Learners</span>
        <span className="sub-text">{learner_count}</span>
      </div>
      <div className="sub-content m-b-10">
        <span className="sub-text">Start Date</span>
        <span className="sub-text">
          {start_date && formatDate(start_date, 'DD MMM YYYY')}
        </span>
      </div>
      <div className="sub-content m-b-10">
        <span className="sub-text">Expected Completion</span>
        <span className="sub-text">
          {expected_completion_date &&
            formatDate(expected_completion_date, 'DD MMM YYYY')}
        </span>
      </div>
      <div className="sub-title m-t-20 m-b-10 has-text-centered">
        {qualification_title}
      </div>
      <hr />
      <div className="tutor-info">
        {cloudinary_file_id && (
          <ProgressBadge
            image={cloudinary_file_id}
            dimensions={60}
            strokeWidth={3}
            percentage={0}
            strokeColorSecondary="rgba(0, 0, 0, .1)"
          />
        )}
        <div className="tutor-name">Tutor Name</div>
      </div>
    </div>
  );
};

export default CommunityCardItemBackGroup;
