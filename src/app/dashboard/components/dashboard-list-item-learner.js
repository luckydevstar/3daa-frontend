import React from 'react';
import common from 'app/common';
import ProgressBadge
  from '../../common/components/progress-badge/progress-badge';
import { Link } from 'react-router';

const { util: { helpers: { getCommunityProfilePhotoUrl } } } = common;

const DashboardLearnersListItem = props => {
  const { user } = props;
  const {
    screen_name,
    member_id,
    current_qualification: { progress_percentage, short_title }
  } = user;

  const profilePhotoUrl = getCommunityProfilePhotoUrl(user);

  return (
    <Link to={`/profile/${member_id}`} className="dashboard__link-to-profile">
      <div className="dashboard-list-item-container">
        <div className="dashboard-list-item progress-badge">
          <ProgressBadge
            {...{
              percentage: progress_percentage,
              image: profilePhotoUrl
            }}
          />
        </div>
        <div className="dashboard-list-item name">
          <div className="border-wrapper">{screen_name}</div>
        </div>
        <div className="dashboard-list-item sector">
          {short_title || 'n/a'}
        </div>
        <div className="dashboard-list-item list-progress">
          {Math.round(progress_percentage || 0)}%
        </div>
      </div>
    </Link>
  );
};

export default DashboardLearnersListItem;
