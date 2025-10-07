import React from 'react';
import { connect } from 'react-redux';
import { isEmpty, pickAll } from 'ramda';
import { browserHistory } from 'react-router';
import { notifyWarn } from 'app/common/util/notify';
import LoginRoute from '../containers/login/login-route';
import AccessDenied from '../containers/access-denied';
import common from 'app/common';
import checkForRedirectPath from 'app/user/config/redirects';

const checkRolesAndPermissions = common.util.helpers.checkRolesAndPermissions;

class ProtectedRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accessAllowed: false
    };
  }

  UNSAFE_componentWillMount() {
    if (this.props.user) {
      this.checkRoute(this.props);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const keys = ['token', 'location'];
    const changedProps = pickAll(keys, nextProps);
    const userLoaded = nextProps.user !== null && this.props.user === null;

    if (!isEmpty(changedProps) || userLoaded) {
      this.checkRoute({
        ...this.props,
        ...changedProps,
        user: nextProps.user,
        router: nextProps.router
      });
    }
  }

  checkRoute(props) {
    const { token, user, location } = props;

    if (token) {
      const newPath = checkForRedirectPath(user, location.pathname);
      if (newPath) browserHistory.replace(newPath);
    }

    this.setState({
      accessAllowed: this.permissionsValid(props)
    });
  }

  permissionsValid(props) {
    const { user, router } = props;
    const routes = router.routes.filter(
      route => route.allowRoles || route.allowPermissions
    );

    for (const route of routes) {
      const { allowRoles, allowPermissions } = route;

      if (!checkRolesAndPermissions(user, allowRoles, allowPermissions)) {
        return false;
      }
    }
    return true;
  }

  render() {
    const { token, user, hydrated, needLoginNotification } = this.props;
    const { accessAllowed } = this.state;
    if (!token) {
      if (hydrated) {
        needLoginNotification();
      }
      return <LoginRoute />;
    } else if (user) {
      // Check permissions
      // if (accessAllowed) {
      return this.props.children;
      // }
      // return <AccessDenied />;
    }

    return <div />;
  }
}

/**
 * Redux mappings
 */
const mapStateToProps = state => {
  return {
    token: state.persisted.token,
    user: state.profile.user,
    hydrated: state.auth.hydrated
  };
};

const mapDispatchToProps = dispatch => {
  return {
    needLoginNotification: () => {
      dispatch(notifyWarn('You need to be logged in to view this page.'));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedRoute);
