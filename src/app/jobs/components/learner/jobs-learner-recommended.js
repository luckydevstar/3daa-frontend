import React from 'react';
import Isvg from 'react-inlinesvg';

import IconMapMaker from 'images/icon_map_maker.svg';
import IconGbp from 'images/icon_gbp.svg';

const JobsLearnerRecommended = ({ jobs, getLearnerJobs, viewJob }) => {
  const sliceText = (text, large) => {
    const isLarge = text.length > large;
    if (isLarge) {
      return `${text.slice(0, large)}...`;
    }
    return text;
  };
  return (
    <div className="jobs-recommended">
      <div className="content-title">
        <span className="l-t">Recommended Jobs</span>
        <span
          className="r-t"
          onClick={() => {
            getLearnerJobs(null, true);
          }}
        >
          See all Jobs <i className="fa fa-angle-right" />
        </span>
      </div>

      <div className="contents">
        {jobs.map(job => (
          <div className="list" key={job.job_id}>
            <div className="image" />
            <div className="infos">
              <div className="job-name">{job.title}</div>
              <div className="job-info">
                <span className="desc">{sliceText(job.description, 25)}</span>
                <span className="cost">
                  {job.salary_min && job.salary_max && (
                    <span className="cost">
                      <Isvg src={IconGbp} />{' '}
                      {`£${job.salary_min} - £${job.salary_max} a year`}
                    </span>
                  )}
                </span>
                <span className="position">
                  <Isvg src={IconMapMaker} /> {sliceText(job.address, 40)}
                </span>
              </div>
            </div>
            <div className="btns">
              <span
                onClick={() => {
                  viewJob(job.job_id);
                }}
              >
                View <i className="fa fa-angle-right" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default JobsLearnerRecommended;
