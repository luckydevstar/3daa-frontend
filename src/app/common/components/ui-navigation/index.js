import React from 'react';
import PropTypes from 'prop-types';
import UITabs from '../ui-tabs';
import UISearch from '../ui-search';
import { noop } from '../../util/helpers';

const UINavigation = ({
  active,
  change,
  onSearch,
  showSearch,
  searchValue,
  searchPlaceholder,
  tabs,
  translate
}) => {
  const leftTabs = tabs.filter(tab => !tab.right);
  const rightTabs = tabs.filter(tab => tab.right);

  return (
    <div className="navigation">
      <UITabs
        active={active}
        tabs={leftTabs}
        change={e => change(e)}
        translate={translate}
      />
      <UITabs
        active={active}
        tabs={rightTabs}
        change={e => change(e)}
        align="right"
        translate={translate}
      />
      {showSearch && (
        <UISearch
          onSearch={e => onSearch(e)}
          placeholder={searchPlaceholder}
          searchValue={searchValue}
          translate={translate}
        />
      )}
    </div>
  );
};

UINavigation.propTypes = {
  active: PropTypes.string,
  change: PropTypes.func,
  onSearch: PropTypes.func,
  showSearch: PropTypes.bool,
  tabs: PropTypes.array.isRequired,
  searchPlaceholder: PropTypes.string,
  searchValue: PropTypes.string,
  translate: PropTypes.bool
};

UINavigation.defaultProps = {
  active: '',
  change: noop,
  onSearch: noop,
  showSearch: true,
  searchPlaceholder: 'search',
  searchValue: '',
  translate: true
};

export default UINavigation;
