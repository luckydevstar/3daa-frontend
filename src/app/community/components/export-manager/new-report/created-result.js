import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CreatedResult = ({ csvData, createdDate, user }) => {
  const [encodedCsvData, setEncodedCsvData] = useState();
  useEffect(() => {
    if (csvData) {
      setEncodedCsvData(`data:text/csv;charset=utf-8,${csvData}`);
    }
  }, [csvData]);

  const created = moment(createdDate);

  return (
    <div className="community-export-manager__created-result">
      <div className="community-export-manager__created-result__avatar">
        {user && user.photo && <img src={user.photo} alt="avatar" />}
      </div>
      {user && (
        <React.Fragment>
          <div className="community-export-manager__created-result__created-by">
            Report created by
          </div>
          <div className="community-export-manager__created-result__created-name">
            {user.screen_name}
          </div>
        </React.Fragment>
      )}
      <div className="community-export-manager__created-result__date-created">
        Date created
      </div>
      <div className="community-export-manager__created-result__date">
        {created.format('YYYY-MM-DD')} <br />
        {created.format('HH:mm:ss')}
      </div>
      {encodedCsvData && (
        <a href={encodedCsvData} download="report.csv">
          <button
            className="community-export-manager__created-result__download"
            type="button"
          >
            Download
          </button>
        </a>
      )}
      <img
        className="community-export-manager__created-result__csv-icon"
        src="/assets/images/csv_file.png"
        alt=""
      />
    </div>
  );
};

export default CreatedResult;
