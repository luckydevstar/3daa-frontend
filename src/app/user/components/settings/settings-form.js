// CORE
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as lodash from 'lodash';

// ADDONS
import { Field, reduxForm, initialize } from 'redux-form';
import classNames from 'classnames';
import { Label } from 'app/intl';

// COMPONENTS
import common from 'app/common';
import FormUtil from '../../util/form-util';

const {
  components: { MediaCrop }
} = common;

// CONSTS
const {
  components: {
    ProfileAvatar,
    Form: { field, select, file }
  }
} = common;
const FormField = field;
const FormSelect = select;
const FormFile = file;

const FORM_NAME = 'settingsForm';

// Gender radio error message
let gender_radio_error = '';

class SettingsForm extends Component {
  constructor(props) {
    super(props);
    this.initialized = null;
    this.handlePhoto = this.handlePhoto.bind(this);
    this.state = {
      profilePhoto: '',
      imageToCrop: null
    };
  }

  componentDidMount() {
    const { setInitialValues, user } = this.props;

    const data = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      gender: user.gender && user.gender.toString(),
      birth_day: null,
      birth_month: null,
      birth_year: null,
      uk_mobile_number:
        user.uk_mobile_number && user.uk_mobile_number.toString(),
      facebook: user.facebook || '',
      twitter: user.twitter || '',
      pinterest: user.pinterest || '',
      linkedin: user.linkedin || '',
      photo: user.photo,
      uln: user.uln || ''
    };

    if (user.date_of_birth) {
      const birthArray = user.date_of_birth.split('-');

      Object.assign(data, {
        birth_year: birthArray[0],
        birth_month: birthArray[1],
        birth_day: birthArray[2]
      });
    }

    setInitialValues(data);

    this.setState({
      profilePhoto: user.photo,
      localProfilePhoto: null
    });
  }

  handlePhoto(files) {
    const file = lodash.get(files, ['0']);
    const fileType = lodash.get(file, 'type');

    if (!fileType || !fileType.match('image.*')) {
      alert('You did not upload an image.');
      return;
    }

    this.setState({
      profilePhoto: null,
      imageToCrop: URL.createObjectURL(file),
      localProfilePhoto: `${window.URL.createObjectURL(file)}`
    });

    // File reader solution
    // - uncessary but just in case:
    // let reader = new FileReader();
    // reader.onload = (img => e => this.setState)(file);
    // reader.readAsDataURL(file);
  }

  acceptCrop = file => {
    this.setState({
      profilePhoto: null,
      imageToCrop: null,
      localProfilePhoto: `${URL.createObjectURL(file)}`
    });
  };

  closeCrop = () => {
    this.setState({
      imageToCrop: null
    });
  };

  render() {
    const {
      onSubmitAttempt,
      updatePassword,
      attempting,
      success,
      failure,
      user,
      passwordResetAttempt
    } = this.props;
    const { gender, screen_name } = user;
    const { handleSubmit } = this.props;
    const { profilePhoto, localProfilePhoto, imageToCrop } = this.state;

    const btnCls = classNames('button is-success', {
      'is-loading': attempting
    });

    return (
      <div className="form">
        <form
          method="post"
          className="settings-form"
          onSubmit={handleSubmit(onSubmitAttempt)}
        >
          <h1 className="m-b-40">Lets complete your profile</h1>
          <div className="shrink">
            <div className="m-b-40">
              <h2 className="label align-left">Your profile photo</h2>
              <div className="photo m-b-40">
                {localProfilePhoto ? (
                  <div className="media-left">
                    <figure>
                      <div
                        className="image is-round"
                        style={{
                          backgroundImage: `url(${localProfilePhoto})`
                        }}
                      />
                    </figure>
                  </div>
                ) : (
                  <ProfileAvatar
                    avatarSize={90}
                    title={screen_name}
                    fileId={profilePhoto}
                    gender={gender}
                    transformations={{
                      width: 90,
                      height: 90,
                      crop: 'thumb',
                      gravity: 'face',
                      radius: 'max'
                    }}
                  />
                )}
                <div className="fileUploader">
                  <label
                    className="fileUploader__body fileUploader--labelOnly button is-primary is-outlined"
                    htmlFor="profile_photo"
                  >
                    Change <span className="is-hidden">your profile photo</span>
                    <Field
                      type="file"
                      name="profile_photo"
                      accept="image.*"
                      component={FormFile}
                      onChange={({ target: { files } }) =>
                        this.handlePhoto(files)
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="control is-horizontal">
                <div className="field m-r-10">
                  <label
                    htmlFor="first_name"
                    className="label m-b-10 align-left"
                  >
                    First name
                  </label>
                  <Field
                    name="first_name"
                    type="text"
                    placeholder="First name"
                    component={FormField}
                    label={'First name'}
                  />
                </div>

                <div className="field is-expanded">
                  <label
                    htmlFor="last_name"
                    className="label m-b-10 align-left"
                  >
                    Last name
                  </label>
                  <Field
                    name="last_name"
                    type="text"
                    placeholder="Last name"
                    component={FormField}
                    label={'Last name'}
                  />
                </div>
                <div className="field is-expanded">
                  <label htmlFor="uln" className="label m-b-10 align-left">
                    ULN
                  </label>
                  <Field
                    name="uln"
                    type="text"
                    placeholder="ULN"
                    component={FormField}
                    label={'ULN'}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <Label
                iKey="date_of_birth"
                htmlFor="date-of-birth"
                className="label align-left"
              />
              <div className="control is-horizontal">
                <div id="date-of-birth" className="field is-grouped">
                  <Field
                    name="birth_day"
                    type="number"
                    placeholder="DD"
                    component={FormField}
                    className="control"
                    disabled={this.initialized && this.initialized.birth_day}
                  />
                  <Field
                    className="control grow"
                    component={FormSelect}
                    name="birth_month"
                    disabled={this.initialized && this.initialized.birth_month}
                  >
                    <option value="" disabled hidden>
                      Please Choose...
                    </option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Field>
                  <Field
                    name="birth_year"
                    type="number"
                    maxlength="10"
                    placeholder="YYYY"
                    component={FormField}
                    className="control"
                    disabled={this.initialized && this.initialized.birth_year}
                  />
                </div>
              </div>

              <label htmlFor="email" className="label m-b-10 align-left">
                Email
              </label>
              <Field
                name="email"
                type="email"
                placeholder="Email address"
                component={FormField}
                label={'Email'}
              />

              {/* Gender */}
              <label htmlFor="gender" className="label m-b-15 align-left">
                Gender <span className="required">*</span>
              </label>
              <div className="control m-b-35">
                <label className="custom radio">
                  <Field
                    type="radio"
                    name="gender"
                    value="1"
                    component="input"
                  />
                  <span className="ui" />
                  Male
                </label>
                <label className="custom radio">
                  <Field
                    type="radio"
                    name="gender"
                    value="2"
                    component="input"
                  />
                  <span className="ui" />
                  Female
                </label>
                <span>{gender_radio_error}</span>
              </div>

              <label
                htmlFor="uk_mobile_number"
                className="label m-b-10 align-left"
              >
                UK mobile number
              </label>
              <Field
                name="uk_mobile_number"
                type="text"
                placeholder="UK mobile number"
                component={FormField}
                label={'UK mobile number'}
              />
              <p className="has-text-left m-b-20">
                (We only use your number to send news and updates. You can
                control these messages from the settings menu).
              </p>

              <label htmlFor="facebook" className="label m-b-10 align-left">
                Facebook link
              </label>
              <Field
                name="facebook"
                type="text"
                placeholder="Facebook link"
                component={FormField}
                label={'Facebook link'}
              />

              <label htmlFor="twitter" className="label m-b-10 align-left">
                Twitter link
              </label>
              <Field
                name="twitter"
                type="text"
                placeholder="Twitter link"
                component={FormField}
                label={'Twitter link'}
              />

              <label htmlFor="pinterest" className="label m-b-10 align-left">
                Pinterest link
              </label>
              <Field
                name="pinterest"
                type="text"
                placeholder="Pinterest link"
                component={FormField}
                label={'Pinterest link'}
              />

              <label htmlFor="linkedin" className="label m-b-10 align-left">
                LinkedIn link
              </label>
              <Field
                name="linkedin"
                type="text"
                placeholder="LinkedIn link"
                component={FormField}
                label={'LinkedIn link'}
              />
            </div>
            {failure ? (
              <p className="m-b-40">There was a problem - please try again</p>
            ) : null}
            {success ? <p className="m-b-40">Settings saved</p> : null}
            <div className="has-text-centered m-b-40">
              <button
                className={btnCls}
                type="submit"
                disabled={attempting && !failure}
              >
                Save settings
              </button>
            </div>
            <label htmlFor="linkedin" className="label m-b-10 align-left">
              Current password
            </label>
            <Field
              name="current_password"
              type="password"
              placeholder="Current password"
              component={FormField}
              label={'Current password'}
            />
            <label htmlFor="linkedin" className="label m-b-10 align-left">
              New password
            </label>
            <Field
              name="new_password"
              type="password"
              placeholder="New password"
              component={FormField}
              label={'New password'}
            />
            <label htmlFor="linkedin" className="label m-b-10 align-left">
              Confirm password
            </label>
            <Field
              name="confirm_password"
              type="password"
              placeholder="Confirm password"
              component={FormField}
              label={'Confirm password'}
            />
            <div className="has-text-centered m-t-40 m-b-40">
              <button
                className={classNames('button is-success', {
                  'is-loading': passwordResetAttempt
                })}
                type="button"
                onClick={updatePassword}
                disabled={passwordResetAttempt}
              >
                Reset Password
              </button>
            </div>
          </div>
        </form>
        {imageToCrop && (
          <MediaCrop
            acceptCrop={this.acceptCrop}
            mediaSrc={imageToCrop}
            onClose={this.closeCrop}
          />
        )}
      </div>
    );
  }
}

const validate = values => {
  const errors = {};

  // date validation
  if (values.birth_month && values.birth_day && values.birth_year) {
    if (
      !FormUtil.computeDate(
        values.birth_day,
        values.birth_month,
        values.birth_year
      )
    ) {
      errors.birth_day = ' ';
      errors.birth_month = 'Please provide valid date';
      errors.birth_year = ' ';
    }
  }

  // Check fields
  FormUtil.validate(values, errors, 'uk_mobile_number')
    .numbersOnly()
    .required();
  FormUtil.validate(values, errors, 'first_name').required();
  FormUtil.validate(values, errors, 'last_name').required();
  FormUtil.validate(values, errors, 'email')
    .email()
    .required();
  FormUtil.validate(values, errors, 'registration_number')
    .numbersOnly()
    .required();
  FormUtil.validate(values, errors, 'birth_day')
    .dayNumber()
    .required();
  FormUtil.validate(values, errors, 'birth_month').required();
  FormUtil.validate(values, errors, 'birth_year')
    .fourDigit()
    .required();
  FormUtil.validate(values, errors, 'gender').required();

  if (values.new_password !== values.confirm_password) {
    errors.confirm_password = 'Passwords must match';
  }

  if (errors.gender) {
    gender_radio_error = 'Please select one';
  } else {
    gender_radio_error = '';
  }

  return errors;
};

SettingsForm.propTypes = {
  onSubmitAttempt: PropTypes.func.isRequired,
  attempting: PropTypes.bool,
  success: PropTypes.bool,
  failure: PropTypes.bool
};

SettingsForm.defaultProps = {
  attempting: false,
  success: false,
  failure: false
};

const mapDispatchToProps = dispatch => ({
  // Action to inject data into the form
  setInitialValues: data => {
    // initialize must be called in a dispatch
    dispatch(initialize(FORM_NAME, data));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(
  reduxForm({
    form: FORM_NAME,
    validate
  })(SettingsForm)
);
