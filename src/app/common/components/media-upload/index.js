import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { isEmpty, pipe, head, prop } from 'ramda';
import classNames from 'classnames';
import Form from '../form';
import util from 'app/user/util/';
import FormStep from './form-step';
import FormPagination from './form-pagination';
import { FileUploadSizes } from 'app/core/config/constants';

const { FormUtil } = util;
const { dropzone: FormDropzone } = Form;

const REDUX_FORM_NAME = 'mediaUploadForm';
const uploadButtonClasses = ['button', 'is-success', 'animate', 'fade-in'];

const validateMedia = (mediaType, values, errors = {}) => {
  if (mediaType === 'image') {
    FormUtil.validate(values, errors, 'file')
      .required()
      .maxSize(FileUploadSizes.MAX_IMAGE_SIZE)
      .image();
  } else {
    FormUtil.validate(values, errors, 'file')
      .required()
      .maxSize(FileUploadSizes.MAX_VIDEO_SIZE)
      .video();
  }

  return errors;
};

class MediaUpload extends Component {
  constructor(props) {
    super(props);
    this.state = { step: 1 };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.hasUploadedSuccessfully(nextProps)) {
      this.props.onModalClose();
    }
  }

  hasUploadedSuccessfully(nextProps) {
    const { submitSucceeded, recentlyUploaded, errorCode } = nextProps;
    return (
      submitSucceeded &&
      !errorCode &&
      recentlyUploaded !== this.props.recentlyUploaded
    );
  }

  goPreviousStep() {
    this.setState({ step: this.state.step - 1 });
  }

  goNextStep() {
    this.setState({ step: this.state.step + 1 });
  }

  isFirstStep() {
    return this.state.step === 1;
  }

  isLastStep() {
    return this.state.step === this.props.maxFormSteps;
  }

  render() {
    const { step } = this.state;

    const {
      mediaType,
      mediaFile,
      isUploading,
      handleSubmit,
      describeMediaStep,
      onUploadAttempt,
      change
    } = this.props;

    // Errors for the media object (to prevent going next)
    const errors = validateMedia(mediaType, { file: mediaFile }, {});

    return (
      <form
        method="post"
        className="upload-form"
        onSubmit={handleSubmit(onUploadAttempt)}
      >
        <FormStep title={`Add ${mediaType}`} isCurrentStep={this.isFirstStep()}>
          <Field
            {...{
              name: 'file',
              className: 'media-upload__dropzone',
              mediaType,
              cloudinaryMediaType: mediaType,
              component: FormDropzone,
              multiple: false,
              handleDrop: e => {
                if (!isEmpty(e)) {
                  change(
                    'title',
                    pipe(
                      head,
                      prop('name')
                    )(e)
                  );
                  change('file', e);
                }
              }
            }}
          />
        </FormStep>

        <FormStep title={`Describe ${mediaType}`} isCurrentStep={step === 2}>
          {describeMediaStep}
        </FormStep>

        <div className="media-upload__modal-footer m-t-30 is-flex space-between">
          <FormPagination
            isUploading={isUploading}
            hideNextButton={this.isFirstStep() && !isEmpty(errors)}
            currentStep={step}
            onPreviousStep={() => this.goPreviousStep()}
            onNextStep={() => this.goNextStep()}
          />
          {this.isLastStep() && (
            <button
              disabled={!this.isLastStep()}
              className={classNames(...uploadButtonClasses, {
                'is-loading': isUploading,
                init: this.isLastStep()
              })}
              type="submit"
            >
              Upload
            </button>
          )}
        </div>
      </form>
    );
  }
}

const validate = (values, props) => {
  const { mediaType, describeMediaValidation } = props;

  return {
    ...validateMedia(mediaType, values),
    ...describeMediaValidation(values, props)
  };
};

MediaUpload.defaultProps = {
  maxFormSteps: 2,
  initialValues: {}
};

MediaUpload.propTypes = {
  maxFormSteps: PropTypes.number,
  isUploading: PropTypes.bool.isRequired,
  mediaType: PropTypes.string.isRequired,
  describeMediaStep: PropTypes.element.isRequired,
  describeMediaValidation: PropTypes.func.isRequired,
  onUploadAttempt: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired,
  initialValues: PropTypes.object
};

const selector = formValueSelector(REDUX_FORM_NAME);

const MediaUploadConnected = reduxForm({
  form: REDUX_FORM_NAME,
  validate
})(MediaUpload);

const SelectingMediaUploadConnected = connect((state, { initialValues }) => ({
  mediaFile: selector(state, 'file'),
  ...(initialValues && { initialValues })
}))(MediaUploadConnected);

export default SelectingMediaUploadConnected;
