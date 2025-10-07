import React from 'react';
import cx from 'classnames';
import Isvg from 'react-inlinesvg';
import common from 'app/common';
import { browserHistory } from 'react-router';

const {
  components: { UILoading }
} = common;

import IconMale from 'images/icon_male.svg';

const Feed = ({
  setActiveJob,
  active,
  title,
  description,
  address,
  salary_min,
  salary_max,
  applications_count,
  viewed,
  status,
  jobDelteClick,
  job_id
}) => (
  <div
    className={cx('feed columns', {
      'is-active': active
    })}
    onClick={setActiveJob}
  >
    <div className="column is-2 photo">
      <div className="img">&nbsp;</div>
    </div>
    <div className="column is-4 info">
      <p className="corp-title">{title}</p>
      <p>{description}</p>
      <p>{address}</p>
      {salary_min && salary_max && (
        <p>
          £{salary_min} - £{salary_max} a year
        </p>
      )}
    </div>
    <div className="column is-5">
      <div className="columns status">
        <div className="column">
          <span className="icon">
            <i className="fa fa-file-text" />
          </span>
          <span className="txt">{applications_count} Applications</span>
        </div>
        <div className="column">
          <span className="icon">
            <Isvg src={IconMale} />
          </span>
          <span className="txt">{viewed} Views</span>
        </div>
        <div className="column">
          <span className="icon sm">
            {status !== 1 && <i className="fa fa-circle-thin" />}
            {status === 1 && <i className="fa fa-circle" />}
          </span>
          <span className="txt">{status === 0 ? 'Inactive' : 'Active'}</span>
        </div>
      </div>
    </div>
    <div className="column is-1 jobs-feed-edit-delete">
      <div
        className="jobs-feed-edit-delete__icon"
        onClick={() => {
          jobDelteClick(job_id);
        }}
      >
        <i className="fa fa-trash" aria-hidden="true" />
      </div>
      <div
        className="jobs-feed-edit-delete__icon"
        onClick={() => {
          browserHistory.push(`/jobs/admin/new?edit=${job_id}`);
        }}
      >
        <i className="fa fa-pencil" aria-hidden="true" />
      </div>
    </div>
  </div>
);

const JobsAdminFeed = ({
  setActiveJob,
  jobs,
  getApplications,
  activeJob,
  loading,
  jobDelteClick
}) => {
  if (loading) return <UILoading marginTop="100px" />;
  if (jobs.length <= 0) return <div className="list__empty">No jobs</div>;
  return (
    <div className="list">
      {jobs.map(job => (
        <Feed
          key={job.job_id}
          {...{
            ...job,
            setActiveJob: () => {
              setActiveJob(job.job_id);
              getApplications(job.job_id);
            },
            active: activeJob === job.job_id,
            jobDelteClick
          }}
        />
      ))}
    </div>
  );
};
JobsAdminFeed.defaultProps = {
  jobs: []
};

export default JobsAdminFeed;
