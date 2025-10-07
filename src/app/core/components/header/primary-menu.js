import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { Text } from 'app/intl';

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  CentreEQA,
  CentreEditor,
  SuperAdmin,
  SiteAdmin,
  Finance,
  Author
} = Roles;

const {
  util: {
    helpers: { UserAccess, validRolesWithout, extractUserRole }
  }
} = common;

class PrimaryMenu extends React.Component {
  inUrl(name) {
    return window.location.pathname.split('/')[1] === name;
  }

  render() {
    const { user } = this.props;

    const dashboardClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('dashboard')
    });

    const qualificationClasses = cx('navbar-item', {
      'is-active': this.inUrl('qualifications')
    });

    const financeClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('finance')
    });

    const communityClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('community')
    });

    const bookstandClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('bookstand') || this.inUrl('workbooks')
    });

    const videosClasses = cx({
      'navbar-item': true,
      'is-active': this.inUrl('videos')
    });

    const role = extractUserRole(user);

    return (
      <div className={cx(`nav-right nav-menu`)}>
        <UserAccess allowRoles={validRolesWithout(CentreEQA, CentreEditor)}>
          <Link to="/dashboard" className={dashboardClasses}>
            <Text iKey="dashboard" />
          </Link>
        </UserAccess>
        <UserAccess allowRoles={[Author]}>
          <Link
            to="/qualifications/sector-selection"
            className={qualificationClasses}
          >
            <Text iKey="Qualification Manager" />
          </Link>
        </UserAccess>
        <UserAccess
          allowRoles={validRolesWithout(Finance, CentreEditor, Author)}
        >
          <Link to="/community/learners" className={communityClasses}>
            <Text iKey="community" />
          </Link>
        </UserAccess>
        <UserAccess allowRoles={[Finance]}>
          <Link to="/finance" className={financeClasses}>
            <Text iKey="centres" />
          </Link>
        </UserAccess>
        <UserAccess
          allowRoles={[CentreTutor, CentreLearner, SuperAdmin, SiteAdmin]}
        >
          <Link to="/bookstand" className={bookstandClasses}>
            <Text iKey="bookstand" />
          </Link>
        </UserAccess>
        <UserAccess allowRoles={[CentreAdmin]}>
          <Link
            // to="/bookstand"
            to="/workbooks/qualification-manager"
            className={bookstandClasses}
          >
            <Text iKey="workbooks" />
          </Link>
        </UserAccess>
        <UserAccess
          allowRoles={[
            CentreAdmin,
            CentreTutor,
            CentreLearner,
            SuperAdmin,
            SiteAdmin
          ]}
        >
          <Link to="/videos" className={videosClasses}>
            <Text iKey="videos" />
          </Link>
        </UserAccess>
      </div>
    );
  }
}

export default PrimaryMenu;
