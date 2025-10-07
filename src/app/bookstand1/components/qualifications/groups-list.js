import React from 'react';
import PropTypes from 'prop-types';
import GroupRow from './group-row';
import common from 'app/common';
import { isEmpty } from 'ramda';

const {
  components: { EmptyView }
} = common;

const GroupsList = ({ groups, isSelected, handleGroupClick }) => {
  if (isEmpty(groups)) {
    return (
      <EmptyView
        title="No Groups"
        description="There is no groups in your centre yet"
      />
    );
  }
  return (
    <table className="users-table">
      <thead className="users-table-header">
        <tr>
          <th />
          <th>Group Name</th>
          <th>Members</th>
          <th className="wide">
            <div className="icon-check" />
          </th>
        </tr>
      </thead>
      <tbody className="users-table-body">
        {groups &&
          groups.map(group => (
            <GroupRow
              key={group.group_id}
              {...{ group, handleGroupClick, isSelected }}
            />
          ))}
      </tbody>
    </table>
  );
};

GroupsList.propTypes = {
  groups: PropTypes.array
};

GroupsList.defaultProps = {
  groups: null
};

export default GroupsList;
