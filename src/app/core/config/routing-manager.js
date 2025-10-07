import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Creators as UserActions } from 'app/user/actions';
import checkForRedirectPath from 'app/user/config/redirects';

class RoutingManager extends React.Component {
  constructor(props) {
    super(props);
    this.redirecting = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { token, user, routing } = nextProps;

    // console.log('―――――――――――――――――――')
    // console.log('Token, ', token)
    // console.log('User, ', user)
    // console.log('Hydrated, ', hydrated)
    // console.log('―――――――――――――――――――')

    if (token && user) {
      const newPath = checkForRedirectPath(
        user,
        routing.locationBeforeTransitions.pathname
      );
      alert(newPath);
      if (newPath) {
        this.preventRender = true;
        browserHistory.replace(newPath);
      }
    }
  }

  render() {
    // Quick, hacky way of preventing a target route from loading
    // before it's redirected
    const renderPrevented = this.preventRender;
    this.preventRender = false;
    return !renderPrevented && this.props.children;
  }
}

const mapStateToProps = state => {
  return {
    token: state.persisted.token,
    user: state.profile.user,
    hydrated: state.auth.hydrated,
    routing: state.routing
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleRedirect: user => {
      dispatch(UserActions.handleRedirect(user));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutingManager);
