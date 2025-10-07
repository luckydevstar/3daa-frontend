import React from 'react';
import { connect } from 'react-redux';
import common from 'app/common';
import NotificationItem from './notification-item';

const TimedDestruct = common.components.TimedDestruct;

const NewNotifications = ({ sidebarOpen, newItems }) =>
  <div className="new-notifications">
    {!sidebarOpen &&
      newItems.map(
        item =>
          !item.isRead
            ? <TimedDestruct duration={10000}>
                <NotificationItem {...{ item }} isNew />
              </TimedDestruct>
            : null
      )}
  </div>;

const mapStateToProps = ({ ui, interactions }) => {
  return {
    sidebarOpen: ui.sidebarOpen,
    newItems: interactions.filter(
      item => item.meta.event !== 'message' && item.isNew
    )
  };
};

export default connect(mapStateToProps, () => ({}))(NewNotifications);
