import React from 'react';
import DashboardLearnersListItem from './dashboard-list-item-learner';
import DashboardCentreSeatListItem from './dashboard-list-item-center-seat';

const DashboardList = props => {
  const { users, type } = props;

  const listItemComponents = {
    learner: DashboardLearnersListItem,
    centreSeat: DashboardCentreSeatListItem
  };

  const Component = listItemComponents[type];

  return !users.length
    ? <div className="not-found-message">No seats found.</div>
    : <div className="dashboard-list">
        {users.map(user => (
          <Component
            key={type === 'learner' ? user.member_id : user.registration_number}
            {...{ user }}
          />
        ))}
      </div>;
};

export default DashboardList;
