import React from 'react';
import { browserHistory } from 'react-router';

const ExportManagerRoot = () => {
  return (
    <div className="community-export-manager__blocks">
      <div
        className="community-export-manager__blocks__block"
        onClick={() => {
          browserHistory.push('/community/export_manager/new-report');
        }}
      >
        <div className="community-export-manager__blocks__block__img">
          <img src="/assets/images/community-manager-report.png" alt="" />
        </div>
        <span>Generate a New Report</span>
      </div>
      <div
        className="community-export-manager__blocks__block"
        onClick={() => {
          browserHistory.push('/community/export_manager/archive');
        }}
      >
        <div className="community-export-manager__blocks__block__img">
          <img
            src="/assets/images/community-manager-report-archived.png"
            alt=""
          />
        </div>
        <span>Archived Reports</span>
      </div>
    </div>
  );
};

export default ExportManagerRoot;
