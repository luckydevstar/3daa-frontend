import React from 'react';

const NewReportModal = ({ onClose }) => (
  <div className="community-new-report-modal">
    <div className="community-new-report-modal__body">
      <div className="community-new-report-modal__body__info">
        <span>Your report has successfully been generated.</span>
        {` Click the DOWNLOAD button to save the file to your device`}
      </div>
      <div
        className="community-new-report-modal__body__footer"
        onClick={onClose}
      >
        <span>Close</span>
        <img src="/assets/images/close.png" alt="close" />
      </div>
    </div>
  </div>
);

export default NewReportModal;
