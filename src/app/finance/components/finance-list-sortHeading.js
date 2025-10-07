import React from 'react';
import classNames from 'classnames';

const SortHeading = props => {
  const { orderProp, toggleSortBy, order, active } = props;

  const initialSorting = order === null ? 'asc' : false;
  const newOrder = order === 'asc' ? 'desc' : 'asc';

  return (
    <div
      onClick={() => toggleSortBy(orderProp, initialSorting || newOrder)}
      className={classNames(
        'arrow',
        { active: !!active },
        { asc: order === 'asc' || order === null },
        { desc: order === 'desc' }
      )}
    />
  );
};

export default SortHeading;
