import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import { head, unless, is, pass, not } from 'ramda';
import CloudinaryMedia from '../cloudinary-media';
import Isvg from 'react-inlinesvg';
import Cropper from 'cropperjs';
import ReactSlider from 'react-slider';
import cx from 'classnames';
import MediaCrop from '../media-crop/MediaCrop';

import IconImagePreview from 'images/icon_image_preview.svg';
import IconVideoPreview from 'images/icon_video_preview.svg';

// const {
//   components: {
//     ContentModalNew,
//   }
// } = common;

class FormDropzone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cropper: null,
      zoomValue: 0,
      cropImage: null,
      cropModal: false
    };
    this.cropBlock = null;
    this.cropBlockModal = null;
    this.cropImage = null;
    this.cropper = null;
    this.classForDropzone = this.classForDropzone.bind(this);
    this.classForControl = this.classForControl.bind(this);
    this.initCropper = this.initCropper.bind(this);
    this.cropStart = this.cropStart.bind(this);
    this.cropEnd = this.cropEnd.bind(this);
  }

  componentDidMount() {
    this.props.onOpenFileRef(this.openFile);
  }

  componentDidUpdate() {
    this.props.onOpenFileRef(this.openFile);
    // if(!this.cropper) {
    //   this.initCropper();
    // }
  }

  initCropper() {
    const { input, modalCrop } = this.props;
    const uploadedMedia =
      unless(is(String), head)(input.value) ||
      this.props.uploadedMedia ||
      (input.value && input.value['cloudinary_file_id']) ||
      input.value;
    let img = null;
    img = new Image();
    if (typeof uploadedMedia === 'string' && uploadedMedia) {
      img.src = uploadedMedia;
    } else {
      img.src = uploadedMedia.preview;
    }
    if (modalCrop) {
      this.setState(
        {
          cropper,
          cropImage: img,
          cropModal: true
        },
        () => {
          this.cropBlockModal.appendChild(img);
          const cropper = new Cropper(img, {
            aspectRatio: null,
            zoomOnWheel: false,
            checkCrossOrigin: true
          });
          this.setState({
            cropper,
            cropImage: img
          });
        }
      );
    } else {
      this.cropBlock.appendChild(img);
      const cropper = new Cropper(img, {
        aspectRatio: null,
        zoomOnWheel: false,
        checkCrossOrigin: true
      });
      this.setState({
        cropper,
        cropImage: img
      });
    }

    // this.setState({

    // }, () => {
    //   img = document.querySelector('#dropzone-modal-image');
    //   console.log(img);

    // });
  }

  classForControl(className) {
    const {
      meta: { dirty, error }
    } = this.props;

    return classNames(className, {
      'has-error': dirty && error
    });
  }

  classForDropzone(className) {
    const {
      meta: { dirty, error }
    } = this.props;
    return classNames(className, {
      'has-error': dirty && error
    });
  }

  createVideoPreview(video) {
    let result = null;
    if (typeof video === 'string') {
      result = (
        <CloudinaryMedia
          fileId={video}
          mediaType="video"
          attributes={{ controls: true }}
          transformations={{
            // width: 200,
            // height: 200,
            crop: 'fill',
            gravity: 'center'
          }}
        />
      );
    } else if (!video.preview) {
      // if Preview isn't ready yet
      const videoUrl = window.URL.createObjectURL(video);
      result = <video src={videoUrl} controls />;
    } else {
      result = <video src={video.preview} controls />;
    }

    return result;
  }

  createPhotoPreview(photo) {
    let result = null;
    if (typeof photo === 'string' && photo) {
      result = (
        <CloudinaryMedia
          fileId={photo}
          mediaType="image"
          innerRef={node => (this.dropzoneImage = node)}
          transformations={{
            width: 200,
            height: 200,
            crop: 'fit',
            gravity: 'center'
          }}
        />
      );
    } else if (photo && photo.preview) {
      result = (
        <img
          ref={node => (this.dropzoneImage = node)}
          src={photo.preview}
          alt=""
        />
      );
    } else {
      result = (
        <div
          className="columns"
          style={{
            maxWidth: 150,
            paddingTop: 50,
            margin: 'auto'
          }}
        >
          <div className="column">
            <Isvg className="small" src={IconImagePreview} />
          </div>
        </div>
      );
    }
    return result;
  }

  createBothPreview(file, cloudinaryMediaType) {
    let result = null;
    switch (cloudinaryMediaType) {
      case 'image':
        result = (
          <CloudinaryMedia
            fileId={file}
            mediaType={cloudinaryMediaType}
            transformations={{
              width: 200,
              height: 200,
              crop: 'fill',
              gravity: 'center'
            }}
          />
        );
        break;
      case 'video':
        result = (
          <CloudinaryMedia
            fileId={file}
            mediaType={cloudinaryMediaType}
            thumbnail
            transformations={{
              width: 200,
              height: 200,
              crop: 'fill',
              gravity: 'center'
            }}
          />
        );
        break;
      default:
        result = (
          <div
            className="columns"
            style={{
              maxWidth: 140,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <div className="column">
              <Isvg className="small" src={IconImagePreview} />
            </div>
            <div className="column">
              <Isvg className="small" src={IconVideoPreview} />
            </div>
          </div>
        );
    }

    if (file && typeof file !== 'string') {
      if (file.type.includes('video')) {
        result = <video src={file.preview} controls />;
      } else if (file.type.includes('image')) {
        result = <img src={file.preview} alt="" />;
      } else {
        result = <div />;
      }
    }
    return result;
  }

  createMediaPreview(uploadedMedia, mediaType, cloudinaryMediaType) {
    let result = null;
    switch (mediaType) {
      case 'image':
        result = this.createPhotoPreview(uploadedMedia);
        break;
      case 'video':
        result = this.createVideoPreview(uploadedMedia);
        break;
      case 'both':
        result = this.createBothPreview(uploadedMedia, cloudinaryMediaType);
        break;
      default:
        result = null;
    }

    return result;
  }

  renderButtonText(existing, mediaType) {
    if (existing && this.props.existingButtonText)
      return this.props.existingButtonText;
    else if (!existing && this.props.buttonText) return this.props.buttonText;

    let result = null;
    switch (mediaType) {
      case 'pdf':
        result = existing ? 'Select different pdf' : 'Select pdf';
        break;
      case 'image':
        result = existing ? 'Select different image' : 'Select image';
        break;
      case 'video':
        result = existing ? 'Select different video' : 'Select video';
        break;
      case 'both':
        result = existing ? 'Select different media file' : 'Select media file';
        break;
      default:
        result = null;
    }
    return result;
  }

  cropStart() {
    const { modalCrop } = this.props;
    if (modalCrop) {
      this.setState({
        cropModal: true
      });
    } else {
      this.initCropper();
    }
  }

  cropEnd() {
    const { changeImage } = this.props;
    const { cropper, cropImage } = this.state;

    const canvas = cropper.getCroppedCanvas();
    canvas.toBlob(blob => {
      const file = new File(
        [blob],
        `${cropImage.src.replace(/^.*[\\\/]/, '')}.png`,
        {
          type: 'image/png'
        }
      );
      file.preview = URL.createObjectURL(blob);
      if (changeImage) {
        changeImage(file);
      }
      this.setState(
        {
          cropper: null
        },
        () => {
          cropper.destroy();
          cropImage.remove();
          this.setState({
            cropImage: null
          });
        }
      );
    });
  }

  rotate = () => {
    const { cropper } = this.state;
    if (cropper) {
      cropper.rotate(45);
    }
  };

  setZoom = value => {
    const { cropper, zoomValue } = this.state;
    if (cropper) {
      cropper.zoom(value - zoomValue);
      this.setState({
        zoomValue: value
      });
    }
  };

  closeModal = () => {
    this.setState({ cropModal: false });
  };

  acceptModalCrop = file => {
    const { changeImage } = this.props;
    if (changeImage) {
      changeImage(file);
    }
    this.closeModal();
  };

  render() {
    const {
      input,
      type,
      placeholder,
      editable,
      disabled,
      className = '',
      height,
      dropzoneClassName = 'dropzone',
      onChange,
      onKeyUp,
      handleDrop,
      multiple,
      mediaType,
      preview,
      cloudinaryMediaType,
      meta: { error, dirty },
      mediaIcon,
      colour,
      allowCrop,
      modalCrop
    } = this.props;
    const { cropper, zoomValue, cropImage, cropModal } = this.state;
    const uploadedMedia =
      unless(is(String), head)(input.value) ||
      this.props.uploadedMedia ||
      (input.value && input.value['cloudinary_file_id']) ||
      input.value;

    const field = {
      type,
      disabled,
      placeholder
    };

    const events = {};

    if (onChange) {
      events.onChange = onChange;
    }

    if (onKeyUp) {
      events.onKeyUp = onKeyUp;
    }

    if (preview) {
      return this.createMediaPreview(
        uploadedMedia,
        mediaType,
        cloudinaryMediaType
      );
    }

    const dropzone = uploadedMedia ? (
      this.createMediaPreview(uploadedMedia, mediaType, cloudinaryMediaType)
    ) : (
      <div className="is-fullwidth has-text-centered">
        {mediaIcon ? (
          <Isvg className="small" src={mediaIcon} />
        ) : (
          <div>
            <p className="title is-4">Drop file here</p>
            <p>or</p>
          </div>
        )}
      </div>
    );

    return (
      <div
        className={this.classForControl(className)}
        style={{ maxHeight: '100%', height: height, position: 'relative' }}
      >
        {allowCrop && !modalCrop && (
          <div
            className={cx({
              'dropzone-crop-block': cropImage
            })}
          >
            <div ref={node => (this.cropBlock = node)} />
          </div>
        )}
        {(!cropImage || modalCrop) && (
          <Dropzone
            {...input}
            {...field}
            {...events}
            onDrop={handleDrop}
            className={this.classForDropzone(dropzoneClassName)}
            multiple={multiple}
            style={{
              background: colour,
              padding:
                allowCrop && mediaType === 'image' && modalCrop
                  ? '40px 20px 20px 20px'
                  : '50px 20px 20px 20px'
            }}
          >
            {dirty && error ? (
              <span className="field-error">
                {dirty && error ? error : null}
              </span>
            ) : (
              dropzone
            )}
            {editable && (
              <div>
                <a
                  ref={e => {
                    this.openFile = e;
                  }}
                  onClick={this.onOpenClick}
                >
                  {this.renderButtonText(uploadedMedia, mediaType)}
                </a>
              </div>
            )}
            {placeholder && (
              <div className="m-b-10 has-text-centered">{placeholder}</div>
            )}
          </Dropzone>
        )}
        {cropper && !modalCrop && (
          <div className="dropzone-options">
            <i className="fa fa-picture-o zoom-out-icon" />
            <ReactSlider
              className="horizontal-slider"
              // thumbClassName="example-thumb"
              // trackClassName="example-track"
              min={0}
              max={2}
              step={0.05}
              onChange={this.setZoom}
              value={zoomValue}
            />
            <i className="fa fa-picture-o zoom-in-icon" />
            <i className="fa fa-repeat rotate-icon" onClick={this.rotate} />
          </div>
        )}
        {!cropper && mediaType === 'image' && allowCrop && (
          <div
            className={cx('dropzone-crop-button', {
              'dropzone-crop-button--modal': modalCrop
            })}
            onClick={this.cropStart}
          >
            <i className="fa fa-crop" />
          </div>
        )}
        {cropper && !modalCrop && (
          <div className="dropzone-crop-button" onClick={this.cropEnd}>
            Accept
          </div>
        )}
        {cropModal && allowCrop && modalCrop && (
          <MediaCrop
            onClose={this.closeModal}
            mediaSrc={
              typeof uploadedMedia === 'string'
                ? uploadedMedia
                : uploadedMedia.preview
            }
            acceptCrop={this.acceptModalCrop}
          />
        )}
      </div>
    );
  }
}

FormDropzone.defaultProps = {
  className: '',
  height: '100%',
  multiple: false,
  mediaType: 'image',
  preview: false,
  buttonText: '',
  existingButtonText: '',
  mediaIcon: null,
  cloudinaryMediaType: null,
  colour: '',
  editable: true,
  placeholder: '',
  onOpenFileRef: () => null,
  handleDrop: () => {
    console.log('default handleDrop function');
    return null;
  }
};

FormDropzone.propTypes = {
  className: PropTypes.string,
  handleDrop: PropTypes.func,
  multiple: PropTypes.bool,
  mediaType: PropTypes.oneOf(['pdf', 'image', 'video', 'both']),
  preview: PropTypes.bool,
  buttonText: PropTypes.string,
  existingButtonText: PropTypes.string,
  mediaIcon: PropTypes.any,
  cloudinaryMediaType: PropTypes.oneOf(['image', 'video']),
  colour: PropTypes.string
};

export default FormDropzone;
