import React from 'react';

const AccessDenied = () =>
  <div className="has-text-centered p-t-30 p-b-30">
    <h1>You have insufficient priviliges to view this page.</h1>
    <p className="m-t-20">
      If you think this is a mistake, please contact an administrator.
    </p>
  </div>;

export default AccessDenied;
