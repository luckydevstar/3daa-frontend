import classNames from 'classnames';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class SidebarPane extends Component {
  render() {
    const { for: paneFor, sidebarPane } = this.props;
    // Very naive pane switching:
    // TODO update later for animations
    if (paneFor !== sidebarPane) return null;
    return (
      <div className={classNames('app-sidebar-pane', `pane-${paneFor}`)}>
        {this.props.children}
      </div>
    );
  }
}

SidebarPane.defaultProps = {
  sidebarPane: null
};

SidebarPane.propTypes = {
  sidebarPane: PropTypes.string
};

//
// SidebarPane Container
//
const mapStateToProps = state => ({
  sidebarPane: state.ui.sidebarPane
});

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarPane);
