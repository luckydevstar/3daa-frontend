import React from 'react';
import common from 'app/common';

import DashboardUserContainer from './dashboard-user-container';

const Footer = common.components.Footer;

class DashboardRoute extends React.Component {
  render() {
    return (
      <div className="dashboard-new-container">
        <DashboardUserContainer />
        <Footer />
      </div>
    );
  }
}

export default DashboardRoute;
