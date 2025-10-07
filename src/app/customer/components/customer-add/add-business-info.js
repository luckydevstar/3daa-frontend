import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getNames } from 'country-list';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router';
import cx from 'classnames';

import common from 'app/common';

const FORM_NAME = 'customerAddBusinessInfoForm';
const {
  components: {
    Form: { field, select }
  }
} = common;

class AddBusinessInfoForm extends Component {
  uploadClick() {
    const uploadBtn = document.querySelector('#organization_media_photo');
    uploadBtn.click();
  }
  render() {
    const {
      pristine,
      handleSubmit,
      submitting,
      uiLoadingCustomer,
      business_owner,
      business_name,
      business_website,
      business_number,
      address_line_1,
      address_line_2,
      town_city,
      postcode,
      country,
      setBusinessOwner,
      setBusinessName,
      setBusinessWebsite,
      setBusinessNumber,
      setAddressLine1,
      setAddressLine2,
      setCountry,
      setTownCity,
      setPostcode,
      organization_media,
      uploadFile,
      errorText
    } = this.props;
    console.log(town_city);
    return (
      <form onSubmit={handleSubmit} className="business-info-form">
        <div className="inner-form">
          <div className="m-b-40">
            <h2 className="has-text-centered">
              Tell us a little more about the business
            </h2>
          </div>
          {errorText && (
            <div className="customer-add_error-text">{errorText}</div>
          )}
          <div className="columns">
            <div className="column is-12">
              <label className="label" htmlFor="ownerDetails">
                Owner Details
                <span className="required">*</span>
              </label>
              <Field
                name="ownerDetails"
                component={field}
                className="is-marginless"
                placeholder="Owner Details"
                props={{ value: business_owner }}
                onChange={e => {
                  setBusinessOwner(e.target.value);
                }}
              />
              <p>
                You can pass ownership to any other active user from your
                profile
              </p>
            </div>
          </div>

          <div className="columns">
            <div className="column is-12">
              <label className="label" htmlFor="photo">
                Organization Profile photo
                <span className="required">*</span>
              </label>
            </div>
          </div>

          <div className="columns logo-add-zone">
            <div className="column is-3">
              {organization_media && organization_media.url && (
                <img src={organization_media.url} alt="" />
              )}
              {!organization_media && <div className="logo" />}
            </div>
            <div className="column is-3">
              <label htmlFor="organization_media_photo">
                <button
                  type="button"
                  onClick={this.uploadClick}
                  className="button is-primary is-outlined"
                >
                  Change
                </button>
                <input
                  type="file"
                  name="organization_media"
                  id="organization_media_photo"
                  onChange={uploadFile}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div className="columns">
            <div className="column is-12">
              <label className="label" htmlFor="businessDetails">
                Business Details
              </label>
              <div className="customer-business-field">
                <Field
                  name="companyName"
                  component={field}
                  className="is-marginless"
                  placeholder="Company Name"
                  props={{ value: business_name }}
                  onChange={e => {
                    setBusinessName(e.target.value);
                  }}
                />
                <span className="required">*</span>
              </div>

              <Field
                name="Website"
                component={field}
                className="is-marginless"
                placeholder="Website"
                props={{ value: business_website }}
                onChange={e => {
                  setBusinessWebsite(e.target.value);
                }}
              />
              <div className="customer-business-field">
                <Field
                  name="contactNumber"
                  component={field}
                  className="is-marginless"
                  placeholder="Contact Number"
                  props={{ value: business_number }}
                  onChange={e => {
                    setBusinessNumber(e.target.value);
                  }}
                />
                <span className="required">*</span>
              </div>
            </div>
          </div>

          <div className="columns">
            <div className="column is-12">
              <label className="label" htmlFor="businessAddress">
                Business Address
              </label>
              <div className="customer-business-field">
                <Field
                  name="addressLine1"
                  component={field}
                  className="is-marginless"
                  placeholder="Address Line 1"
                  required
                  props={{ value: address_line_1 }}
                  onChange={e => {
                    setAddressLine1(e.target.value);
                  }}
                />
                <span className="required">*</span>
              </div>
              <Field
                name="addressLine2"
                component={field}
                className="is-marginless"
                placeholder="Address Line 2"
                props={{ value: address_line_2 }}
                onChange={e => {
                  setAddressLine2(e.target.value);
                }}
              />
              <div className="customer-business-field">
                <Field
                  name="town"
                  component={field}
                  className="is-marginless"
                  placeholder="Town / City"
                  props={{ value: town_city }}
                  onChange={e => {
                    setTownCity(e.target.value);
                  }}
                />
                <span className="required">*</span>
              </div>
              <div className="customer-business-field">
                <Field
                  name="postcode"
                  component={field}
                  className="is-marginless width-30"
                  placeholder="Postcode"
                  props={{ value: postcode }}
                  onChange={e => {
                    setPostcode(e.target.value);
                  }}
                />
                <span className="required" style={{ left: '145px' }}>
                  *
                </span>
              </div>
              <Field
                name="country"
                component={select}
                className="is-marginless width-100"
                placeholder="Country"
                props={{ value: country }}
                onChange={e => {
                  setCountry(e.target.value);
                }}
              >
                <option>Select country</option>
                {getNames().map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Field>
            </div>
          </div>

          <div className="columns m-t-30">
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

AddBusinessInfoForm.propTypes = {
  uiLoadingCustomer: PropTypes.bool
};

AddBusinessInfoForm.defaultProps = {
  uiLoadingCustomer: false
};

const AddBusinessInfo = reduxForm({
  form: FORM_NAME,
  validate
})(AddBusinessInfoForm);

export default AddBusinessInfo;
