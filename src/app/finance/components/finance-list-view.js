import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as lodash from 'lodash';

import common from 'app/common';
import { Text } from 'app/intl';

import ListItem from './finance-list-item';
import SortHeading from './finance-list-sortHeading';

const {
  util: {
    helpers: { isEmptySeat, isLearner, isGroup }
  }
} = common;

const getSortingHeadings = (sortSettings, toggleSortBy) => {
  const sortHeadingList = Object.keys(sortSettings);

  return sortHeadingList.map(key => {
    const config = sortSettings[key];
    const { name, order, active, sortable } = config;
    return (
      <th className={`heading-${key.split('_')[0]} semibold`} key={key}>
        <Text iKey={name} />
        {sortable && (
          <SortHeading orderProp={key} {...{ toggleSortBy, order, active }} />
        )}
      </th>
    );
  });
};

class FinanceListView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      sortSettings,
      items,
      activeItem,

      onSelected,
      openChat,
      onActive,
      onOrder,

      activating,
      suspending
    } = this.props;

    return (
      <section className="finance-list-view container">
        <table className={classNames('table')}>
          <thead>
            <tr>{getSortingHeadings(sortSettings, onOrder)}</tr>
          </thead>
          <tbody>
            {items.map((itemData, i) => (
              <ListItem
                {...{
                  key: i,
                  itemData,

                  onSelected,
                  openChat,
                  onActive,

                  activating,
                  suspending
                }}
                isActive={
                  lodash.get(itemData, 'centre_id') ==
                  lodash.get(activeItem, 'centre_id')
                }
              />
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}

FinanceListView.propTypes = {
  sortSettings: PropTypes.object,

  onSelected: PropTypes.func,
  onOrder: PropTypes.func
};

FinanceListView.defaultProps = {
  sortSettings: {},

  onSelected: e => {},
  onOrder: (field, order) => {}
};

export default FinanceListView;
