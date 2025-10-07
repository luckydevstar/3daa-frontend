import React from 'react';
import { or } from 'ramda';
import { Link } from 'react-router';

const TabEntry = (label, path, activeFlag, icon = null) =>
  <li className={activeFlag ? 'tab is-active' : 'tab'}>
    <Link to={path}>
      {icon}
      {label}
    </Link>
  </li>;

const AdminTabs = () =>
  <div className="jobs-tabs">
    <ul>
      {TabEntry(
        'New Adverts',
        '/jobs/admin/new',
        window.location.pathname === '/jobs/admin/new'
      )}
      {TabEntry(
        'Draft Adverts',
        '/jobs/admin/draft',
        window.location.pathname === '/jobs/admin/draft'
      )}
      {TabEntry(
        'Applications',
        '/jobs/admin/applicants',
        or(
          window.location.pathname === '/jobs/admin/applicants',
          window.location.pathname === '/jobs'
        )
      )}
      {TabEntry(
        'Apprenticeships',
        '/jobs/admin/apprent',
        window.location.pathname === '/jobs/admin/apprent'
      )}
    </ul>
  </div>;

export default AdminTabs;
