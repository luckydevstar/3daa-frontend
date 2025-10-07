import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, path } from 'ramda';
import { Field, reduxForm, change, initialize } from 'redux-form';
import { connect } from 'react-redux';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import { Creators as NewsActions } from 'app/news/actions';

import ModalColour from './modals/modal-colour';

const {
  Form: { dropzone },
  ContentModalNew
} = common.components;

const FormDropzone = dropzone;

class DetailsMedia extends Component {
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

  openModalColour(e) {
    this.ModalColour.open();
  }

  closeModalColour(e) {
    this.ModalColour.close();
    this.onSetColour(e);
  }

  onSetColour(e) {
    const { formName, colourFieldName, changeFieldValue } = this.props;
    this.setState({ colour: e });
    changeFieldValue(formName, colourFieldName, e);
  }

  onSetMedia(file, isCropping) {
    const { formName, changeFieldValue } = this.props;
    this.setState({ file: file });

    if (formName == 'qualificationEdit' && file && typeof file !== 'string') {
      if (file.type.includes('video')) {
        changeFieldValue(formName, 'cover_type', 'video');
      } else if (file.type.includes('image')) {
        changeFieldValue(formName, 'cover_type', 'image');
      }
    }
    if (isCropping) {
      changeFieldValue(formName, 'cover', file);
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
      prisitine,
      submitting
    } = this.props;

    const { file, uploading } = this.state;

    return (
      <div className="columns" style={{ maxHeight: '100%' }}>
        {/* Qualification Edit modal */}
        <ContentModalNew
          ref={e => {
            this.ModalColour = e;
          }}
        >
          <ModalColour
            colour={colour}
            closeModal={e => this.closeModalColour(e)}
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
            mediaIcon={mediaIcon}
            // handleDrop={file => this.onDrop(file)}
            multiple={false}
            colour={colour}
            onOpenFileRef={ref => (this.fileOpen = ref)}
            allowCrop={true}
            modalCrop={true}
            changeImage={file => this.onSetMedia(file, true)}
            onChange={({ target: { files } }) => {
              this.onSetMedia(files[0]);
            }}
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
                className={classNames(
                  'button is-rounded upload-button is-fullwidth',
                  'is-primary'
                )}
                onClick={() => this.fileOpen.click()}
              >
                Upload Media
              </button>
            </div>
            {isColour && (
              <div className="m-b-10 has-text-centered">
                <a
                  className="button is-rounded"
                  onClick={e => this.openModalColour(e)}
                >
                  Select Colour
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

DetailsMedia.defaultProps = {
  editable: false,
  formName: '',
  fieldName: null,
  colourFieldName: 'colour',
  mediaType: 'video',
  desc1: '',
  desc2: '',
  buttonText: 'Add Cover',
  existingButtonText: 'Change Cover',
  mediaIcon: null,
  colour: '',
  isColour: false,
  onlyMedia: false,
  mediaMaxWidth: '212px',
  mediaDescriptionMaxWidth: '200px',
  setColour: e => {},
  changeFieldValue: () => {}
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  uploadMediaCloudinaryAttempt: file =>
    dispatch(NewsActions.uploadMediaCloudinaryAttempt(file)),

  changeFieldValue: (form_name, field_name, value) => {
    dispatch(change(form_name, field_name, value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsMedia);
