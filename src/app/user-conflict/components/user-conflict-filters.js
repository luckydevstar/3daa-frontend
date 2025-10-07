import React from 'react';

const UserConflictFilter = () => (
  <div className="container">
    <div className="user-conflict__filters">
      <div className="user-conflict__filters__title">Filter:</div>
      <div>
        <select>
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
        <select>
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
      </div>
    </div>
  </div>
);

export default UserConflictFilter;
