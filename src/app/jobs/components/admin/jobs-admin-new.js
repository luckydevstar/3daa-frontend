import React from 'react';
import ExImage from 'images/Apprenticeships-Logo.png';

const JobsAdminNew = ({ setJobType }) => (
  <div className="jobs-admin-new">
    <div className="job-list">
      <div className="columns">
        <div className="column is-1">
          <div className="icon" />
        </div>
        <div className="column is-11">
          <div className="infos">
            <div className="j-title">Create a New Job Advert</div>
            <div className="j-contents">
              <div className="content">
                Enter the job title and location for the position that you are
                looking to fill, and we'll get your opportunity in front of the
                right talent
              </div>
              <div className="btn">
                <button
                  className="button is-primary"
                  onClick={() => setJobType(1)}
                >
                  Create New
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="job-list">
      <div className="infos">
        <div className="j-title">Create an Apprenticeship Advert</div>
        <div className="j-a-contents">
          <div className="logo">
            <img src={ExImage} alt="" />
          </div>
          <div className="content">
            Apprenticeships combine practical training in a job with study.
          </div>
          <div className="btn">
            <button className="button is-primary" onClick={() => setJobType(3)}>
              Create New
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default JobsAdminNew;
