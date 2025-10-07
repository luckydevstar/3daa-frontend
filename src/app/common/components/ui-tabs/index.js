import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { UserAccess } from '../../util/helpers';
import { Text } from 'app/intl';

const Tab = ({ isActive, url, click, text, icon, roles, count, translate }) =>
  roles ? (
    <UserAccess allowRoles={roles}>
      <li className={isActive ? 'is-active' : ''}>
        <Link to={url} onClick={click}>
          {icon && <i className={`fa ${icon}`} />}
          {translate ? <Text iKey={text || ''} /> : text}
          {count && <span className="tab-count m-l-10">{count}</span>}
        </Link>
      </li>
    </UserAccess>
  ) : (
    <li className={isActive ? 'is-active' : ''}>
      <Link to={url} onClick={click}>
        {icon && <i className={`fa ${icon}`} />}
        <Text iKey={text || ''} />
        {count && <span className="tab-count m-l-10">{count}</span>}
      </Link>
    </li>
  );

const UITabs = ({ active, tabs, change, align, translate }) => (
  <ul className={`tabs ${align}`}>
    {tabs.map(tab => (
      <Tab
        key={tab.key}
        {...tab}
        isActive={tab.key === active}
        click={() => change(tab.key)}
        translate={translate}
      />
    ))}
  </ul>
);

UITabs.propTypes = {
  active: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
  change: PropTypes.func.isRequired,
  align: PropTypes.string,
  translate: PropTypes.bool
};

UITabs.defaultProps = {
  align: 'left',
  translate: true
};

export default UITabs;
