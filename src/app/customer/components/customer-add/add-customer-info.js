import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import cx from 'classnames';

import common from 'app/common';

const FORM_NAME = 'customerAddInfoForm';
const {
  components: {
    Form: { field: InputFiled }
  }
} = common;

class AddCustomerInfoForm extends Component {
  uploadClick() {
    const uploadBtn = document.querySelector('#upload-customer-logo');
    uploadBtn.click();
  }
  render() {
    const {
      pristine,
      handleSubmit,
      submitting,
      uiLoadingCustomer,
      firstname,
      lastname,
      email,
      contact_number,
      logo_media,
      setFirstName,
      setLastName,
      setEmail,
      setContactNumber,
      setGender,
      uploadFile,
      errorText,
      gender
    } = this.props;
    return (
      <form onSubmit={handleSubmit} className="customer-info-form">
        <div className="inner-form">
          <div className="m-b-40">
            <h2 className="has-text-centered">Lets add a Customer</h2>
          </div>

          {errorText && (
            <div className="customer-add_error-text">{errorText}</div>
          )}
          <label className="label" htmlFor="logo">
            Upload the customers logo
            <span className="required">*</span>
          </label>
          <div className="columns logo-add-zone">
            <div className="column is-6">
              <p className="label">Logo must be...</p>
              <p>250x250 eg</p>
              <p>TBC</p>
            </div>
            <div className="column is-3">
              {logo_media && <img src={logo_media.url} alt="" />}
              {!logo_media && <div className="customer-add__default-logo" />}
            </div>
            <div className="column is-3">
              <label htmlFor="upload-customer-logo">
                <button
                  type="button"
                  className="button is-default"
                  onClick={this.uploadClick}
                >
                  Upload
                </button>
                <input
                  onChange={uploadFile}
                  type="file"
                  id="upload-customer-logo"
                  name="logo_media"
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <h4 className="m-t-30 m-b-10">Main Contact for Super-Admin:</h4>

          <div className="columns">
            <div className="column is-4">
              <label className="label" htmlFor="firstName">
                Firstname
                <span className="required">*</span>
              </label>
              <Field
                name="firstName"
                component={InputFiled}
                placeholder="Firstname"
                props={{ value: firstname }}
                onChange={e => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <div className="column is-8">
              <label className="label" htmlFor="lastName">
                Lastname
                <span className="required">*</span>
              </label>
              <Field
                name="lastName"
                component={InputFiled}
                placeholder="Lastname"
                props={{ value: lastname }}
                onChange={e => {
                  setLastName(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="columns">
            <div className="column is-8">
              <label className="label" htmlFor="email">
                Email address
                <span className="required">*</span>
              </label>
              <Field
                name="email"
                component={InputFiled}
                placeholder="Email"
                props={{ value: email }}
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="field m-b-30">
            <div className="label">
              Gender <span className="required">*</span>
            </div>
            <div className="control">
              <label className="custom radio">
                <Field
                  type="radio"
                  name="gender"
                  value="male"
                  component="input"
                  checked={gender === 'male'}
                  onChange={e => {
                    setGender(e.target.value);
                  }}
                />
                <span className="ui" />
                Male
              </label>
              <label className="custom radio">
                <Field
                  type="radio"
                  name="gender"
                  value="female"
                  component="input"
                  checked={gender === 'female'}
                  onChange={e => {
                    setGender(e.target.value);
                  }}
                />
                <span className="ui" />
                Female
              </label>
            </div>
          </div>

          <div className="columns m-b-40">
            <div className="column is-6">
              <label className="label" htmlFor="contact">
                Contact Number
                <span className="required">*</span>
              </label>
              <Field
                name="contact"
                component={InputFiled}
                placeholder="e.g 07976 123 456"
                props={{ value: contact_number }}
                onChange={e => {
                  setContactNumber(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="columns">
            <div className="column is-6 is-offset-3">
              <button
                className={cx('button is-primary is-fullwidth', {
                  'is-loading': uiLoadingCustomer
                })}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const validate = () => {
  const errors = {};
  return errors;
};

AddCustomerInfoForm.propTypes = {
  uiLoadingCustomer: PropTypes.bool
};

AddCustomerInfoForm.defaultProps = {
  uiLoadingCustomer: false
};

const AddCustomerInfo = reduxForm({
  form: FORM_NAME,
  validate
})(AddCustomerInfoForm);

export default AddCustomerInfo;
