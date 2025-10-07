import React from 'react';
import classNames from 'classnames';

const SortHeading = props => {
  const { sortProp, toggleSortBy, sortOrder, active } = props;

  const initialSorting = sortOrder === null ? 'asc' : false;
  const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

  return (
    <div
      onClick={() => toggleSortBy(sortProp, initialSorting || newSortOrder)}
      className={classNames(
        'arrow',
        { active: !!active },
        { asc: sortOrder === 'asc' || sortOrder === null },
        { desc: sortOrder === 'desc' }
      )}
    />
  );
};

export default SortHeading;
