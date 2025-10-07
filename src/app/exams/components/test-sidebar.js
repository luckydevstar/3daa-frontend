import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const TestSidebar = ({ children, sidebarOpen, onToggleSidebar }) =>
  <div className={cx('test-sidebar', { open: sidebarOpen })}>
    <div
      className="bg-overlay"
      onClick={() => {
        onToggleSidebar();
      }}
    />
    <div className="sidebar-frame">
      {children}
    </div>
  </div>;

TestSidebar.propTypes = {
  sidebarOpen: PropTypes.bool,
  onToggleSidebar: PropTypes.func.isRequired
};

TestSidebar.defaultProps = {
  sidebarOpen: false
};

export default TestSidebar;
