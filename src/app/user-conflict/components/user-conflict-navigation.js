import React from 'react';
import common from 'app/common';

const {
  components: { UINavigation }
} = common;

const UserConflictNavigation = ({ setSearch }) => (
  <div className="user-conflict__navigation">
    <div className="container">
      <UINavigation tabs={[]} onSearch={setSearch} />
    </div>
  </div>
);

export default UserConflictNavigation;
