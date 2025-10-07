import React from 'react';
import { connect } from 'react-redux';
import common from 'app/common';
import centreDefaultImage from 'images/icon_centre_default.svg';
import { Field, reduxForm, initialize, change } from 'redux-form';
import classNames from 'classnames';
import * as lodash from 'lodash';
import FormUtil from '../../util/form-util';

const {
  components: {
    CloudinaryMedia,
    Form: { field, select, file, dropzone }
  }
} = common;
const FormField = field;
const FormDropzone = dropzone;
const FormFile = file;

const FORM_NAME = 'SettingsOrgProfile';
// Radio error message variable
let register_radio_error = '';

class OrgProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVideoBanner: false
    };
    this.onSetBanner = this.onSetBanner.bind(this);
    this.onSetLogo = this.onSetLogo.bind(this);
  }

  componentDidMount() {
    const { setInitialValues, centre } = this.props;

    const {
      centre_name,
      centre_contact_first_name,
      centre_contact_last_name,
      cloudinary_file_id,
      logo,
      mobile_banner,
      mobile_logo,
      contact_number,
      centre_number,
      website,
      organisation_type,
      address_line_1,
      address_line_2,
      postcode,
      city,
      country,
      opening_hours,
      facebook_url,
      twitter_url,
      linkedin_url
    } = centre;

    const data = {
      centre_name,
      centre_contact_name: `${centre_contact_first_name} ${centre_contact_last_name}`,
      centre_contact_first_name,
      centre_contact_last_name,
      cloudinary_file_id,
      logo,
      mobile_banner,
      mobile_logo,
      contact_number,
      centre_number,
      website,
      organisation_type,
      address_line_1,
      address_line_2,
      postcode,
      city,
      country,
      opening_hours: opening_hours || '',
      facebook_url: facebook_url || '',
      twitter_url: twitter_url || '',
      linkedin_url: linkedin_url || ''
    };

    setInitialValues(data);

    this.setState(
      Object.assign({}, this.state, {
        orgPhoto: cloudinary_file_id,
        orgLogo: logo,
        isVideoBanner:
          cloudinary_file_id &&
          !(
            cloudinary_file_id.includes('jpeg') ||
            cloudinary_file_id.includes('png') ||
            cloudinary_file_id.includes('jpg')
          )
      })
    );
  }

  onSetBanner(file) {
    const { changeFieldValue } = this.props;
    if (!file) return;
    this.setState({ file: file });
    if (file.type.includes('image')) {
      changeFieldValue('cloudinary_file_id', file);
    }

    // const file = lodash.get(files, ['0']);
    // const fileType = lodash.get(file, 'type');

    // if (!fileType || !fileType.match('image.*')) {
    //   alert('You did not upload an image.');
    //   return;
    // }

    // this.setState({
    //   profilePhoto: null,
    //   localProfilePhoto: `${window.URL.createObjectURL(file)}`
    // });

    // File reader solution
    // - uncessary but just in case:
    // let reader = new FileReader();
    // reader.onload = (img => e => this.setState)(file);
    // reader.readAsDataURL(file);
  }

  onSetMobileBanner = file => {
    const { changeFieldValue } = this.props;
    if (!file) return;
    this.setState({ file: file });
    if (file.type.includes('image')) {
      changeFieldValue('mobile_banner', file);
    }
  };

  onSetLogo(files) {
    const { changeFieldValue } = this.props;
    const file = files[0];
    if (!file) return;
    this.setState({ file: file });

    if (file.type.includes('image')) {
      changeFieldValue('logo', file);
    }
  }

  onSetMobileLogo = files => {
    const { changeFieldValue } = this.props;
    const file = files[0];
    if (!file) return;
    this.setState({ file: file });

    if (file.type.includes('image')) {
      changeFieldValue('mobile_logo', file);
    }
  };

  renderVideoBanner = files => {
    const { changeFieldValue } = this.props;
    const file = files[0];
    if (!file) return null;
    if (file.type.includes('video')) {
      changeFieldValue('cloudinary_file_id', file);
      this.setState({ isVideoBanner: true });
    }
  };

  renderImageBanner = files => {
    const { changeFieldValue } = this.props;
    const file = files[0];
    if (!file) return;
    if (file.type.includes('image')) {
      changeFieldValue('cloudinary_file_id', file);
      this.setState({ isVideoBanner: false });
    }
  };

  render() {
    const {
      handleSubmit,
      attempting,
      success,
      failure,
      onSubmitAttempt
    } = this.props;
    const { isVideoBanner } = this.state;
    return (
      <div className="container">
        <h1 className="m-b-40">Your Organisations Profile</h1>
        <form
          className="organization-profile"
          onSubmit={handleSubmit(onSubmitAttempt)}
        >
          <div className="shrink">
            <div className="labelWrapper">
              {/* PROFILE PHOTO */}

              <h2 className="label">Organisation Profile banner</h2>
              {isVideoBanner && (
                <Field
                  name="cloudinary_file_id"
                  mediaType="video"
                  component={FormDropzone}
                  // uploadedMedia={media}
                  buttonText="Banner Video"
                  existingButtonText="Change Banner Video"
                  // placeholder="Banner Image"
                  // mediaIcon={mediaIcon}
                  multiple={false}
                  // editable="{editable}"
                  handleDrop={this.renderImageBanner}
                  changeImage={this.onSetBanner}
                  onChange={({ target: { files } }) => {
                    this.onSetBanner(files[0]);
                  }}
                />
              )}
              {!isVideoBanner && (
                <Field
                  name="cloudinary_file_id"
                  mediaType="image"
                  component={FormDropzone}
                  // uploadedMedia={media}
                  buttonText="Banner Image"
                  existingButtonText="Change Banner Image"
                  // placeholder="Banner Image"
                  // mediaIcon={mediaIcon}
                  handleDrop={this.renderVideoBanner}
                  multiple={false}
                  allowCrop={true}
                  // editable="{editable}"
                  onOpenFileRef={ref => (this.fileOpen = ref)}
                  changeImage={this.onSetBanner}
                  onChange={({ target: { files } }) => {
                    this.onSetBanner(files[0]);
                  }}
                />
              )}
              <h2 className="label m-t-20">
                Organisation Profile mobile banner
              </h2>
              <Field
                name="mobile_banner"
                mediaType="image"
                component={FormDropzone}
                // uploadedMedia={media}
                buttonText="Mobile Banner Image"
                existingButtonText="Change Mobile Banner Image"
                // placeholder="Banner Image"
                // mediaIcon={mediaIcon}
                handleDrop={this.renderVideoBanner}
                multiple={false}
                allowCrop={true}
                // editable="{editable}"
                onOpenFileRef={ref => (this.fileOpen = ref)}
                changeImage={this.onSetMobileBanner}
                onChange={({ target: { files } }) => {
                  this.onSetMobileBanner(files[0]);
                }}
              />
              <h2 className="label m-t-20">Organisation Logo</h2>
              <Field
                name="logo"
                mediaType="image"
                component={FormDropzone}
                // uploadedMedia={media}
                buttonText="Logo Image"
                existingButtonText="Change Logo Image"
                // placeholder="Banner Image"
                // mediaIcon={mediaIcon}
                // handleDrop={file => this.onDrop(file)}
                multiple={false}
                allowCrop={true}
                // editable="{editable}"
                onOpenFileRef={ref => (this.fileOpen = ref)}
                changeImage={file => {
                  this.onSetLogo([file]);
                }}
                onChange={e => {
                  this.onSetLogo(e.target.files);
                }}
              />
              <h2 className="label m-t-20">Organisation Mobile Logo</h2>
              <Field
                name="mobile_logo"
                mediaType="image"
                component={FormDropzone}
                // uploadedMedia={media}
                buttonText="Mobile Logo Image"
                existingButtonText="Change Mobile Logo Image"
                // placeholder="Banner Image"
                // mediaIcon={mediaIcon}
                // handleDrop={file => this.onDrop(file)}
                multiple={false}
                allowCrop={true}
                // editable="{editable}"
                onOpenFileRef={ref => (this.fileOpen = ref)}
                changeImage={file => {
                  this.onSetMobileLogo([file]);
                }}
                onChange={e => {
                  this.onSetMobileLogo(e.target.files);
                }}
              />

              {/* ORGANISATION TYPE */}

              <label className="label star m-b-20 m-t-20">Organisation</label>
              <div className="control align-left m-b-40">
                <label className="custom radio">
                  <Field
                    type="radio"
                    name="organisation_type"
                    value="employer"
                    component="input"
                  />
                  <span className="ui" />
                  Employer
                  <sup className="tooltip">
                    <i className="fa fa-info-circle" aria-hidden="true" />
                    <a className="tooltiptext">info about employer</a>
                  </sup>
                </label>
                <label className="custom radio">
                  <Field
                    type="radio"
                    name="organisation_type"
                    value="training_provider"
                    component="input"
                  />
                  <span className="ui" />
                  Training Provider
                  <sup className="tooltip">
                    <i className="fa fa-info-circle" aria-hidden="true" />
                    <a className="tooltiptext">info about treining provider</a>
                  </sup>
                </label>
                <br />
                <span className="radio-error">{register_radio_error}</span>
              </div>

              {/* ORGANISATION DETAILS */}

              <label className="label">Organisation Details</label>
              <Field
                name="centre_name"
                type="text"
                placeholder="Company Name"
                component={FormField}
                className="p-0 control"
              />
              <Field
                name="website"
                type="text"
                placeholder="Website"
                component={FormField}
                className="p-0 control"
              />
              <Field
                name="contact_number"
                type="text"
                placeholder="Contact Number"
                component={FormField}
                className="p-0 control"
              />
              <Field
                name="centre_number"
                type="text"
                placeholder="Centre Number"
                readOnly={true}
                component={FormField}
                className="p-0 control"
              />
              <Field
                name="centre_contact_first_name"
                type="text"
                placeholder="contact_first_name"
                component={FormField}
              />

              <Field
                name="centre_contact_last_name"
                type="text"
                placeholder="contact_last_name"
                component={FormField}
              />
              <Field
                name="opening_hours"
                type="text"
                placeholder="opening_hours"
                component={FormField}
              />

              {/* ORGANISATION ADDRESS */}

              <label className="label">Organisation Address</label>
              <Field
                name="address_line_1"
                type="text"
                placeholder="Address Line 1"
                component={FormField}
                className="p-0 m-0 control"
              />
              <Field
                name="address_line_2"
                type="text"
                placeholder="Address Line 2"
                component={FormField}
                className="p-0 m-0  control"
              />
              <Field
                name="city"
                type="text"
                placeholder="Town / City"
                component={FormField}
                className="p-0 m-0 control"
              />
              <Field
                name="postcode"
                type="text"
                placeholder="Post Code"
                component={FormField}
                className="p-0 m-0 control"
              />
              <Field
                name="country"
                type="text"
                placeholder="Country"
                component={FormField}
                className="p-0 m-0 control"
              />
              <div className="p-t-30" />
              <label htmlFor="facebook" className="label m-b-10 align-left">
                Facebook link
              </label>
              <Field
                name="facebook_url"
                type="text"
                placeholder="Facebook link"
                component={FormField}
                label={'Facebook link'}
              />

              <label htmlFor="twitter" className="label m-b-10 align-left">
                Twitter link
              </label>
              <Field
                name="twitter_url"
                type="text"
                placeholder="Twitter link"
                component={FormField}
                label={'Twitter link'}
              />

              <label htmlFor="linkedin" className="label m-b-10 align-left">
                LinkedIn link
              </label>
              <Field
                name="linkedin_url"
                type="text"
                placeholder="LinkedIn link"
                component={FormField}
                label={'LinkedIn link'}
              />
            </div>

            {/* SUBMIT */}
            {failure ? (
              <p className="m-b-40">There was a problem - please try again</p>
            ) : null}
            {success ? <p className="m-b-40">Settings saved</p> : null}

            <button
              type="submit"
              className={classNames('button', 'is-success', 'm-t-20', {
                'is-loading': attempting
              })}
              disabled={attempting && !failure}
            >
              Update Organisation Profile
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};

  FormUtil.validate(values, errors, 'centre_name').required();
  FormUtil.validate(values, errors, 'contact_number').required();
  FormUtil.validate(values, errors, 'centre_number').required();
  FormUtil.validate(values, errors, 'centre_contact_first_name').required();
  FormUtil.validate(values, errors, 'centre_contact_last_name').required();
  FormUtil.validate(values, errors, 'address_line_1 ').required();
  FormUtil.validate(values, errors, 'city').required();
  FormUtil.validate(values, errors, 'postcode')
    .postCode()
    .required();
  FormUtil.validate(values, errors, 'country').required();
  FormUtil.validate(values, errors, 'organisation_type').required();

  if (errors.organisation_type != null) {
    register_radio_error = 'Please select one';
  } else {
    register_radio_error = '';
  }

  if (
    values.learner_birth_month &&
    values.learner_birth_day &&
    values.learner_birth_year
  ) {
    if (
      !FormUtil.checkDate(
        values.learner_birth_day,
        values.learner_birth_month,
        values.learner_birth_year
      )
    ) {
      errors.learner_birth_day = ' ';
      errors.learner_birth_month = 'Please provide a valid date.';
      errors.learner_birth_year = ' ';
    }
  }

  return errors;
};

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
  })(OrgProfileForm)
);

// <div className="photo m-b-20">
//                 {orgPhoto
//                   ? <CloudinaryMedia
//                       mediaType="image"
//                       className="media-left"
//                       fileId={orgPhoto}
//                       transformations={{
//                         width: 90,
//                         height: 90,
//                         crop: 'fill',
//                         gravity: 'center'
//                       }}
//                     />
//                   : <img alt="" src={localPhoto || centreDefaultImage} />}

//                 <div className="fileUploader">
//                   <label
//                     className="fileUploader__body fileUploader--labelOnly button is-primary is-outlined"
//                     htmlFor="cloudinary_file_id"
//                   >
//                     Change <span className="is-hidden">your profile photo</span>
//                     <Field
//                       className="fileUploader__file"
//                       name="cloudinary_file_id"
//                       type="file"
//                       onChange={({ target: { files } }) =>
//                         this.handlePhoto(files)}
//                       component={FormFile}
//                     />
//                   </label>
//                 </div>
//               </div>

// {/* OWNER DETAILS */}

// <label htmlFor="centre_contact_name" className="label m-t-15">
// Owner Details
// </label>
// <Field
// name="centre_contact_name"
// type="text"
// placeholder="[Head of centre name]"
// component={FormField}
// disabled
// />
// <p className="control-describe m-b-20">
// You can pass ownership to any other active user from your
// profile.
// </p>
