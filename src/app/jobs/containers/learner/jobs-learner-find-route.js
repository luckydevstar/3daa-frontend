import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pickAll } from 'ramda';
import { JobsLearnerFind } from '../../components';
import { Creators } from '../../actions';
import { Text } from 'app/intl';

class JobsLearnerFindRoute extends Component {
  UNSAFE_componentWillMount() {
    // this.props.getJobs({});
  }

  render() {
    const { getLearnerJobs, uiLoadingJobs, user } = this.props;

    return (
      <div className="jobs-container">
        <section className="content-section jobs-learner-find">
          <div className="container">
            <div className="find-header">
              <button className="button is-primary is-outlined" type="button">
                <Text iKey="select_job_sector" />
                <span className="caret" />
              </button>
            </div>
            <div className="find-form">
              <h1>
                <Text iKey="find_a_job" />
              </h1>
              <p className="subtitle">
                <Text iKey="search_and_apply_for_new_roles" />
              </p>
              <JobsLearnerFind
                {...{ getJobs: getLearnerJobs, uiLoadingJobs, user }}
              />
            </div>
            <div className="find-infos">
              <p className="info-title">My recent searches</p>
              <p className="info">
                Waiting/Bar Staff - <b className="new">42 new</b>
              </p>
              <p className="info">Sous Chef - 2 new</p>
              <p className="info">
                Restaurant Manager - <b className="new">12 new</b>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ job, user }) => ({
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
)(JobsLearnerFindRoute);
