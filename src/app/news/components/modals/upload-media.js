import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, change, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import classNames from 'classnames';

import user from 'app/user';
import common from 'app/common';

const FormField = common.components.Form.field;
const FormDropzone = common.components.Form.dropzone;
const FormUtil = user.util.FormUtil;

class UploadMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      error: null
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.recentlyUploaded && !this.props.recentlyUploaded) {
      this.props.setCurrentMedia(nextProps.recentlyUploaded);
    }

    if (nextProps.recentlyUploaded && this.props.recentlyUploaded) {
      if (nextProps.recentlyUploaded !== this.props.recentlyUploaded) {
        this.props.setCurrentMedia(nextProps.recentlyUploaded);
      }
    }
  }

  onSubmitAttempt(formData) {
    // this is part of dirty validation
    console.log(formData);
    this.validateImageResolution((result, error) => {
      if (result) {
        formData.file = this.shellSingleItemFromAnArray(formData.file);
        this.props.uploadMedia(formData);
      }
      if (error) {
        this.setState({ error });
      }
    });
  }

  onDrop(file) {
    this.checkImageResolution(file[0], result => {
      if (result) {
        file[0].width = result.width;
        file[0].height = result.height;
      }
      this.setState({ file: file[0], error: null });
    });
  }

  changeImage = file => {
    const { changeFieldValue } = this.props;
    changeFieldValue('uploadMedia', 'file', [file]);
    this.onDrop([file]);
  };

  shellSingleItemFromAnArray(array) {
    return array.length === 1 ? array[0] : false;
  }

  // This is very dirty validation.
  // Couldn't find solution to test it in the Form Utilities.
  // To check image resolution we need to load it inside Image() and wait for it to be loaded
  // it causes problems with callbacks...
  // TODO find better solution.
  validateImageResolution(callback) {
    if (this.state.file.type.indexOf('svg') === -1) {
      if (this.state.file && this.state.file.type.indexOf('image') !== -1) {
        if (
          this.state.file.height > this.props.image_max_resolution.height ||
          this.state.file.width > this.props.image_max_resolution.width
        ) {
          return callback(
            null,
            `Image is to big, max ${this.props.image_max_resolution.width}x${this.props.image_max_resolution.height}`
          );
        }
        if (
          this.state.file.height < this.props.image_min_resolution.height ||
          this.state.file.width < this.props.image_min_resolution.width
        ) {
          return callback(
            null,
            `Image is to small, min ${this.props.image_min_resolution.width}x${this.props.image_min_resolution.height}`
          );
        }
      }
    }

    return callback(true, false);
  }

  checkImageResolution(file, callback) {
    let height;
    let width;
    const image = new Image();
    if (file.type.indexOf('image') !== -1) {
      image.src = file.preview;
      image.onload = e => {
        width = e.target.width;
        height = e.target.height;
        callback({ width, height }, false);
      };
    } else {
      callback(null, "It isn't an image");
    }
  }

  render() {
    const { file, error } = this.state;
    const { handleSubmit, invalid, attempting, close, fileType } = this.props;
    return (
      <div className="workbooks-media-insertion-modal-body upload">
        <form
          method="post"
          className="upload-form"
          onSubmit={handleSubmit(e => this.onSubmitAttempt(e))}
        >
          <Field
            name="file"
            mediaType={fileType}
            component={FormDropzone}
            uploadedMedia={file}
            changeImage={this.changeImage}
            handleDrop={e => this.onDrop(e)}
            multiple={false}
            allowCrop
          />
          <label htmlFor="title">File Title</label>
          <Field
            disabled={attempting}
            name="title"
            type="text"
            placeholder="Add a title"
            component={FormField}
            inputClassName="input short"
          />
          <label htmlFor="description">Short description</label>
          <Field
            disabled={attempting}
            name="description"
            type="text"
            placeholder="Add a description"
            component={FormField}
          />
          <div className="workbooks-media-insertion-modal-footer p-t-30 p-b-30">
            <div className="upload-error">{error}</div>
            <div className="button is-primary is-outlined" onClick={close}>
              Cancel
            </div>
            <button
              type="submit"
              disabled={invalid || error}
              className={classNames('button', 'is-success', {
                'is-loading': attempting
              })}
            >
              Upload File
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const validate = (values, props) => {
  const errors = {};
  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'description').required();

  switch (props.fileType) {
    case 'image':
      FormUtil.validate(values, errors, 'file')
        .image()
        .maxSize(props.file_max_size)
        .required();
      break;
    case 'video':
      FormUtil.validate(values, errors, 'file')
        .file()
        .video()
        .maxSize(props.file_max_size)
        .required();
      break;
    default:
      return errors;
  }
  return errors;
};

UploadMedia.defaultProps = {
  file_max_size: 10000000
};

UploadMedia.propTypes = {
  uploadMedia: PropTypes.func.isRequired,
  setCurrentMedia: PropTypes.func.isRequired,
  image_max_resolution: PropTypes.object,
  image_min_resolution: PropTypes.object,
  attempting: PropTypes.bool,
  close: PropTypes.func
};

UploadMedia.defaultProps = {
  image_max_resolution: null,
  image_min_resolution: null,
  attempting: false,
  close: () => console.log('Provide close() prop please')
};

UploadMedia = reduxForm({
  form: 'uploadMedia',
  validate
})(UploadMedia);

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (form_name, field_name, value) => {
    dispatch(change(form_name, field_name, value));
  }
});

export default connect(null, mapDispatchToProps)(UploadMedia);
