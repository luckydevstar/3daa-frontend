import React from 'react';
import PropTypes from 'prop-types';

const CustomerLiveViewer = ({ children }) => (
  <div className="live-viewer-container">
    <div className="viewer-header">
      <span>Live View</span>
    </div>
    <div className="viewer-container">
      <div className="viewer">
        <div className="top-bar">
          <span className="m-t-5" />
          <span className="m-t-5" />
          <span className="m-t-5" />
        </div>
        <div className="contents">{children}</div>
      </div>
    </div>
  </div>
);

CustomerLiveViewer.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node)
};

CustomerLiveViewer.defaultProps = {
  children: []
};

export default CustomerLiveViewer;
