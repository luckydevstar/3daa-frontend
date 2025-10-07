import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, path } from 'ramda';
import { Field, reduxForm, change, initialize } from 'redux-form';
import { connect } from 'react-redux';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import { Creators as QualificationActions } from 'app/qualifications/actions';

import QualificationModalColour from './modals/qualification-modal-colour';

const {
  Form: { dropzone },
  ContentModalNew
} = common.components;

const FormDropzone = dropzone;

class QualificationDetailsMedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      fileOpen: false,
      uploading: false
    };

    this.onSetColour = this.onSetColour.bind(this);
    this.onSetMedia = this.onSetMedia.bind(this);
    this.onUploadMedia = this.onUploadMedia.bind(this);
    this.onFileOpen = this.onFileOpen.bind(this);
  }

  UNSAFE_componentWillMount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.formName &&
      nextProps.uploadedMedia &&
      this.state.uploading &&
      this.state.file &&
      this.state.file.preview == nextProps.uploadMediaPreview
    ) {
      this.setState({ uploading: false });
      this.props.changeFieldValue(
        this.props.formName,
        this.props.fieldName,
        nextProps.uploadedMedia.public_id
      );
    }
  }

  componentDidMount() {}

  openQualificationModalColour(e) {
    this.qualificationModalColour.open();
  }

  closeQualificationModalColour(e) {
    this.qualificationModalColour.close();
    this.onSetColour(e);
  }

  onSetColour(e) {
    const { formName, colourFieldName, changeFieldValue } = this.props;
    this.setState({ colour: e });
    changeFieldValue(formName, colourFieldName, e);
  }

  onSetMedia(file) {
    const { formName, changeFieldValue, fieldName } = this.props;
    this.setState({ file });

    changeFieldValue(formName, fieldName, file);
    if (
      formName == 'qualificationEdit' &&
      fieldName == 'cover' &&
      file &&
      typeof file !== 'string'
    ) {
      if (file.type.includes('video')) {
        changeFieldValue(formName, 'cover_type', 'video');
      } else if (file.type.includes('image')) {
        changeFieldValue(formName, 'cover_type', 'image');
      }
    }
  }

  onUploadMedia() {
    const { mediaType, uploadMediaCloudinaryAttempt } = this.props;
    const { file } = this.state;

    if (!file.type) {
      return;
    }
    this.setState({ uploading: true });
    uploadMediaCloudinaryAttempt(file);
  }

  onFileOpen() {
    this.fileOpen.click();
  }

  render() {
    // const coverStyle = {
    //   backgroundImage: `url(${createCloudinaryUrl(workbookData.cover, 'image', {
    //     width: 180,
    //     height: 250,
    //     crop: 'fill',
    //     gravity: 'center'
    //   })})`
    // };

    const {
      media,
      fieldName,
      mediaType,
      desc1,
      desc2,
      buttonText,
      existingButtonText,
      mediaIcon,
      isColour,
      colour,
      onlyMedia,
      mediaMaxWidth,
      mediaDescriptionMaxWidth,
      attemptingUploadMediaCloudinary,
      editable,
      placeholder,
      prisitine,
      submitting
    } = this.props;
    const { file, uploading } = this.state;

    return (
      <div className="columns" style={{ maxHeight: '100%' }}>
        {/* Qualification Edit modal */}
        <ContentModalNew
          ref={e => {
            this.qualificationModalColour = e;
          }}
        >
          <QualificationModalColour
            colour={colour}
            closeModal={e => this.closeQualificationModalColour(e)}
            onSetColour={e => this.onSetColour(e)}
          />
        </ContentModalNew>

        <div className="column" style={{ maxWidth: mediaMaxWidth }}>
          <Field
            name={fieldName}
            mediaType={mediaType}
            component={FormDropzone}
            uploadedMedia={media}
            buttonText={buttonText}
            existingButtonText={existingButtonText}
            placeholder={placeholder}
            mediaIcon={mediaIcon}
            // handleDrop={file => this.onDrop(file)}
            multiple={false}
            colour={colour}
            editable={editable}
            onOpenFileRef={ref => (this.fileOpen = ref)}
            changeImage={this.onSetMedia}
            onChange={({ target: { files } }) => {
              this.onSetMedia(files[0]);
            }}
            allowCrop={true}
            modalCrop={true}
          />
        </div>
        {!onlyMedia && (
          <div
            className="column"
            style={{ maxWidth: mediaDescriptionMaxWidth }}
          >
            <p className="m-b-10">{desc1}</p>
            <p className="m-b-10">{desc2}</p>
            <div className="m-b-10 has-text-centered">
              <button
                type="button"
                disabled={!editable}
                className={classNames(
                  'qualifications button is-rounded upload-button is-fullwidth',
                  'is-primary',
                  {
                    'is-loading': uploading && attemptingUploadMediaCloudinary
                  }
                )}
                onClick={() => this.onFileOpen()}
              >
                Upload Media
              </button>
            </div>
            {isColour && (
              <div className="m-b-10 has-text-centered">
                <button
                  className="qualifications button is-rounded is-fullwidth"
                  disabled={!editable}
                  onClick={e => this.openQualificationModalColour(e)}
                >
                  Select Colour
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

QualificationDetailsMedia.defaultProps = {
  formName: '',
  fieldName: null,
  colourFieldName: 'colour',
  mediaType: 'video',
  desc1: '',
  desc2: '',
  buttonText: 'Add Cover',
  existingButtonText: 'Change Cover',
  placeholder: '',
  mediaIcon: null,
  colour: '',
  isColour: false,
  onlyMedia: false,
  editable: true,
  mediaMaxWidth: '212px',
  mediaDescriptionMaxWidth: '200px',
  setColour: e => {},
  changeFieldValue: () => {}
};

const mapStateToProps = state => ({
  attemptingUploadMediaCloudinary: path([
    'qualificationMedia',
    'attemptingUploadMediaCloudinary'
  ])(state),
  uploadedMedia: path(['qualificationMedia', 'uploadedMedia'])(state),
  uploadMediaPreview: path(['qualificationMedia', 'uploadMediaPreview'])(state),
  errorCode: path(['qualificationMedia', 'errorCode'])(state)
});

const mapDispatchToProps = dispatch => ({
  uploadMediaCloudinaryAttempt: file =>
    dispatch(QualificationActions.uploadMediaCloudinaryAttempt(file)),

  changeFieldValue: (form_name, field_name, value) => {
    dispatch(change(form_name, field_name, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationDetailsMedia);
