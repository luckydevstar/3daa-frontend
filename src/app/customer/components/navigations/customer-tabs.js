import React from 'react';
import { Link } from 'react-router';

const TabEntry = (label, path, isActive, icon = null) =>
  <li className={isActive ? 'is-active' : ''}>
    <Link to={path}>
      {icon}
      {label}
    </Link>
  </li>;

const Tabs = () =>
  <section className="customer-tabs">
    <ul className="column is-8">
      {TabEntry(
        'Navigation Logo',
        '/customer/logo',
        window.location.pathname === '/customer/logo'
      )}
      {TabEntry(
        'Webfonts',
        '/customer/fonts',
        window.location.pathname === '/customer/fonts'
      )}
      {TabEntry(
        'Brand Colours',
        '/customer/colours',
        window.location.pathname === '/customer/colours'
      )}
      {TabEntry(
        'Brand Assets',
        '/customer/assets',
        window.location.pathname === '/customer/assets'
      )}
      {TabEntry(
        'Summary',
        '/customer/summary',
        window.location.pathname === '/customer/summary'
      )}
    </ul>
    <ul className="column is-4" />
  </section>;

export default Tabs;
