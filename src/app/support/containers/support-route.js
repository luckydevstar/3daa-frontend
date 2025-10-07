import React from 'react';
import SupportComponents from '../components';

const SupportRoute = ({ children }) => (
  <div className="workbooks-route-container">
    <SupportComponents.Header />
    <SupportComponents.Nav />
    {children}
  </div>
);

export default SupportRoute;
