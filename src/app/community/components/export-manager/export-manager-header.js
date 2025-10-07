import React from 'react';
import { browserHistory } from 'react-router';

const ExportManagerHeader = () => {
  return (
    <div className="container">
      <div className="export-manager-header">
        <button onClick={browserHistory.goBack}>
          <i className="fa fa-angle-left" />
        </button>
        <div className="export-manager-header__info">
          <h2>Reports</h2>
          <div className="export-manager-header__description">
            Download an Activity Report
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportManagerHeader;
