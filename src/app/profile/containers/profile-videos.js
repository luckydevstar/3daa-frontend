import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { Creators } from '../actions';
import { prepend } from 'ramda';
import { ProfileMediaAdd } from '../containers';

const {
  CloudinaryMedia,
  ContentModalNew,
  Pagination,
  UILoading,
  Form: { field: FormField, select: FormSelect }
} = common.components;

class ProfileVideos extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 1
    };
  }

  describeMediaStep() {
    return (
      <div>
        <label htmlFor="title" className="label m-b-10 align-left">
          Title
        </label>
        <Field
          id="title"
          name="title"
          type="text"
          placeholder="Example Title"
          component={FormField}
          label={'Image Title'}
        />

        <label htmlFor="description" className="label m-b-10 align-left">
          Description
        </label>
        <Field
          id="description"
          name="description"
          type="text"
          placeholder="Please provide a description"
          component={FormField}
          label={'Description'}
        />

        <div className="columns">
          <div className="column">
            <label htmlFor="category" className="label m-b-10 align-left">
              Category
            </label>
            <Field
              id="is_public"
              name="is_public"
              className="control grow"
              component={FormSelect}
            >
              <option value="1">Public</option>
              <option value="0">Private</option>
            </Field>
          </div>
        </div>
      </div>
    );
  }

  hasPagination() {
    const { videos, itemsPerPage } = this.props;
    return videos.length > itemsPerPage;
  }

  goToPage(page) {
    document.querySelector('.content-container').scrollTop = 0;
    this.setState({ currentPage: page });
  }

  createPictureElement(media) {
    const { mediaSize, onViewMedia } = this.props;
    const {
      media_id,
      cloudinary_file_id,
      title,
      description,
      thumbnail
    } = media;

    return (
      <li key={media_id} className="column is-4-desktop is-6-tablet">
        <figure
          className="videos-tab__figure image is-square clickable"
          onClick={() => onViewMedia(media)}
        >
          <CloudinaryMedia
            thumbnail
            alt={title}
            mediaType="video"
            fileId={thumbnail}
            transformations={{
              width: mediaSize,
              height: mediaSize,
              crop: 'thumb',
              gravity: 'face'
            }}
          />

          <div className="videos-tab__details">
            <div className="videos-tab__play-arrow">
              <i className="fa fa-play" aria-hidden="true" />
            </div>
            <div className="videos-tab__details-footer">
              <div className="videos-tab__title">{title}</div>
              <div className="videos-tab__description">{description}</div>
            </div>
          </div>
        </figure>
      </li>
    );
  }

  renderPictures() {
    const { videos } = this.props;
    const { currentPage } = this.state;

    let result;

    const pageFirstIndex =
      (parseInt(currentPage) - 1) * this.props.itemsPerPage;
    const pageLastIndex = pageFirstIndex + (this.props.itemsPerPage - 1);

    result = videos
      .filter(
        (picture, index) => index >= pageFirstIndex && index <= pageLastIndex
      )
      .map(picture => this.createPictureElement(picture));

    result = prepend(this.renderNewMediaBlock(), result);

    return result;
  }

  renderPagination() {
    const { videos } = this.props;
    return videos && this.hasPagination() ? (
      <Pagination
        className="videos-tab__pagination"
        itemsLength={videos.length}
        itemsPerPage={this.props.itemsPerPage}
        maxPagesDisplayed={3}
        onPageChange={page => this.goToPage(page)}
      />
    ) : null;
  }

  renderSpinner() {
    return this.props.gettingVideos ? <UILoading marginTop="80px" /> : null;
  }

  renderNewMediaBlock() {
    const { isLoggedInUser, toggleAddVideo } = this.props;
    return isLoggedInUser ? (
      <li
        key="add-new"
        className="videos-tab__add-media column is-4-desktop is-6-tablet"
      >
        <button
          className="videos-tab__add-media-btn button hoverable image"
          onClick={toggleAddVideo}
        >
          <span className="videos-tab__add-media-label">
            Add Videod{' '}
            <i
              className="videos-tab__add-media-icon fa fa-plus-circle"
              aria-hidden="true"
            />
          </span>
        </button>
      </li>
    ) : null;
  }

  renderEmptyView() {
    const { toggleAddVideo, gettingVideos } = this.props;

    return !gettingVideos ? (
      <div className="videos-tab__empty-container has-text-centered column">
        <figure className="videos-tab__empty-icon" />
        <h2 className="videos-tab__empty-title m-t-30">No videos yet</h2>
        <p className="videos-tab__empty-description m-t-10 m-b-50">
          Tutors will provide students with academic support during assigned
          qualification
        </p>
        <button
          className="videos-tab__empty-cta button is-primary hoverable is-large"
          onClick={toggleAddVideo}
        >
          Add video
        </button>
      </div>
    ) : null;
  }

  render() {
    const { addingVideo, toggleAddVideo, videos } = this.props;

    return (
      <div className="videos-tab column content-middle">
        <ul className="columns is-multiline">
          {this.renderSpinner()}
          {videos && videos.length
            ? this.renderPictures()
            : this.renderEmptyView()}
        </ul>
        {this.renderPagination()}

        <ContentModalNew isOpened={addingVideo} onClose={toggleAddVideo}>
          <ProfileMediaAdd
            describeMediaStep={this.describeMediaStep()}
            mediaType="video"
            onComplete={toggleAddVideo}
          />
        </ContentModalNew>
      </div>
    );
  }
}

ProfileVideos.defaultProps = {
  videos: [],
  gettingVideos: false,
  mediaSize: 330,
  itemsPerPage: 11
};

ProfileVideos.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.object),
  gettingVideos: PropTypes.bool,
  mediaSize: PropTypes.number,
  itemsPerPage: PropTypes.number,
  toggleAddVideo: PropTypes.func.isRequired,
  onViewMedia: PropTypes.func.isRequired
};

const mapStateToProps = ({ profileBio }) => ({
  ...profileBio
});

const mapDispatchToProps = dispatch => ({
  onViewMedia: media => dispatch(Creators.viewMedia(media)),
  toggleAddVideo: () => dispatch(Creators.toggleAddVideo())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileVideos);
