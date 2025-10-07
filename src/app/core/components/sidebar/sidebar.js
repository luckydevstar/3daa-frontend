import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import { contains, map } from 'ramda';
import Messaging from 'app/messaging';
import SidebarPane from './sidebar-pane';
import Notifications from 'app/notifications/components';
import { Creators as CoreCreators } from 'app/core/actions';
import SidebarFeatures from '../../constants';

import components from 'app/exams/components';

const { SideBarTask } = components;

const {
  components: { SideChat },
  constants: panes
} = Messaging;

export class Sidebar extends React.Component {
  constructor() {
    super();

    this.state = {
      secondarySidebar: null
    };

    this.tabSidebar = this.tabSidebar.bind(this);
  }

  getNavItems() {
    const {
      displayBeaconForMessaging,
      displayBeaconForNotifications,
      displayBeaconForCalendar
    } = this.props;

    return [
      SidebarFeatures.MESSAGING,
      SidebarFeatures.CALENDAR,
      SidebarFeatures.NOTIFICATIONS
    ].map(feature => {
      return (
        <a
          onClick={() => this.tabSidebar(feature)}
          className={classNames('item', feature, {
            active: this.props.sidebarFeature === feature
          })}
          key={feature}
        >
          {feature}
          {feature === 'messaging' && (
            <Notifications.Beacon displayBeacon={displayBeaconForMessaging} />
          )}
          {feature === 'notifications' && (
            <Notifications.Beacon
              displayBeacon={displayBeaconForNotifications}
            />
          )}
          {feature === 'calendar' && (
            <Notifications.Beacon displayBeacon={displayBeaconForCalendar} />
          )}
        </a>
      );
    });
  }

  tabSidebar(feature) {
    const { currentLocation, openSidebarFeature, toggleSidebar } = this.props;

    if (
      contains('messaging', currentLocation) &&
      feature === SidebarFeatures.MESSAGING
    ) {
      toggleSidebar();
    } else {
      openSidebarFeature(feature);
    }
  }

  getPrimarySidebarClasses(feature) {
    return classNames('app-sidebar-feature', feature, {
      active: this.props.sidebarFeature === feature
    });
  }

  render() {
    const { newChat, chatSelected, backToChats, toggleSidebar } = this.props;

    return (
      <aside className="app-sidebar">
        <nav className="">
          <div className="navbar-brand">{this.getNavItems()}</div>
          {/*<div className="navbar-end">*/}
          {/*<a className="item close" onClick={toggleSidebar}>*/}
          {/*close*/}
          {/*</a>*/}
          {/*</div>*/}
        </nav>
        <section
          className={this.getPrimarySidebarClasses(SidebarFeatures.MESSAGING)}
        >
          <SideChat />
        </section>

        <section
          className={this.getPrimarySidebarClasses(
            SidebarFeatures.NOTIFICATIONS
          )}
        >
          <Notifications.AllNotifications />
        </section>
        <section
          className={this.getPrimarySidebarClasses(SidebarFeatures.CALENDAR)}
        >
          <div className="custom-calender">{/* <SideBarTask /> */}</div>
        </section>
        <section
          className={this.getPrimarySidebarClasses(SidebarFeatures.NEWSFEED)}
        />
      </aside>
    );
  }
}

Sidebar.propTypes = {
  currentLocation: PropTypes.string
};

Sidebar.defaultProps = {
  currentLocation: ''
};

//
// Sidebar Container
//
const mapStateToProps = ({
  ui: { sidebarOpen, sidebarFeature, sidebarPane },
  interactions
}) => {
  const displayBeaconForNotifications =
    interactions.filter(item => item.meta.event !== 'message' && !item.isRead)
      .length > 0;
  const displayBeaconForMessaging =
    interactions.filter(item => item.meta.event === 'message' && !item.isRead)
      .length > 0;
  const displayBeaconForCalendar =
    interactions.filter(item => item.meta.event !== 'calendar' && !item.isRead)
      .length > 0;
  return {
    sidebarOpen,
    sidebarFeature,
    sidebarPane,
    displayBeaconForNotifications,
    displayBeaconForMessaging,
    displayBeaconForCalendar
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chatSelected: () => dispatch(CoreCreators.sidebarPane(panes.CHAT)),
    backToChats: () => dispatch(CoreCreators.sidebarPane(panes.CHATS)),
    newChat: () => dispatch(CoreCreators.sidebarPane(panes.CONTACTS)),
    toggleSidebar: () => dispatch(CoreCreators.toggleSidebar()),
    openSidebarFeature: feature =>
      dispatch(CoreCreators.sidebarFeature(feature))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
