import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { random } from 'app/common/util/helpers';
import { Creators } from 'app/notifications/actions';
import NotificationItem from './notification-item';
import EmptyIcon from 'images/icon_nonotification.svg';

import { Text } from 'app/intl';

class AllNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requested: false
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { sidebarFeature, getMemberNotifications } = nextProps;
    if (sidebarFeature === 'notifications' && !this.state.requested) {
      getMemberNotifications();
      this.setState({ requested: true });
    }
  }

  render() {
    const { notifications } = this.props;
    return (
      <div className="all-notifications notifications">
        {notifications.map(item => {
          return (
            <NotificationItem {...{ item }} key={random(0, 1000, false)} />
          );
        })}
        {notifications.length === 0 && (
          <div className="empty-view p-b-20">
            <img
              alt="no notifications"
              src={EmptyIcon}
              className="empty-icon"
            />
            <Text iKey="msg_have_any_notifications" />
          </div>
        )}
      </div>
    );
  }
}

AllNotifications.PropTypes = {
  interactions: PropTypes.array
};

AllNotifications.defaultProps = {
  interactions: []
};

const mapStateToProps = ({ ui, interactions }) => {
  const { sidebarFeature } = ui;
  const notifications = interactions.filter(
    item => item.meta.event !== 'message'
  );
  return {
    notifications,
    sidebarFeature
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getMemberNotifications: () =>
      dispatch(Creators.getMemberNotificationsAttempt())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllNotifications);
