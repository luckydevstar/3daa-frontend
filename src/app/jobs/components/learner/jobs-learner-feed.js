import React from 'react';
import cx from 'classnames';

const Feed = ({
  open,
  active,
  interview,
  job,
  cutText,
  addComma,
  getPassedDate
}) => {
  return (
    <div
      className={cx('feed columns', {
        'is-active': active,
        'is-interview': interview
      })}
      onClick={() => {
        open(job);
      }}
    >
      {interview && <i className="interview-point fa fa-circle">&nbsp;</i>}
      <div className="column is-2 photo">
        <div className="img">&nbsp;</div>
      </div>
      <div className="column info">
        <p className="corp-title">
          {cutText(job.title, 50)} <i className="fa fa-circle">&nbsp;</i>
        </p>
        <p>{cutText(job.description, 120)}</p>
        <p>{cutText(job.address, 50)}</p>
        <div className="columns">
          {job.salary_min && job.salary_max && (
            <div className="column is-7">
              <p>
                £{addComma(job.salary_min)} - £{addComma(job.salary_max)} a year
              </p>
            </div>
          )}
          {job.created && (
            <div className="column">
              <p>{getPassedDate(job)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const JobsLearnerFeed = ({
  open,
  jobs,
  viewerJob,
  addComma,
  cutText,
  getPassedDate
}) => (
  <div className="list">
    {jobs.map(j => (
      <Feed
        key={j.job_id}
        {...{
          job: j,
          addComma,
          cutText,
          open,
          getPassedDate,
          active: viewerJob && viewerJob.job_id === j.job_id
        }}
      />
    ))}
  </div>
);

export default JobsLearnerFeed;
