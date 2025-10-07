import React, { Component } from 'react';
import { cond, equals, T, always, map, filter, reject } from 'ramda';
import { connect } from 'react-redux';
import { Creators } from '../../actions';
import {
  AdminHeader,
  AdminTabs,
  AdminNav,
  JobsNavigation,
  JobsAdminAdvertAdd,
  JobsAdminAdvertLivePreview,
  JobsAdminApprenticeshipAdd,
  JobsAdminApprenticeshipLivePreview,
  JobsAdminPost,
  JobsAdminNew
} from '../../components';
import common from 'app/common';

const { Footer, ContentModal, ContentModalConfirm } = common.components;

class JobsAdminNewRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobType: 0,
      media: [],
      errorText: ''
    };
    this.mapSearchTimer = null;
    this.setJobType = this.setJobType.bind(this);
    this.openJobPostModal = this.openJobPostModal.bind(this);
    this.closeJobPostModal = this.closeJobPostModal.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.addMedia = this.addMedia.bind(this);
    this.removeMedia = this.removeMedia.bind(this);
    this.postJob = this.postJob.bind(this);
    this.saveJob = this.saveJob.bind(this);
    this.onSectorChange = this.onSectorChange.bind(this);
    this.validateAdvert = this.validateAdvert.bind(this);
    this.getJobToEdit = this.getJobToEdit.bind(this);
    this.jobDeleteClick = this.jobDeleteClick.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.setupMedia = this.setupMedia.bind(this);
    this.confirmModal = null;
  }

  // componentDidMount() {
  //   const { createJob } = this.props;
  //   createJob({
  //     centre_id: 1301,
  //     job_type_id: 3,
  //     abstract_sector_id: 2,
  //     title: 'Test title',
  //     description: 'Test description',
  //     address: 'Address 1',
  //     lat: '12314',
  //     lng: '12312'
  //   });
  // }

  componentDidMount() {
    const job = this.getJobToEdit();
    if (job) {
      this.setState({
        jobType: job.job_type_id
      });
    }
  }

  onLocationChange(e) {
    const { getCoordsByLocation } = this.props;
    const { value: locationString } = e.target;
    if (locationString.length > 3) {
      clearTimeout(this.mapSearchTimer);
      this.mapSearchTimer = setTimeout(() => {
        getCoordsByLocation(locationString);
      }, 1000);
    }
  }

  onSectorChange(e) {
    const { getJobQualifications } = this.props;
    const { value } = e.target;
    if (value !== '-1') {
      getJobQualifications(e.target.value);
    }
  }

  setJobType(type) {
    this.setState({
      jobType: type
    });
  }

  addMedia(file) {
    const { media } = this.state;
    this.setState({
      media: [...media, file]
    });
  }
  setupMedia(media) {
    this.setState({
      media
    });
  }
  removeMedia(index) {
    const { media } = this.state;
    const filteredMedia = media.filter((m, i) => i !== index);
    this.setState({
      media: filteredMedia
    });
  }
  openJobPostModal() {
    const { form } = this.props;
    if (form.values) {
      this.jobPostModal.open();
    }
  }

  closeJobPostModal() {
    this.jobPostModal.close();
  }

  filterSelectItems(num, items) {
    return items.filter(item => item > +num);
  }

  validateAdvert(params) {
    if (!params.title) {
      this.setState({ errorText: 'Job title is required' });
      return false;
    }
    if (!params.address) {
      this.setState({ errorText: 'Job address is required' });
      return false;
    }
    if (!params.lat && !params.lng) {
      this.setState({ errorText: 'Job address must be correct' });
      return false;
    }
    if (!params.abstract_sector_id) {
      this.setState({ errorText: 'Job sector must be selected' });
      return false;
    }
    if (!params.qualifications || params.qualifications.length <= 0) {
      this.setState({ errorText: 'Job qualification must be selected' });
      return false;
    }
    if (!params.description) {
      this.setState({ errorText: 'Job additional details is required' });
      return false;
    }
    return true;
  }

  getJobToEdit() {
    const { job, router } = this.props;
    if (router.location.query.edit) {
      const jobToEdit = job.jobs.find(
        j => j.job_id === +router.location.query.edit
      );
      const savedJobToEdit = job.savedJobs.find(
        j => j.job_id === +router.location.query.edit
      );
      if (jobToEdit) return jobToEdit;
      if (savedJobToEdit) return savedJobToEdit;
    }
    return null;
  }

  postJob() {
    const { form, job, createJob, updateJob, profile, router } = this.props;
    const { jobType, media } = this.state;
    const { centre_id } = profile.user.centres[0];
    const jobToEdit = this.getJobToEdit();
    const files = map(m => m.file, media);
    const params = {
      ...form.values,
      media: filter(file => file, files),
      job_type_id: jobType,
      qualifications: form.values.qualifications
        ? [form.values.qualifications]
        : [],
      centre_id: form.values.centre_id || centre_id,
      lat: job.jobLocationCoords ? job.jobLocationCoords.lat : null,
      lng: job.jobLocationCoords ? job.jobLocationCoords.lng : null
    };
    const rejectedParams = reject(x => x === null, params);
    if (this.validateAdvert(rejectedParams) && !jobToEdit) {
      createJob(centre_id, rejectedParams);
    } else if (this.validateAdvert(rejectedParams) && jobToEdit) {
      updateJob(+router.location.query.edit, rejectedParams);
    }
    this.jobPostModal.close();
  }
  saveJob() {
    const { form, job, saveJob, profile } = this.props;
    const { jobType, media } = this.state;
    const { centre_id } = profile.user.centres[0];

    const params = {
      ...form.values,
      media: map(m => m.file, media),
      job_type_id: jobType,
      qualifications:
        form.values && form.values.qualifications
          ? [form.values.qualifications]
          : [],
      centre_id,
      lat: job.jobLocationCoords ? job.jobLocationCoords.lat : null,
      lng: job.jobLocationCoords ? job.jobLocationCoords.lng : null
    };
    if (this.validateAdvert(params)) {
      saveJob(centre_id, params);
    }
    this.jobPostModal.close();
  }
  jobDeleteClick() {
    this.confirmModal.open();
  }
  deleteJob() {
    const { deleteJob, profile } = this.props;
    const job = this.getJobToEdit();
    if (!job) return;
    deleteJob(profile.user.centres[0].centre_id, job.job_id);
  }
  render() {
    const {
      job,
      form,
      profile: { user },
      setCoords,
      updateJob
    } = this.props;
    const { jobType, media, errorText } = this.state;
    const jobToEdit = this.getJobToEdit();
    return (
      <div className="jobs-container">
        <AdminHeader />
        <JobsNavigation>
          <div className="column is-7 is-paddingless is-marginless">
            <AdminTabs />
          </div>
          <div className="column is-5 is-paddingless is-marginless">
            <AdminNav isViewMode={false} />
          </div>
        </JobsNavigation>

        <section className="separated jobs-feed">
          <div className="min-content-height columns is-paddingless is-marginless">
            <div className="column is-7 is-paddingless right-box-shadow">
              {cond([
                [
                  equals(1),
                  always(
                    <JobsAdminAdvertAdd
                      {...{
                        onLocationChange: this.onLocationChange,
                        addMedia: this.addMedia,
                        removeMedia: this.removeMedia,
                        filterSelectItems: this.filterSelectItems,
                        salary_min:
                          form && form.values && form.values.salary_min
                            ? form.values.salary_min
                            : 0,
                        experience_min:
                          form && form.values && form.values.experience_min
                            ? form.values.experience_min
                            : 0,
                        media,
                        sectors: user.sectors,
                        errorText,
                        setCoords,
                        editJob: jobToEdit,
                        qualifications: job.qualifications,
                        setupMedia: this.setupMedia,
                        onSectorChange: this.onSectorChange
                      }}
                    />
                  )
                ],
                [
                  equals(3),
                  always(
                    <JobsAdminApprenticeshipAdd
                      {...{
                        onLocationChange: this.onLocationChange,
                        addMedia: this.addMedia,
                        removeMedia: this.removeMedia,
                        filterSelectItems: this.filterSelectItems,
                        salary_min:
                          form && form.values && form.values.salary_min
                            ? form.values.salary_min
                            : 0,
                        experience_min:
                          form && form.values && form.values.experience_min
                            ? form.values.experience_min
                            : 0,
                        media,
                        sectors: user.sectors,
                        errorText,
                        setCoords,
                        user,
                        editJob: jobToEdit,
                        setupMedia: this.setupMedia,
                        qualifications: job.qualifications,
                        onSectorChange: this.onSectorChange
                      }}
                    />
                  )
                ],
                [
                  T,
                  always(<JobsAdminNew {...{ setJobType: this.setJobType }} />)
                ]
              ])(jobType)}
            </div>
            <div className="column is-5 is-paddingless">
              {cond([
                [
                  equals(1),
                  always(
                    <JobsAdminAdvertLivePreview
                      {...{
                        openJobPostModal: this.openJobPostModal,
                        jobLocationCoords: job.jobLocationCoords,
                        media,
                        values: form && form.values,
                        user,
                        jobToEdit,
                        updateJob,
                        qualifications: job.qualifications,
                        saveJob: this.saveJob,
                        jobDeleteClick: this.jobDeleteClick
                      }}
                    />
                  )
                ],
                [
                  equals(3),
                  always(
                    <JobsAdminApprenticeshipLivePreview
                      {...{
                        openJobPostModal: this.openJobPostModal,
                        jobLocationCoords: job.jobLocationCoords,
                        media,
                        values: form && form.values,
                        user,
                        jobToEdit,
                        qualifications: job.qualifications,
                        saveJob: this.saveJob,
                        jobDeleteClick: this.jobDeleteClick
                      }}
                    />
                  )
                ],
                [T, always('')]
              ])(jobType)}
            </div>
          </div>
        </section>

        <ContentModal
          className="jobs-post-modal"
          ref={e => {
            this.jobPostModal = e;
          }}
        >
          <JobsAdminPost
            {...{
              closeJobPostModal: this.closeJobPostModal,
              postJob: this.postJob,
              form
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

const mapStateToProps = ({ form, job, profile }) => ({
  form: form.jobsAddForm,
  job,
  profile
});

const mapDispatchToProps = dispatch => ({
  createJob: (centre_id, params) =>
    dispatch(Creators.createJobAttempt(centre_id, params)),
  getCoordsByLocation: locationString =>
    dispatch(Creators.getCoordsByLocationAttempt(locationString)),
  getJobQualifications: sector_id =>
    dispatch(Creators.getJobQualificationsAttempt(sector_id)),
  updateJob: (centre_id, job_id) =>
    dispatch(Creators.updateJobAttempt(centre_id, job_id)),
  saveJob: (centre_id, params) =>
    dispatch(Creators.saveJobAttempt(centre_id, params)),
  deleteJob: (centre_id, job_id) =>
    dispatch(Creators.deleteJobAttempt(centre_id, job_id)),
  setCoords: coords => dispatch(Creators.getCoordsByLocationSuccess(coords))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobsAdminNewRoute);
