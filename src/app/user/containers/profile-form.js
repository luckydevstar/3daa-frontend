import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import common from 'app/common';

const UILoading = common.components.UILoading;

const renderField = ({ input, label, type, meta: { touched, error } }) =>
  <div className="control">
    <label className="label">
      {label}
    </label>
    <p className="control">
      <input className="input" {...input} placeholder={label} type={type} />
      {touched &&
        error &&
        <span>
          {error}
        </span>}
    </p>
  </div>;

const ProfileForm = props => {
  const { attempting, handleSubmit, submitting } = props;

  return (
    <div className="register-form container">
      {' '}{attempting
        ? <UILoading />
        : <form onSubmit={handleSubmit(this.props.onProfileUpdateAttempt)}>
            <Field
              name="firstName"
              type="text"
              component={renderField}
              label="First Name"
            />
            <Field
              name="lastName"
              type="text"
              component={renderField}
              label="Last Name"
            />

            <div className="control">
              <label className="label">Gender</label>
              <p className="control">
                <label className="radio">
                  Male
                  <input type="radio" name="gender" />
                </label>
                <label className="radio">
                  Female
                  <input type="radio" name="gender" />
                </label>
              </p>
            </div>

            <div className="control">
              <button
                className="button is-success"
                type="submit"
                disabled={submitting}
              >
                Save
              </button>
              <button
                className="button is-danger is-pulled-right"
                type="button"
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>}
    </div>
  );
};

ProfileForm.propTypes = {
  onProfileUpdateAttempt: PropTypes.func.isRequired,
  attempting: PropTypes.bool
};

export default reduxForm({
  form: 'profile'
})(ProfileForm);
