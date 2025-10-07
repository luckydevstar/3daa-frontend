import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, initialize, change } from 'redux-form';
import cx from 'classnames';

import common from 'app/common';
import { Text, Field } from 'app/intl';
import FormUtil from '../../util/form-util';
import AvatarUploadField from '../avatar-upload-field';

const {
  components: {
    Form: { field, country, dropzone }
  },
  util: {
    helpers: { noop }
  }
} = common;
const FormField = field;
const FormCountry = country;
const FormDropzone = dropzone;

const FORM_NAME = 'register-business-profile';

class CreateBusinessProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centre: null
    };
    this.initForm = this.initForm.bind(this);
    this.onSetBanner = this.onSetBanner.bind(this);
  }

  componentDidMount() {
    const { centre } = this.props;

    this.initForm(centre);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { centre } = nextProps;
    if (this.state.centre != centre) {
      this.initForm(centre);
    }
  }

  initForm(centre) {
    const { setInitialValues } = this.props;

    const {
      centre_name,
      centre_contact_first_name,
      centre_contact_last_name,
      cloudinary_file_id,
      contact_number,
      website,
      organisation_type,
      address_line_1,
      address_line_2,
      postcode,
      city,
      country
    } = centre;

    const data = {
      centre_name,
      centre_contact_first_name,
      centre_contact_last_name,
      cloudinary_file_id,
      contact_number,
      website,
      organisation_type,
      address_line_1,
      address_line_2,
      postcode,
      city,
      country
    };

    this.setState({ centre: centre });
    setInitialValues(data);
  }

  onSetBanner(file) {
    const { changeFieldValue } = this.props;
    this.setState({ file: file });

    if (file.type.includes('image')) {
      changeFieldValue('cloudinary_file_id', file);
    }
  }

  render() {
    const {
      loading,
      handleSubmit,
      onSubmit,
      valid,
      pristine,
      submitting
    } = this.props;

    return (
      <form className="profile" onSubmit={handleSubmit(onSubmit)}>
        <h1>
          <Text iKey="msg_tell_us_little_more_your_business" />
        </h1>
        <div className="profile-form has-text-left m-t-30">
          <Field
            name="cloudinary_file_id"
            mediaType="image"
            component={FormDropzone}
            // uploadedMedia={media}
            buttonText="Banner Image"
            existingButtonText="Change Banner Image"
            // placeholder="Banner Image"
            // mediaIcon={mediaIcon}
            // handleDrop={file => this.onDrop(file)}
            multiple={false}
            // editable="{editable}"
            onOpenFileRef={ref => (this.fileOpen = ref)}
            onChange={({ target: { files } }) => {
              this.onSetBanner(files[0]);
            }}
          />

          <div className="field m-t-15">
            <div className="label">
              <Text iKey="business_details" />
            </div>
            <div className="control">
              <Field
                name="centre_name"
                type="text"
                placeholder="company_name"
                component={FormField}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <Field
                name="website"
                type="text"
                placeholder="website"
                component={FormField}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <Field
                name="contact_number"
                type="text"
                placeholder="contact_number"
                component={FormField}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <Field
                name="centre_contact_first_name"
                type="text"
                placeholder="contact_first_name"
                component={FormField}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <Field
                name="centre_contact_last_name"
                type="text"
                placeholder="contact_last_name"
                component={FormField}
              />
            </div>
          </div>

          <div className="field">
            <div className="label">
              <Text iKey="business_address" />
            </div>
            <div className="control">
              <Field
                name="address_line_1"
                type="text"
                placeholder="address_line_1"
                component={FormField}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <Field
                name="address_line_2"
                type="text"
                placeholder="address_line_2"
                component={FormField}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <Field
                name="city"
                type="text"
                placeholder="town_and_city"
                component={FormField}
              />
            </div>
          </div>

          <div className="field postcode">
            <div className="control">
              <Field
                name="postcode"
                type="text"
                placeholder="Postcode"
                component={FormField}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <Field name="country" type="text" component={FormCountry} />
            </div>
          </div>

          <div className="field has-text-centered next-button-field">
            <button
              className={cx('button is-primary', {
                'is-loading': loading
              })}
              disabled={!valid || pristine || submitting}
            >
              <Text iKey="proceed_to_payment" />
            </button>
          </div>
        </div>
      </form>
    );
  }
}

CreateBusinessProfile.propTypes = {
  centre: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool
};

CreateBusinessProfile.defaultProps = {
  centre: null,
  onSubmit: noop,
  loading: false
};

const validate = values => {
  const errors = {};

  // Check fields
  // FormUtil.validate(values, errors, 'owner_details').lettersOnly().required();
  FormUtil.validate(values, errors, 'centre_name')
    .lettersOnly()
    .required();
  FormUtil.validate(values, errors, 'contact_number').required();
  FormUtil.validate(values, errors, 'centre_contact_first_name').required();
  FormUtil.validate(values, errors, 'centre_contact_last_name').required();
  FormUtil.validate(values, errors, 'address_line_1').required();
  FormUtil.validate(values, errors, 'city').required();
  FormUtil.validate(values, errors, 'postcode')
    .postCode()
    .required();
  FormUtil.validate(values, errors, 'country').required();

  return errors;
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setInitialValues: data => {
    dispatch(initialize(FORM_NAME, data));
  },
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(
  reduxForm({
    form: FORM_NAME,
    validate
  })(CreateBusinessProfile)
);

// <Field
//         name="cloudinary_file_id"
//         label="organisation_profile_photo"
//         component={AvatarUploadField}
//       />

// <div className="field has-desc m-t-30 m-b-30">
//   <div className="label">
//     <Text iKey="owner_details" />
//   </div>
//   <div className="control">
//     <Field
//       name="owner_details"
//       type="text"
//       placeholder="owner_details"
//       component={FormField}
//     />
//     <p className="help">
//       You can pass ownership to any other active user from your profile.
//     </p>
//   </div>
// </div>
