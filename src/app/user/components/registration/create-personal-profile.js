import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import common from 'app/common';
import classnames from 'classnames';
import * as lodash from 'lodash';

import { Text, Field } from 'app/intl';
import FormUtil from '../../util/form-util';
import AvatarUploadField from '../avatar-upload-field';

const {
  components: {
    Form: { field, dateform },
    PasswordStrength
  },
  util: {
    helpers: { noop }
  }
} = common;
const FormField = field;
const FormDate = dateform;

const FORM_NAME = 'register-personal-profile';

class CreatePersonalProfile extends React.Component {
  render() {
    const {
      user,
      formData,
      handleSubmit,
      onRegisterStep,
      sendingRequest,
      valid,
      pristine,
      submitting
    } = this.props;

    const nextClass = classnames('button is-primary', {
      'is-loading': sendingRequest
    });

    return (
      <form className="profile form" onSubmit={handleSubmit(onRegisterStep)}>
        <h1>
          <Text iKey="hi_complete_your_profile" />
        </h1>
        <div className="profile-form has-text-left">
          <Field
            name="photo"
            label="your_profile_photo"
            component={AvatarUploadField}
          />
          <div className="columns">
            <div className="column is-4 field">
              <div className="label">
                <Text iKey="first_name" />
              </div>
              <div className="control">
                <Field name="first_name" type="text" component={FormField} />
              </div>
            </div>
            <div className="column field">
              <div className="label">
                <Text iKey="last_name" />
              </div>
              <div className="control">
                <Field name="last_name" type="text" component={FormField} />
              </div>
            </div>
          </div>
          <div>
            <div className="label">
              <Text iKey="date_of_birth" />
            </div>
            <Field
              id="date_of_birth"
              name="date_of_birth"
              maxDate="2099-12-31"
              component={FormDate}
            />
          </div>

          {lodash.get(user, 'email') && (
            <div className="field">
              <div className="label">
                <Text iKey="email_address" />
              </div>
              <div className="control">
                <Field
                  name="email"
                  type="email"
                  placeholder="email_address"
                  component={FormField}
                  disabled
                />
              </div>
            </div>
          )}

          <div className="field">
            <div className="label">
              <Text iKey="password" />
              <span className="required">*</span>
            </div>
            <div className="control">
              <Field
                name="password"
                type="password"
                placeholder="password_must_be_letters"
                component={FormField}
              />
            </div>

            <PasswordStrength
              password={lodash.get(formData, 'values.password', '')}
            />
          </div>

          <div className="field">
            <div className="control">
              <Field
                name="confirm_password"
                type="password"
                placeholder="password_confirm"
                component={FormField}
              />
            </div>
          </div>

          <div className="field">
            <div className="label">
              <Text iKey="gender" />
              <span className="required">*</span>
            </div>
            <div className="control">
              <label className="custom radio">
                <Field type="radio" name="gender" value="1" component="input" />
                <span className="ui" />
                <Text iKey="male" />
              </label>
              <label className="custom radio">
                <Field type="radio" name="gender" value="2" component="input" />
                <span className="ui" />
                <Text iKey="female" />
              </label>
            </div>
          </div>

          <div className="field has-desc m-t-30">
            <div className="label">
              <Text iKey="uk_mobile_number" />
            </div>
            <div className="control">
              <Field
                name="uk_mobile_number"
                type="text"
                placeholder="e.g 07976 123 456"
                component={FormField}
              />
            </div>
            <p className="help">
              (We only use your number to send news and updates. You can control
              these messages from the settings menu.)
            </p>
          </div>

          <div className="field has-text-centered next-button-field">
            <button
              type="submit"
              className={nextClass}
              disabled={pristine || !valid || submitting}
            >
              <Text iKey="next" />
            </button>
          </div>
        </div>
      </form>
    );
  }
}

CreatePersonalProfile.propTypes = {
  onRegisterStep: PropTypes.func,
  sendingRequest: PropTypes.bool
};

CreatePersonalProfile.defaultProps = {
  onRegisterStep: noop,
  sendingRequest: false
};

const validate = values => {
  const errors = {};

  // Check fields
  FormUtil.validate(values, errors, 'uk_mobile_number').numbersOnly();
  FormUtil.validate(values, errors, 'first_name')
    .lettersOnly()
    .required();
  FormUtil.validate(values, errors, 'last_name')
    .lettersOnly()
    .required();
  // FormUtil.validate(values, errors, 'email').email().required();
  FormUtil.validate(values, errors, 'gender').required();
  FormUtil.validate(values, errors, 'password')
    .passwordLength()
    .required();
  FormUtil.validate(values, errors, 'confirm_password')
    .passwordLength()
    .required();

  if (values.password !== values.confirm_password) {
    errors.confirm_password = 'Passwords must match';
  }

  return errors;
};

const CreatePersonalProfileForm = reduxForm({
  form: FORM_NAME,
  validate
})(CreatePersonalProfile);

const mapStateToProps = ({ form }) => ({
  formData: lodash.get(form, FORM_NAME)
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePersonalProfileForm);
