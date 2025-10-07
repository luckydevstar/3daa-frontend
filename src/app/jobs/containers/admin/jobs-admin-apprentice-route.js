import React, { Component } from 'react';
import { connect } from 'react-redux';
import ExImage from 'images/avatar_example.png';
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

const { createCloudinaryUrl } = common.util.helpers;
const {
  Footer,
  ContentModal,
  UIFlipper,
  ContentModalConfirm,
  UILoading
} = common.components;

class JobsAdminApprenticeRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewMethod: true,
      profileView: false,
      activeJob: '',
      message: '',
      selectedApplication: null,
      jobToDelete: null
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
    this.getApplications = this.getApplications.bind(this);
    this.changeMessage = this.changeMessage.bind(this);
    this.declineApplication = this.declineApplication.bind(this);
    this.confirmModal = null;
  }

  toggleViewMethod() {
    this.setState({
      viewMethod: !this.state.viewMethod
    });
  }

  toggleProfileView(app) {
    this.setSelectedApplication(app, () => {
      this.setState({
        profileView: !this.state.profileView
      });
    });
  }
  jobDelteClick(jobId) {
    this.setState({
      jobToDelete: jobId
    });
    this.confirmModal.open();
  }
  deleteJob() {
    const { deleteJob, profile } = this.props;
    const { jobToDelete } = this.state;
    deleteJob(profile.user.centres[0].centre_id, jobToDelete);
  }
  openInterviewModal(app) {
    this.setSelectedApplication(app, this.jobInterviewModal.open);
  }
  closeInterviewModal() {
    this.setSelectedApplication(null, this.jobInterviewModal.close);
  }

  openDeclineModal(app) {
    this.setSelectedApplication(app, this.jobDeclineModal.open);
  }
  closeDeclineModal() {
    this.setSelectedApplication(null, this.jobDeclineModal.close);
  }
  getApprenticeships() {
    const { job } = this.props;
    return job.jobs.filter(j => j.job_type === 'Apprenticeship');
  }
  setActiveJob(jobId) {
    this.setState({
      activeJob: jobId,
      profileView: false
    });
  }
  changeMessage(e) {
    this.setState({
      message: e.target.value
    });
  }
  setSelectedApplication(application, cb) {
    this.setState({ selectedApplication: application }, cb);
  }
  getApplications(job_id) {
    const { getJobApplications, profile } = this.props;
    getJobApplications(profile.user.centres[0].centre_id, job_id);
  }
  declineApplication(e) {
    e.preventDefault();
    const { declineJobApplication, profile } = this.props;
    const { message, selectedApplication } = this.state;
    declineJobApplication(
      profile.user.centres[0].centre_id,
      selectedApplication.job_id,
      selectedApplication.job_application_id,
      { message }
    );
  }
  interviewApplication(e) {
    e.preventDefault();
    const { interviewJobApplication, profile, form } = this.props;
    const { message, selectedApplication } = this.state;
    if (
      form.interviewForm &&
      form.interviewForm &&
      form.interviewForm.values &&
      form.interviewForm.values.interview_date
    ) {
      this.closeInterviewModal();
      interviewJobApplication(
        profile.user.centres[0].centre_id,
        selectedApplication.job_id,
        selectedApplication.job_application_id,
        { message, date: form.interviewForm.values.interview_date }
      );
    }
  }
  render() {
    const { job } = this.props;
    const {
      viewMethod,
      profileView,
      activeJob,
      selectedApplication
    } = this.state;
    const jobs = this.getApprenticeships();
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
                  jobs,
                  activeJob,
                  getApplications: this.getApplications,
                  setActiveJob: this.setActiveJob,
                  jobDelteClick: this.jobDelteClick
                }}
              />
            </div>
            {profileView ? (
              <div className="column is-6 is-paddingless">
                <JobsAdminProfileView
                  {...{
                    toggleProfileView: this.toggleProfileView,
                    openInterviewModal: () => {
                      this.openInterviewModal(selectedApplication);
                    },
                    openDeclineModal: () => {
                      this.openDeclineModal(selectedApplication);
                    },
                    selectedApplication
                  }}
                />
              </div>
            ) : (
              <div className="column is-6 is-paddingless">
                {job.uiLoadingJobApplications && (
                  <UILoading marginTop="100px" />
                )}
                {!job.uiLoadingJobApplications &&
                  job.applications.length === 0 && (
                    <div className="jobs-feed__empty">No Applications</div>
                  )}
                {viewMethod ? (
                  <div className="columns is-multiline is-marginless p-5">
                    {!job.uiLoadingJobApplications &&
                      job.applications.map(app => (
                        <div
                          key={app.job_application_id}
                          className="column is-6"
                        >
                          <UIFlipper
                            front={
                              <JobsAdminCardFront
                                {...{
                                  name: app.screen_name,
                                  avatarUrl: app.cloudinary_file_id
                                    ? createCloudinaryUrl(
                                        app.cloudinary_file_id
                                      )
                                    : ExImage
                                }}
                              />
                            }
                            back={
                              <JobsAdminCardBack join_date={app.join_date} />
                            }
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div>
                    {!job.uiLoadingJobApplications &&
                      job.applications.map(app => (
                        <JobsAdminlist
                          {...{
                            key: app.job_id,
                            name: app.screen_name,
                            declined: app.declined,
                            interview_requested: app.interview_requested,
                            interview_requested_date:
                              app.interview_requested_date,
                            avatarUrl: app.cloudinary_file_id
                              ? createCloudinaryUrl(app.cloudinary_file_id)
                              : ExImage,
                            openInterviewModal: () => {
                              this.openInterviewModal(app);
                            },
                            openDeclineModal: () => {
                              this.openDeclineModal(app);
                            },
                            toggleProfileView: () => {
                              this.toggleProfileView(app);
                            }
                          }}
                        />
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <ContentModal
          className="jobs-interview-modal"
          ref={e => {
            this.jobInterviewModal = e;
          }}
        >
          <JobsAdminInterview
            {...{
              closeInterviewModal: this.closeInterviewModal,
              changeMessage: this.changeMessage,
              interviewApplication: this.interviewApplicatio,
              selectedApplication
            }}
          />
        </ContentModal>

        <ContentModal
          className="jobs-decline-modal"
          ref={e => {
            this.jobDeclineModal = e;
          }}
        >
          <JobsAdminDecline
            {...{
              closeDeclineModal: this.closeDeclineModal,
              changeMessage: this.changeMessage,
              declineApplication: this.declineApplication,
              selectedApplication
            }}
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
  job,
  profile
});

const mapDispatchToProps = dispatch => ({
  deleteJob: (centre_id, job_id) =>
    dispatch(Creators.deleteJobAttempt(centre_id, job_id)),
  getJobApplications: (centre_id, job_id) =>
    dispatch(Creators.getJobApplicationsAttempt(centre_id, job_id)),
  declineJobApplication: (centre_id, job_id, application_id, params) =>
    dispatch(
      Creators.declineJobApplicationAttempt(
        centre_id,
        job_id,
        application_id,
        params
      )
    ),
  interviewJobApplication: (centre_id, job_id, application_id, params) =>
    dispatch(
      Creators.interviewJobApplicationAttempt(
        centre_id,
        job_id,
        application_id,
        params
      )
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobsAdminApprenticeRoute);
