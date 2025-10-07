import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Creators } from '../../actions';
import {
  AdminHeader,
  AdminTabs,
  AdminNav,
  JobsNavigation,
  JobsAdminFeed,
  JobsAdminlist,
  JobsAdminCardFront,
  JobsAdminCardBack,
  JobsAdminInterview,
  JobsAdminDecline,
  JobsAdminProfileView
} from '../../components';
import common from 'app/common';

const {
  Footer,
  ContentModal,
  ContentModalConfirm,
  UIFlipper
} = common.components;

class JobsAdminDraftRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewMethod: true,
      profileView: false,
      activeJob: ''
    };
    this.toggleViewMethod = this.toggleViewMethod.bind(this);
    this.toggleProfileView = this.toggleProfileView.bind(this);
    this.openInterviewModal = this.openInterviewModal.bind(this);
    this.closeInterviewModal = this.closeInterviewModal.bind(this);
    this.openDeclineModal = this.openDeclineModal.bind(this);
    this.closeDeclineModal = this.closeDeclineModal.bind(this);
    this.setActiveJob = this.setActiveJob.bind(this);
    this.jobDelteClick = this.jobDelteClick.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.confirmModal = null;
  }

  componentDidMount() {
    const { getSavedJobs } = this.props;
    getSavedJobs();
  }

  toggleViewMethod() {
    this.setState({
      viewMethod: !this.state.viewMethod
    });
  }

  toggleProfileView() {
    this.setState({
      profileView: !this.state.profileView
    });
  }

  openInterviewModal() {
    this.jobInterviewModal.open();
  }
  closeInterviewModal() {
    this.jobInterviewModal.close();
  }

  openDeclineModal() {
    this.jobDeclineModal.open();
  }
  closeDeclineModal() {
    this.jobDeclineModal.close();
  }
  setActiveJob(jobId) {
    this.setState({
      activeJob: jobId
    });
  }
  deleteJob() {
    const { deleteJob, profile } = this.props;
    const { jobToDelete } = this.state;
    deleteJob(profile.user.centres[0].centre_id, jobToDelete);
  }
  jobDelteClick(jobId) {
    this.setState({
      jobToDelete: jobId
    });
    this.confirmModal.open();
  }
  render() {
    const { uiLoadingSavedJobs: loading, savedJobs: jobs } = this.props;
    const { viewMethod, profileView, activeJob } = this.state;

    return (
      <div className="jobs-container">
        <AdminHeader />
        <JobsNavigation>
          <div className="column is-6 is-paddingless is-marginless">
            <AdminTabs />
          </div>
          <div className="column is-6 is-paddingless is-marginless">
            <AdminNav
              {...{
                viewMethod,
                toggleViewMethod: this.toggleViewMethod,
                isViewMode: true
              }}
            />
          </div>
        </JobsNavigation>

        <section className="separated jobs-feed">
          <div className="min-content-height columns is-paddingless is-marginless">
            <div className="column is-6 is-paddingless admin-feed">
              <JobsAdminFeed
                {...{
                  activeJob,
                  setActiveJob: this.setActiveJob,
                  getApplications: () => {},
                  jobDelteClick: this.jobDelteClick,
                  loading,
                  jobs
                }}
              />
            </div>
            <div className="column is-6 is-paddingless">
              <div className="jobs-feed__empty">No Applications</div>
            </div>
          </div>
        </section>

        <ContentModal
          className="jobs-interview-modal"
          ref={e => {
            this.jobInterviewModal = e;
          }}
        >
          <JobsAdminInterview
            {...{ closeInterviewModal: this.closeInterviewModal }}
          />
        </ContentModal>

        <ContentModal
          className="jobs-decline-modal"
          ref={e => {
            this.jobDeclineModal = e;
          }}
        >
          <JobsAdminDecline
            {...{ closeDeclineModal: this.closeDeclineModal }}
          />
        </ContentModal>
        <ContentModalConfirm
          callback={this.deleteJob}
          ref={e => {
            this.confirmModal = e;
          }}
        >
          <h3>Are you sure you want to delete the job?</h3>
        </ContentModalConfirm>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ job, profile }) => ({
  ...job,
  profile
});

const mapDispatchToProps = dispatch => ({
  getSavedJobs: () => dispatch(Creators.getSavedJobsAttempt()),
  deleteJob: (centre_id, job_id) =>
    dispatch(Creators.deleteJobAttempt(centre_id, job_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobsAdminDraftRoute);
