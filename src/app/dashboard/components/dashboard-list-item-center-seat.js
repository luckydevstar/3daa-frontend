import React from 'react';
import common from 'app/common';
import ProgressBadge from '../../common/components/progress-badge/progress-badge';

import { Text } from 'app/intl';

const { util: { helpers: { getCommunityProfilePhotoUrl } } } = common;

const DashboardCentreSeatListItem = props => {
  const { user } = props;
  const { registration_number, date_of_birth } = user;

  const profilePhotoUrl = getCommunityProfilePhotoUrl(user);

  return (
    <div className="dashboard-list-item-container centre-seat">
      <div
        className="dashboard-list-item progress-badge"
        key={registration_number}
      >
        <ProgressBadge
          {...{
            percentage: 0,
            image: profilePhotoUrl,
            dimensions: 75
          }}
        />
      </div>
      <div className="dashboard-list-item name">
        <div className="border-wrapper">
          <Text iKey="empty_seat" />
        </div>
      </div>
      <div className="dashboard-list-item seat-info">
        <div className="reg-number">
          <Text iKey="registration_number" />: {registration_number}
        </div>
        <div className="date-of-birth">
          <Text iKey="date_of_birth" />: {date_of_birth}
        </div>
      </div>
    </div>
  );
};

export default DashboardCentreSeatListItem;
