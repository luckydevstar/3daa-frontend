import React from 'react';
import PropTypes from 'prop-types';
import { Text, Input } from 'app/intl';

const WorkbooksNav = ({
  tabs,
  activeTab,
  onTabsChange,
  isManager,
  searchPhrase,
  onSearchChange
}) =>
  <section className="workbooks-nav-container content-section">
    <div className="container">
      <div className="tabs">
        {tabs &&
          <ul>
            {Object.keys(tabs).map(key => {
              return (
                <li
                  key={key}
                  className={activeTab === Number(key) ? 'is-active' : ''}
                >
                  <a onClick={() => onTabsChange(Number(key))}>
                    {tabs[key]}
                  </a>
                </li>
              );
            })}
          </ul>}
        {(isManager || onSearchChange) &&
          <ul className="is-right">
            {isManager &&
              <li className="is-active">
                <a onClick={() => null}>
                  <i className="fa fa-gear content-manager-icon" />{' '}
                  <Text iKey="qualification_manager" />
                </a>
              </li>}
            {onSearchChange &&
              <li className="control search">
                <Input
                  onChange={e => onSearchChange(e.target.value)}
                  value={searchPhrase}
                  type="text"
                  className="input"
                  placeholder="filter_workbooks"
                />
              </li>}
          </ul>}
      </div>
    </div>
  </section>;

WorkbooksNav.propTypes = {
  tabs: PropTypes.object,
  activeTab: PropTypes.number.isRequired,
  onTabsChange: PropTypes.func,
  isManager: PropTypes.bool,
  searchPhrase: PropTypes.string,
  onSearchChange: PropTypes.func
};

WorkbooksNav.defaultProps = {
  tabs: {},
  onTabsChange: () => null,
  isManager: false,
  searchPhrase: '',
  onSearchChange: null
};

export default WorkbooksNav;
