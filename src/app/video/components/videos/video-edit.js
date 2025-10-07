/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { propEq, find, pipe, defaultTo, merge } from 'ramda';
import cx from 'classnames';
import common from 'app/common';
import util from 'app/user/util';

const { FormUtil } = util;
const {
  components: {
    ShowPreview,
    MediaCrop,
    Form: { field, textarea, file }
  }
} = common;

const FORM_NAME = 'editVideo';

const findVideo = id => pipe(find(propEq('media_id', id)), defaultTo({}));

class EditVideoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileToCrop: null
    };
  }
  setThumbnail = file => {
    const { setThumbnail } = this.props;
    this.setState({
      fileToCrop: file
    });
    return file ? setThumbnail(URL.createObjectURL(file)) : setThumbnail(null);
  };
  acceptCrop = file => {
    this.setThumbnail(file);
    this.closeCrop();
  };

  closeCrop = () => {
    this.setState({
      fileToCrop: null
    });
  };
  render() {
    const {
      categories,
      uiLoadingVideos,
      pristine,
      handleSubmit,
      submitting,
      closeFn,
      tempThumbnail,
      initialValues: { thumbnail },
      setThumbnail,
      valid
    } = this.props;
    const { fileToCrop } = this.state;
    console.log(uiLoadingVideos);
    return (
      <form onSubmit={handleSubmit} className="inner">
        <div className="inner-form add-video">
          <label htmlFor="title" className="label m-b-10">
            Title
            <span className="is-text-danger"> *</span>
          </label>
          <Field
            name="title"
            placeholder="Provide a meaningful title "
            component={field}
          />
          <label htmlFor="description" className="label m-b-10">
            Description
            <span className="is-text-danger"> *</span>
          </label>
          <Field
            name="description"
            placeholder="Provide description"
            component={textarea}
          />
          {/* <label htmlFor="tags" className="label m-b-10">
            Tags
          </label>
          <Field name="tags" component={tagging} /> */}
          {/* <label htmlFor="description" className="label m-b-10">
            Long Description
          </label>
          <Field
            name="long-description"
            placeholder="Provide a full description"
            component={textarea}
          />*/}
          {/* <label htmlFor="category" className="label m-b-10">
            Category
          </label>
          <Field
            name="category"
            className="control grow"
            component={select}
            onChange={noop}
          >
            <option value="">Please select one</option>
            {map(
              ({ video_category_id, title }) => (
                <option key={video_category_id} value={video_category_id}>
                  {title}
                </option>
              ),
              categories
            )}
          </Field> */}
          <label className="label m-b-10" htmlFor="thumbnail">
            Video Thumbnail
          </label>
          <div className="columns add-image">
            <div className="column is-narrow">
              <ShowPreview
                {...{
                  imagePreview: tempThumbnail,
                  cloudinary_image_id: thumbnail
                }}
              />
            </div>
            <div className="column">
              <Field
                name="thumbnail"
                component={file}
                type="file"
                onChange={({ target: { files } }) => {
                  this.setThumbnail(files[0]);
                }}
              />
            </div>
          </div>
        </div>
        <div className="content-modal-confirm-control field is-pulled-right">
          <button
            className="button is-outlined m-r-15"
            disabled={submitting}
            onClick={closeFn}
          >
            Cancel
          </button>
          <button
            className={cx('button is-primary', {
              'is-loading': uiLoadingVideos
            })}
            disabled={pristine || submitting}
          >
            Save
          </button>
        </div>
        {fileToCrop && (
          <MediaCrop
            {...{
              mediaSrc: URL.createObjectURL(fileToCrop),
              onClose: this.closeCrop,
              acceptCrop: this.acceptCrop
            }}
          />
        )}
      </form>
    );
  }
}

const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'description').required();
  return errors;
};

const ConnectedForm = reduxForm({ form: FORM_NAME, validate })(EditVideoForm);

class EditVideoView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tempThumbnail: null
    };

    this.setThumbnail = this.setThumbnail.bind(this);
  }

  setThumbnail(thumbnail) {
    this.setState({
      tempThumbnail: thumbnail
    });
  }

  render() {
    const {
      categories,
      videos,
      id,
      closeFn,
      updateVideo,
      uiLoadingVideos
    } = this.props;
    const { tempThumbnail } = this.state;

    if (!id || !videos) return null;

    const initialValues = findVideo(id)(videos);
    const { title, description, tags, thumbnail } = initialValues;

    return (
      <div className="modal-form">
        <div className="info">
          <h3>Edit Video</h3>
          <p>Please provide a group title and optional group image.</p>
        </div>
        <ConnectedForm
          {...{
            onSubmit: data => updateVideo(merge(initialValues, data)),
            initialValues: {
              title,
              description,
              tags,
              thumbnail
            },
            tempThumbnail,
            setThumbnail: this.setThumbnail,
            categories,
            closeFn,
            uiLoadingVideos
          }}
        />
      </div>
    );
  }
}

export default EditVideoView;
