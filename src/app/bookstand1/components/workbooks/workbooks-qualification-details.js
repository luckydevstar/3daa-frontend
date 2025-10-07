import React from 'react';

const QualificationDetails = ({ qualificationName, mandatory, optional }) => (
  <div className="qualification-details">
    <div className="qualification-title">{qualificationName}</div>
    <div className="unit-details">
      Total Mandatory Units: <b>{mandatory}</b> | Total Optional Units:{' '}
      <b>{optional}</b>
    </div>
  </div>
);

export default QualificationDetails;
