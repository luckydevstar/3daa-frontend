import React from 'react';
import moment from 'moment';
import { Field, reduxForm } from 'redux-form';
import { map } from 'ramda';
import Isvg from 'react-inlinesvg';

import IconAdd from 'images/icon-add-new-qualification.svg';
import ExImage from 'images/avatar_example.png';
import common from 'app/common';
import util from 'app/user/util/';
import renderers from '../../../workbooks/components/workbook-preview/renderers';

const { FormUtil } = util;
const { createCloudinaryUrl } = common.util.helpers;

const {
  Form: { field: FormField, textarea: FormTextArea, select: FormSelect }
} = common.components;

const FORM_NAME = 'jobsAddForm';

class JobsAdminApprenticeshipAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.fileUpload = this.fileUpload.bind(this);
  }
  componentDidMount() {
    const { initialize, editJob, setCoords, setupMedia } = this.props;
    if (editJob) {
      initialize({
        title: editJob.title,
        address: editJob.address,
        description: editJob.description,
        qualifications: editJob.qualifications[0].abstract_qualification_id,
        abstract_sector_id: editJob.abstract_sector_id,
        media: editJob.media,
        website: editJob.website,
        centre_id: editJob.centre_id,
        reference: editJob.reference,
        contact_member_id: editJob.contact_member_id,
        contact_role: editJob.contact_role,
        contact_details: editJob.contact_details,
        employer: editJob.employer,
        about_employer: editJob.about_employer,
        working_hours_per_week: editJob.working_hours_per_week,
        salary: editJob.salary,
        salary_min: editJob.salary_min,
        salary_max: editJob.salary_max,
        salary_period: editJob.salary_period,
        experience_min: editJob.experience_min,
        experience_max: editJob.experience_max,
        apprenticeship_duration: editJob.apprenticeship_duration,
        apprenticeship_period: editJob.apprenticeship_period,
        apprenticeship_working_week_details:
          editJob.apprenticeship_working_week_details,
        apprenticeship_level: editJob.apprenticeship_level,
        apprenticeship_start_date: editJob.apprenticeship_start_date,
        apprenticeship_end_date: editJob.apprenticeship_end_date,
        apprenticeship_week_start: editJob.apprenticeship_week_start,
        apprenticeship_week_end: editJob.apprenticeship_week_end,
        apprenticeship_framework: editJob.apprenticeship_framework,
        additional_qualifications_required:
          editJob.additional_qualifications_required,
        personal_qualities: editJob.personal_qualities,
        desired_skills: editJob.desired_skills,
        things_to_consider: editJob.things_to_consider,
        future_prospects: editJob.future_prospects
      });
      console.log(editJob.media);
      console.log(
        map(
          m => ({ url: createCloudinaryUrl(m.cloudinary_file_id), file: null }),
          editJob.media
        )
      );
      setupMedia(
        map(
          m => ({ url: createCloudinaryUrl(m.cloudinary_file_id), file: null }),
          editJob.media
        )
      );
      setCoords({
        lat: editJob.lat,
        lng: editJob.lng
      });
    }
  }
  getYears(count) {
    const years = [];
    const year = moment();
    years.push(+year.format('YYYY'));
    for (let i = 0; i < count; i++) {
      year.add(1, 'year');
      years.push(+year.format('YYYY'));
    }
    return years;
  }
  fileUpload(e) {
    const { addMedia } = this.props;
    const file = e.target.files[0];
    if (file.type.indexOf('image') !== -1) {
      const reader = new FileReader();
      reader.onload = event => {
        addMedia({
          url: event.target.result,
          file
        });
      };
      reader.readAsDataURL(file);
    }
  }
  render() {
    const {
      onLocationChange,
      media,
      removeMedia,
      filterSelectItems,
      salary_min,
      experience_min,
      sectors,
      qualifications,
      onSectorChange,
      errorText,
      user
    } = this.props;
    const workingHours = new Array(51).fill(1);
    const duration = new Array(32).fill(1);
    console.log(media);
    return (
      <div className="jobs-add-form">
        {errorText && <div className="jobs-add__error">{errorText}</div>}
        <form method="post">
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="jobTitle" className="label">
                Add Job Title
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="jobTitle"
                name="title"
                type="text"
                component={FormField}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="jobLocation" className="label">
                Add Location
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="jobLocation"
                name="address"
                type="text"
                component={FormField}
                onChange={onLocationChange}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4 align-items-start">
              <label htmlFor="addMedia" className="label">
                Add Media
              </label>
            </div>
            <div className="column is-8">
              <div className="columns is-multiline" style={{ width: '100%' }}>
                <div className="column is-4 add-media-container">
                  <label htmlFor="upload-job-media">
                    <div className="add-media">
                      <Isvg src={IconAdd} />
                      <p>Add Media</p>
                    </div>
                    <input
                      type="file"
                      id="upload-job-media"
                      onChange={this.fileUpload}
                    />
                  </label>
                </div>
                {media.map((m, i) => (
                  <div className="column is-4" key={i}>
                    <div className="item-media">
                      <img src={m.url} alt="" />
                      <i
                        className="fa fa-times-circle-o"
                        onClick={() => {
                          removeMedia(i);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="salary" className="label">
                Salary/Weekly wage
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="salary"
                name="salary"
                type="text"
                component={FormField}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="workingWeek" className="label">
                Working week
              </label>
            </div>
            <div className="column is-8 ">
              <p className="m-l-30 m-r-30">From</p>
              <Field
                id="fromWeek"
                name="apprenticeship_week_start"
                component={FormSelect}
              >
                {moment.weekdaysShort().map(w => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </Field>
              <p className="m-l-30 m-r-30">To</p>
              <Field
                id="toWeek"
                name="apprenticeship_week_end"
                component={FormSelect}
              >
                {moment.weekdaysShort().map(w => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </Field>
            </div>
          </div>
          <div className="columns">
            <div className="column is-4 align-items-start">
              <label htmlFor="weekAddDetails" className="label">
                Working week Additional Details
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="weekAddDetails"
                name="apprenticeship_working_week_details"
                type="textarea"
                component={FormTextArea}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="totalHours" className="label">
                Total hours per week
              </label>
            </div>
            <div className="column is-4">
              <Field
                id="totalHours"
                name="working_hours_per_week"
                className="control"
                component={FormSelect}
              >
                {workingHours.map((h, i) => (
                  <option key={i} value={i}>{`${i} Hrs`}</option>
                ))}
              </Field>
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="apprenticeDuration" className="label">
                Apprenticeship duration
              </label>
            </div>
            <div className="column is-4">
              <Field
                id="apprenticeDuration"
                name="apprenticeship_duration"
                className="control"
                component={FormSelect}
              >
                {duration.map((h, i) => (
                  <option key={i} value={i}>{`${i} Yrs`}</option>
                ))}
              </Field>
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="possibleStartDate" className="label">
                Possible start date
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="possibleStartDay"
                name="possibleStartDay"
                className="control m-10"
                component={FormSelect}
              >
                {duration.map((d, i) => (
                  <option key={i} value={i}>{`${i} Day`}</option>
                ))}
              </Field>
              <Field
                id="possibleStartMonth"
                name="possibleStartMonth"
                className="control m-10"
                component={FormSelect}
              >
                {moment.months().map((month, i) => (
                  <option key={month} value={i}>
                    {month}
                  </option>
                ))}
              </Field>
              <Field
                id="possibleStartYear"
                name="possibleStartYear"
                className="control m-10"
                component={FormSelect}
              >
                `
                {this.getYears(5).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Field>
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="apprenticeshipLevel" className="label">
                Apprenticeship level
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="apprenticeshipLevel"
                name="apprenticeship_level"
                type="text"
                component={FormField}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="experience" className="label">
                Experience Required
              </label>
            </div>
            <div className="column is-8">
              <p className="m-l-30 m-r-30">From</p>
              <Field
                id="fromExperience"
                name="experience_min"
                component={FormSelect}
              >
                {workingHours.map((f, i) => (
                  <option key={i} value={i}>{`${i} Yrs`}</option>
                ))}
              </Field>
              <p className="m-l-30 m-r-30">To</p>
              <Field
                id="toExperience"
                name="experience_max"
                component={FormSelect}
              >
                {workingHours.map((f, i) => (
                  <option key={i} value={i}>{`${i} Yrs`}</option>
                ))}
              </Field>
            </div>
          </div>
          <div className="columns">
            <div className="column is-4 align-items-start">
              <label htmlFor="addDetails" className="label">
                Additional Details
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="addDetails"
                name="description"
                type="textarea"
                component={FormTextArea}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4 align-items-start">
              <label htmlFor="desiredSkills" className="label">
                Desired skills
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="desiredSkills"
                name="desired_skills"
                type="textarea"
                component={FormTextArea}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4 align-items-start">
              <label htmlFor="personalQualities" className="label">
                Personal Qualities
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="personalQualities"
                name="personal_qualities"
                type="textarea"
                component={FormTextArea}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="qualifications" className="label">
                Add Sector
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="qualifications"
                name="abstract_sector_id"
                className="control"
                component={FormSelect}
                onChange={onSectorChange}
              >
                <option value="-1">Select Sector</option>
                {sectors &&
                  sectors.length > 0 &&
                  sectors.map(sector => (
                    <option key={sector.sector_id} value={sector.sector_id}>
                      {sector.title}
                    </option>
                  ))}
              </Field>
            </div>
          </div>
          {qualifications.length > 0 && (
            <div className="columns">
              <div className="column is-4">
                <label htmlFor="qualifications" className="label">
                  Add Qualifications
                </label>
              </div>
              <div className="column is-8">
                <Field
                  id="qualifications"
                  name="qualifications"
                  className="control"
                  component={FormSelect}
                >
                  <option value="-1">Select Qualification</option>
                  {qualifications.map(qualification => (
                    <option
                      key={qualification.qualification_id}
                      value={qualification.qualification_id}
                    >
                      {qualification.title}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
          )}
          <div className="columns">
            <div className="column is-4 align-items-start">
              <label
                htmlFor="AdditionalQualificationRequired"
                className="label"
              >
                Additional Qualifications required
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="AdditionalQualificationRequired"
                name="additional_qualifications_required"
                type="textarea"
                component={FormTextArea}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4 align-items-start">
              <label htmlFor="futureProspects" className="label">
                Future prospects
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="futureProspects"
                name="future_prospects"
                type="textarea"
                component={FormTextArea}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4 align-items-start">
              <label htmlFor="thingsToConsider" className="label">
                Things to consider
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="thingsToConsider"
                name="things_to_consider"
                type="textarea"
                component={FormTextArea}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4 align-items-start">
              <label htmlFor="aboutTheEmployer" className="label">
                About the employer
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="aboutTheEmployer"
                name="about_employer"
                type="textarea"
                component={FormTextArea}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="employer" className="label">
                Employer
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="employer"
                name="employer"
                type="text"
                component={FormField}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4 align-items-start">
              <label htmlFor="address" className="label">
                Address
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="address"
                name="addresss"
                type="textarea"
                component={FormTextArea}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="trainingProvider" className="label">
                Training provider
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="trainingProvider"
                name="centre_id"
                type="text"
                component={FormSelect}
              >
                <option key="-1">Select Training provider</option>
                {user.centres.map(centre => (
                  <option key={centre.centre_id} value={centre.centre_id}>
                    {centre.centre_name}
                  </option>
                ))}
              </Field>
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="apprenticeshipFramework" className="label">
                Apprenticeship framework
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="apprenticeshipFramework"
                name="apprenticeship_framework"
                type="text"
                component={FormField}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="contact" className="label">
                Contact
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="contact"
                name="contact"
                type="text"
                component={FormField}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="addContact" className="label">
                Add Contact
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="addContact"
                name="contact_member_id"
                type="text"
                component={FormField}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="role" className="label">
                Role
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="role"
                name="contact_role"
                type="text"
                component={FormField}
              />
            </div>
          </div>

          <div className="columns">
            <div className="column is-4 align-items-start">
              <label htmlFor="roleDetails" className="label">
                Add Role Details
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="roleDetails"
                name="contact_details"
                type="textarea"
                component={FormTextArea}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="companyWebsite" className="label">
                Company Website
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="companyWebsite"
                name="website"
                type="text"
                component={FormField}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-4">
              <label htmlFor="jobReference" className="label">
                Job Reference
              </label>
            </div>
            <div className="column is-8">
              <Field
                id="jobReference"
                name="reference"
                type="text"
                component={FormField}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const JobsAdminApprenticeshipAdd = props => {
  return (
    <section className="jobs-form">
      <ConnectedForm {...props} />
    </section>
  );
};

const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'interview_date').validDate();
  return errors;
};

const ConnectedForm = reduxForm({ form: FORM_NAME, validate })(
  JobsAdminApprenticeshipAddForm
);

export default JobsAdminApprenticeshipAdd;
