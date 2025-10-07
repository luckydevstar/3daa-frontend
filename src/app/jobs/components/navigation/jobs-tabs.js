import React from 'react';
import { or } from 'ramda';
import { Link } from 'react-router';

const TabEntry = (label, path, activeFlag, interview, icon = null) => (
  <li className={activeFlag ? 'tab is-active' : 'tab'}>
    <Link to={path}>
      {icon}
      {label}
      {interview && <i className="interview fa fa-circle">&nbsp;</i>}
    </Link>
  </li>
);

const Tabs = ({ allCount, appliedCount, savedCount }) => (
  <div className="jobs-tabs">
    <ul>
      {TabEntry(
        `Jobs(${allCount})`,
        '/jobs/learner/all',
        or(
          window.location.pathname === '/jobs/learner/all',
          window.location.pathname === '/jobs'
        ),
        false
      )}
      {TabEntry(
        `Saved(${savedCount})`,
        '/jobs/learner/saved',
        window.location.pathname === '/jobs/learner/saved',
        false
      )}
      {TabEntry(
        `Applied(${appliedCount})`,
        '/jobs/learner/applied',
        window.location.pathname === '/jobs/learner/applied',
        true
      )}
    </ul>
  </div>
);

export default Tabs;
