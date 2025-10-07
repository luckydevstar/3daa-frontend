import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { Text } from 'app/intl';

const { CentreAdmin } = Roles;

const {
  util: {
    helpers: { UserAccess, validRolesWithout }
  }
} = common;

class DMPMenu extends React.Component {
  inUrl(name) {
    return window.location.pathname.split('/')[1] === name;
  }

  render() {
    const aboutClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('dashboard')
    });

    const forgetClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('community')
    });

    const charitiesClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('community')
    });

    const faqClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('videos')
    });

    const helpClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('videos')
    });

    const buyClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('store')
    });

    return (
      <div className="nav-right nav-dmp-menu">
        <Link to="/dashboard" className={aboutClasses}>
          <Text iKey="ABOUT THE PENNY" />
        </Link>
        <Link to="/community/centre-admins" className={forgetClasses}>
          <Text iKey="NEVER FORGET" />
        </Link>
        <Link to="/community/centre-admins" className={charitiesClasses}>
          <Text iKey="CHARITIES" />
        </Link>
        <Link to="/videos" className={faqClasses}>
          <Text iKey="FAQ" />
        </Link>
        <Link to="/videos" className={helpClasses}>
          <Text iKey="HELP" />
        </Link>
        <Link to="/store" className={buyClasses}>
          <Text iKey="Buy A Penny" />
        </Link>
      </div>
    );
  }
}

export default DMPMenu;
