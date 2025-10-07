import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { filter } from 'ramda';
import {
  Header,
  Tabs,
  Nav,
  JobsNavigation,
  JobsLearnerFeed,
  JobsLearnerMap,
  JobsLearnerViewer,
  JobApply,
  JobApplyDone
} from '../../components';
import common from 'app/common';

const { Footer, ContentModal } = common.components;

class JobsLearnerAppliedRoute extends Component {
  constructor() {
    super();
    this.state = {
      viewerHidden: false,
      viewerHeight: 700,
      viewerJob: null
    };

    this.openViewer = this.openViewer.bind(this);
    this.closeViewer = this.closeViewer.bind(this);
    this.openApplyModal = this.openApplyModal.bind(this);
    this.closeApplyModal = this.closeApplyModal.bind(this);
    this.openApplyDoneModal = this.openApplyDoneModal.bind(this);
    this.closeApplyDoneModal = this.closeApplyDoneModal.bind(this);
    this.getAppliedJobs = this.getAppliedJobs.bind(this);
    this.getSavedJobs = this.getSavedJobs.bind(this);
    this.getPassedDate = this.getPassedDate.bind(this);
  }

  componentDidMount() {
    const { job, router } = this.props;
    if (!job.learnerJobsLoaded) {
      router.push('/jobs');
    }
  }

  getAppliedJobs() {
    const { job } = this.props;
    return filter(j => j.applied, job.jobs);
  }

  getSavedJobs() {
    const { job } = this.props;
    return filter(j => j.saved && !j.applied, job.jobs);
  }

  getUntouchedJobs() {
    const { job } = this.props;
    return filter(j => !j.applied && !j.saved, job.jobs);
  }

  openViewer(job) {
    this.setState({
      viewerHidden: true,
      viewerJob: job,
      viewerHeight: document.querySelector('.jobs-feed').offsetHeight
    });
  }

  closeViewer() {
    this.setState({ viewerHidden: false });
  }

  openApplyModal() {
    this.jobApplyModal.open();
  }

  closeApplyModal() {
    this.jobApplyModal.close();
  }

  openApplyDoneModal() {
    this.closeApplyModal();
    this.jobApplyDoneModal.open();
  }

  closeApplyDoneModal() {
    this.jobApplyDoneModal.close();
  }
  addComma(num) {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  cutText(text, large) {
    const isLarge = text.length > large;
    if (isLarge) {
      return `${text.slice(0, large)}...`;
    }
    return text;
  }

  getPassedDate(job) {
    if (!job.created) return '';
    const created = moment(job.created);
    const now = moment();
    return created.from(now);
  }

  render() {
    const { viewerHidden, viewerHeight, viewerJob } = this.state;
    const jobs = this.getAppliedJobs();
    return (
      <div className="jobs-container">
        <Header />
        <JobsNavigation>
          <div className="column is-one-third is-paddingless is-marginless">
            <Tabs
              allCount={this.getUntouchedJobs().length}
              appliedCount={jobs.length}
              savedCount={this.getSavedJobs().length}
            />
          </div>
          <div className="column is-paddingless is-marginless">
            <Nav />
          </div>
        </JobsNavigation>

        <section className="separated jobs-feed">
          <div className="columns is-paddingless is-marginless">
            <div className="column is-one-third is-paddingless">
              {jobs.length > 0 && (
                <JobsLearnerFeed
                  {...{
                    open: this.openViewer,
                    jobs,
                    viewerJob,
                    addComma: this.addComma,
                    cutText: this.cutText,
                    getPassedDate: this.getPassedDate
                  }}
                />
              )}
              {jobs.length === 0 && (
                <div className="jobs-feed__empty">No jobs found</div>
              )}
            </div>
            <div className="column is-paddingless jobs-map">
              {jobs.length > 0 && (
                <JobsLearnerMap {...{ close: this.closeViewer, jobs }} />
              )}
              <div
                className={cx('jobs-viewer', {
                  'viewer-active': viewerHidden
                })}
              >
                <JobsLearnerViewer
                  {...{
                    addComma: this.addComma,
                    cutText: this.cutText,
                    closeViewer: this.closeViewer,
                    openApplyModal: this.openApplyModal,
                    viewerHeight,
                    applied: true,
                    viewerJob: viewerJob || {},
                    getPassedDate: this.getPassedDate
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <ContentModal
          noCloseButton="true"
          className="job-apply-modal"
          ref={e => {
            this.jobApplyModal = e;
          }}
        >
          <JobApply {...{ openApplyDoneModal: this.openApplyDoneModal }} />
        </ContentModal>
        <ContentModal
          noCloseButton="true"
          className="job-apply-done-modal"
          ref={e => {
            this.jobApplyDoneModal = e;
          }}
        >
          <JobApplyDone
            {...{ closeApplyDoneModal: this.closeApplyDoneModal }}
          />
        </ContentModal>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ job }) => ({
  job
});

export default connect(mapStateToProps)(JobsLearnerAppliedRoute);
