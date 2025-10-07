import React, { Component } from 'react';
import { Field } from 'redux-form';
import common from 'app/common';
import { noop } from 'app/common/util/helpers';
import util from 'app/user/util/';
import Media from '../../../profile/components/blocks/media';

const { FormUtil } = util;

const {
  components: {
    ShowPreview,
    ContentModalNew,
    MediaUpload,
    MediaCrop,
    Form: { field, select, textarea, tagging, file }
  }
} = common;

const describeMediaValidation = values => {
  const errors = {};

  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'description').required();
  // FormUtil.validate(values, errors, 'category').required();
  return errors;
};

const describeMedia = (tempThumbnail, setThumbnail) => (
  <div className="add-video">
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
      placeholder="Provide a description"
      component={textarea}
    />
    {/* <label htmlFor="description" className="label m-b-10">
      Long Description
    </label>
    <Field
      name="long-description"
      placeholder="Provide a full description"
      component={textarea}
    /> */}
    {/* <label htmlFor="category" className="label m-b-10">
      Category
      <span className="is-text-danger"> *</span>
    </label>
    <Field
      name="category"
      className="control grow"
      component={select}
      onChange={noop}
    >
      <option value="">Please select one</option>
      {categories &&
        map(
          ({ video_category_id, title }) =>
            <option key={video_category_id} value={video_category_id}>
              {title}
            </option>,
          categories
        )}
    </Field>
    <label htmlFor="tags" className="label m-b-10">
      Tags
    </label>
    <Field name="tags" component={tagging} /> */}
    <label className="label m-b-10" htmlFor="thumbnail">
      Video Thumbnail
    </label>
    <div className="columns add-image">
      <div className="column is-narrow">
        <ShowPreview {...{ imagePreview: tempThumbnail }} />
      </div>
      <div className="column">
        <Field
          name="thumbnail"
          component={file}
          type="file"
          onChange={({ target: { files } }) => {
            return files[0] ? setThumbnail(files[0]) : setThumbnail(null);
          }}
        />
      </div>
    </div>
  </div>
);

class VideoNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tempThumbnail: null,
      fileToCrop: null
    };

    this.setThumbnail = this.setThumbnail.bind(this);
  }

  setThumbnail(thumbnail) {
    this.setState({
      tempThumbnail: URL.createObjectURL(thumbnail),
      fileToCrop: thumbnail
    });
  }

  acceptCrop = file => {
    this.setState({
      tempThumbnail: URL.createObjectURL(file),
      fileToCrop: null
    });
  };

  closeCrop = () => {
    this.setState({ fileToCrop: null });
  };

  render() {
    const {
      categories,
      selectedCategory,
      addingVideo,
      toggleAddVideo,
      createVideo,
      uiLoadingVideos
    } = this.props;

    const { tempThumbnail, fileToCrop } = this.state;

    return (
      <div>
        <ContentModalNew
          {...{
            isOpened: addingVideo,
            className: 'add-video-modal',
            onClose: toggleAddVideo
          }}
        >
          <MediaUpload
            {...{
              initialValues: {
                category: selectedCategory
              },
              describeMediaStep: describeMedia(
                tempThumbnail,
                this.setThumbnail
              ),
              describeMediaValidation,
              isUploading: uiLoadingVideos,
              recentlyUploaded: false,
              mediaType: 'video',
              onModalClose: noop,
              onUploadAttempt: createVideo
            }}
          />
        </ContentModalNew>
        {fileToCrop && (
          <MediaCrop
            {...{
              mediaSrc: URL.createObjectURL(fileToCrop),
              onClose: this.closeCrop,
              acceptCrop: this.acceptCrop
            }}
          />
        )}
      </div>
    );
  }
}

export default VideoNew;
