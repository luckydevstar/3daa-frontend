import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { map } from 'ramda';
import Isvg from 'react-inlinesvg';

import IconAdd from 'images/icon-add-new-qualification.svg';
import ExImage from 'images/avatar_example.png';
import common from 'app/common';
import util from 'app/user/util/';
const { createCloudinaryUrl } = common.util.helpers;

const { FormUtil } = util;

const salaryItems = [
  1000,
  2000,
  3000,
  4000,
  5000,
  6000,
  7000,
  8000,
  9000,
  10000,
  11000,
  12000,
  13000,
  14000,
  15000,
  16000,
  17000,
  18000,
  19000,
  20000,
  21000,
  22000,
  23000,
  24000,
  25000,
  26000,
  27000,
  28000,
  29000,
  30000
];
const experienceItems = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20
];

const {
  Form: { field: FormField, textarea: FormTextArea, select: FormSelect }
} = common.components;

const FORM_NAME = 'jobsAddForm';

class JobsAdminAdvertAdd extends React.Component {
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
        qualifications: editJob.qualifications[0].qualification_id,
        abstract_sector_id: editJob.abstract_sector_id,
        website: editJob.website,
        reference: editJob.reference,
        contact_member_id: editJob.contact_member_id,
        contact_role: editJob.contact_role,
        contact_details: editJob.contact_details,
        salary_min: editJob.salary_min,
        salary_max: editJob.salary_max,
        salary_period: editJob.salary_period,
        experience_min: editJob.experience_min,
        experience_max: editJob.experience_max
      });
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
  fileUpload(e) {
    const { addMedia } = this.props;
    const { files } = e.target;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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
      errorText
    } = this.props;
    console.log(media);
    return (
      <section className="jobs-form">
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
              <div className="column is-4">
                <label htmlFor="salary" className="label">
                  Salary
                </label>
              </div>
              <div className="column is-8 justify-content-end">
                <p className="m-l-30 m-r-30">From</p>
                <Field
                  id="fromSalary"
                  name="salary_min"
                  component={FormSelect}
                  defaultValue="1000"
                >
                  {salaryItems.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
                <p className="m-l-30 m-r-30">To</p>
                <Field id="toSalary" name="salary_max" component={FormSelect}>
                  {filterSelectItems(salary_min, salaryItems).map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
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
                        multiple
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
                <label htmlFor="addContact" className="label">
                  Add Contact
                </label>
              </div>
              <div className="column is-8">
                <Field
                  id="addContact"
                  name="addContact"
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
                    <option>Select qualification</option>
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
                <label htmlFor="experience" className="label">
                  Experience
                </label>
              </div>
              <div className="column is-8 justify-content-end">
                <p className="m-l-30 m-r-30">From</p>
                <Field
                  id="fromExperience"
                  name="experience_min"
                  component={FormSelect}
                >
                  {experienceItems.map(item => (
                    <option key={item} value={item}>
                      {item} Yrs
                    </option>
                  ))}
                </Field>
                <p className="m-l-30 m-r-30">To</p>
                <Field
                  id="toExperience"
                  name="experience_max"
                  component={FormSelect}
                >
                  {filterSelectItems(experience_min, experienceItems).map(
                    item => (
                      <option key={item} value={item}>
                        {item} Yrs
                      </option>
                    )
                  )}
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
          </form>
        </div>
      </section>
    );
  }
}

const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'interview_date').validDate();
  return errors;
};

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate
})(JobsAdminAdvertAdd);
