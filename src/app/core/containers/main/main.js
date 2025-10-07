/* global window */
import React from 'react';
import Portal from 'react-portal';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Notify } from 'react-redux-notify';
import MobileDetect from 'mobile-detect';
import Responsive from 'react-responsive-decorator';
import cx from 'classnames';
import Intercom from 'react-intercom';
import { contains } from 'ramda';
import config from 'brand/config';
import { Roles } from 'app/core/config/constants';

import { MIN_WINDOW_WIDTH } from 'app/core/config/constants';
import AppHeader from 'app/core/components/header/app-header';
import Notifications from 'app/notifications/components';
import PusherSubscribe from '../../../realtime-services/components/pusher-subscribe';
import Sidebar from 'app/core/components/sidebar/sidebar';
import Common from 'app/common';

const {
  util: {
    helpers: { extractUserRole }
  },
  components: { UIPageNotSupported, UILoading }
} = Common;

const { CentreEditor } = Roles;

const mainClasses = (menuOpen, sidebarOpen, appLoading, isPageNotSupported) =>
  cx('app-container', {
    'app-menu-open': menuOpen,
    'app-sidebar-open': sidebarOpen,
    'is-mobile': !!new MobileDetect(window.navigator.userAgent).mobile(),
    'is-desktop': !new MobileDetect(window.navigator.userAgent).mobile(),
    'is-not-supported': isPageNotSupported,
    'app-loading': appLoading
  });

const formatDataForIntercom = (user, isIntercom) => ({
  appID: config.INTERCOM_APP_ID,
  user_id: user.member_id,
  email: user.email,
  name: user.screen_name,
  hide_default_launcher: isIntercom
});

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPageNotSupported: false
    };
    this.executeMediaQueries = this.executeMediaQueries.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.executeMediaQueries(this.props));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !this.props.user &&
      nextProps.user &&
      this.props.location.pathname === '/'
    ) {
      browserHistory.replace('/dashboard');
    }

    const locationChanged =
      this.props.location.pathname !== nextProps.location.pathname;
    if (locationChanged) {
      this.executeMediaQueries(nextProps);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.executeMediaQueries(this.props));
  }

  executeMediaQueries(props) {
    const currentLocation = props.location.pathname;
    const checkResponsive =
      currentLocation === '/' ||
      contains('/register', currentLocation) ||
      currentLocation === '/login';
    props.media({ minWidth: MIN_WINDOW_WIDTH }, () => {
      this.setState({
        isPageNotSupported: false
      });
    });

    props.media({ maxWidth: MIN_WINDOW_WIDTH - 1 }, () => {
      this.setState({
        isPageNotSupported: !checkResponsive
      });
    });
  }

  render() {
    const { isPageNotSupported } = this.state;

    const {
      profileMenuOpen,
      sidebarOpen,
      appLoading,
      location,
      routes,
      children,
      user,
      online,
      attemptingToLogin
    } = this.props;

    let isIntercom = contains('/store', location.pathname);
    // if( contains('/dashboard', location.pathname) && user.roles && contains("TUTOR_ROLE", user.roles)) {
    //   isIntercom = true;
    // }

    return (
      <div
        className={mainClasses(
          profileMenuOpen,
          sidebarOpen,
          appLoading,
          isPageNotSupported
        )}
      >
        {/* Intercom messaging component */}
        {user && <Intercom {...formatDataForIntercom(user, isIntercom)} />}

        {/* Notifications system component */}
        <Notify />

        {/* Loading */}
        <UILoading isAppOverlay largeIcon />

        {/* Header */}
        <AppHeader currentLocation={location.pathname} routes={routes} />

        {/* Main */}
        <main className="main-container" role="main">
          {/* Content area */}
          <div className="ie10-fix">
            {attemptingToLogin ? (
              <UILoading isLoadingOverlay alignMiddle height100vh largeIcon />
            ) : (
              <section className="content-container">
                <div className="content-inner">{children}</div>
              </section>
            )}

            {/* Sidebar */}
            {user && <Sidebar currentLocation={location.pathname} />}

            {/* Display new notifications briefly the moment they arrive */}
            {user && <Notifications.NewNotifications />}

            {online && <PusherSubscribe currentLocation={location.pathname} />}

            {/* Overlay */}
            <div className="app-overlay" />
          </div>
        </main>

        {/* Window size not supported */}
        {isPageNotSupported && (
          <Portal isOpened>
            <UIPageNotSupported />
          </Portal>
        )}
      </div>
    );
  }
}

/**
 * Redux mappings
 */
const mapStateToProps = state => {
  const {
    ui: { profileMenuOpen, sidebarOpen, appLoading },
    auth: { attemptingToLogin },
    profile: { user },
    realtimeServices: { online }
  } = state;
  return {
    profileMenuOpen,
    sidebarOpen,
    appLoading,
    user,
    online,
    attemptingToLogin
  };
};

export default Responsive(connect(mapStateToProps)(Main));
