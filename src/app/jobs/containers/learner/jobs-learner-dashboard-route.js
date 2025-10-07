import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter } from 'ramda';
import { browserHistory } from 'react-router';
import { JobsLearnerFind, JobsLearnerRecommended } from '../../components';
import { Creators } from '../../actions';
import { Text } from 'app/intl';

class JobsLearnerDashboardRoute extends Component {
  constructor(props) {
    super(props);
    this.getUntouchedJobs = this.getUntouchedJobs.bind(this);
  }

  componentDidMount() {
    const { getLearnerJobs } = this.props;
    getLearnerJobs();
  }

  getUntouchedJobs() {
    const { jobs } = this.props;
    const untouchedJobs = filter(job => !job.applied && !job.saved, jobs);
    return untouchedJobs.slice(0, 5);
  }

  viewJob(job_id) {
    if (!job_id) return null;
    browserHistory.push(`/jobs/learner/all?selected=${job_id}`);
  }

  render() {
    const { uiLoadingJobs, user, getLearnerJobs } = this.props;

    return (
      <div className="jobs-container jobs-learner-dashboard">
        <section className="jobs-find-section">
          <div className="jobs-find-form">
            <JobsLearnerFind {...{ getLearnerJobs, uiLoadingJobs, user }} />
          </div>
        </section>

        <section className="jobs-navbar" />

        <section className="content-section">
          <div className="columns m-t-0">
            <div className="column is-4-widescreen is-4-desktop is-6-tablet is-12-mobile">
              <div className="content-title">
                <Text iKey="current_workbook" />
              </div>
            </div>
            <div className="column is-8-widescreen is-8-desktop is-6-tablet is-12-mobile">
              <JobsLearnerRecommended
                {...{
                  jobs: this.getUntouchedJobs(),
                  getLearnerJobs,
                  viewJob: this.viewJob
                }}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ job, profile: { user } }) => ({
  ...job,
  user
});

const mapDispatchToProps = dispatch => ({
  getLearnerJobs: (findValues, redirect) =>
    dispatch(Creators.getLearnerJobsAttempt(findValues, redirect))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobsLearnerDashboardRoute);
