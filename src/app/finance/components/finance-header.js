import React from 'react';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { Link } from 'react-router';
import { Text } from 'app/intl';

const {
  components: { ExpandableButton },
  util: {
    helpers: { UserAccess }
  }
} = common;
const { SuperAdmin, SiteAdmin, CentreAdmin } = Roles;

const FinanceHeader = ({ activeSection }) => {
  return (
    <section className="content-section hero smaller gray">
      {/* General header */}
      <div className="hero-body">
        <div className="container">
          <div className="media">
            <div className="media-left">
              <Link className="back-button" to="/community/groups" />
            </div>
            <div className="media-right">
              <h1 className="title">Centres</h1>
              <h2 className="subtitle">Keeping you connected</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinanceHeader;
