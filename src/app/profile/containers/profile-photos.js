import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import { connect } from 'react-redux';
import { Creators } from '../actions';
import { prepend } from 'ramda';

const { CloudinaryMedia, Pagination, UILoading } = common.components;

class ProfilePhotos extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 1
    };
  }

  hasPagination() {
    const { photos, itemsPerPage } = this.props;
    return photos.length > itemsPerPage;
  }

  goToPage(page) {
    document.querySelector('.content-container').scrollTop = 0;
    this.setState({ currentPage: page });
  }

  createPictureElement(media) {
    const { mediaSize, onViewMedia } = this.props;
    const { media_id, cloudinary_file_id, title, description } = media;

    return (
      <li key={media_id} className="column is-4-desktop is-6-tablet">
        <figure
          className="photos-tab__figure image is-square clickable"
          onClick={() => onViewMedia(media)}
        >
          <CloudinaryMedia
            alt={title}
            mediaType="image"
            fileId={cloudinary_file_id}
            transformations={{
              width: mediaSize,
              height: mediaSize,
              crop: 'thumb',
              gravity: 'face'
            }}
          />

          <div className="photos-tab__details">
            <div className="photos-tab__details-footer">
              <div className="photos-tab__title">
                {title}
              </div>
              <div className="photos-tab__description">
                {description}
              </div>
            </div>
          </div>
        </figure>
      </li>
    );
  }

  renderPictures() {
    const { photos } = this.props;
    const { currentPage } = this.state;

    let result;

    if (photos && photos.length) {
      const pageFirstIndex =
        (parseInt(currentPage) - 1) * this.props.itemsPerPage;
      const pageLastIndex = pageFirstIndex + (this.props.itemsPerPage - 1);

      result = photos
        .filter(
          (picture, index) => index >= pageFirstIndex && index <= pageLastIndex
        )
        .map(picture => this.createPictureElement(picture));
    }

    result = prepend(this.renderNewMediaBlock(), result);

    return result;
  }

  renderPagination() {
    const { photos } = this.props;
    return photos && this.hasPagination()
      ? <Pagination
          className="photos-tab__pagination"
          itemsLength={photos.length}
          itemsPerPage={this.props.itemsPerPage}
          maxPagesDisplayed={3}
          onPageChange={page => this.goToPage(page)}
        />
      : null;
  }

  renderSpinner() {
    return this.props.gettingPhotos ? <UILoading marginTop="80px" /> : null;
  }

  renderNewMediaBlock() {
    const { isLoggedInUser, toggleAddPhoto } = this.props;
    return isLoggedInUser
      ? <li
          key="add-new"
          className="photos-tab__add-media column is-4-desktop is-6-tablet"
        >
          <button
            className="photos-tab__add-media-btn button hoverable image"
            onClick={toggleAddPhoto}
          >
            <span className="photos-tab__add-media-label">
              Add Image{' '}
              <i
                className="photos-tab__add-media-icon fa fa-plus-circle"
                aria-hidden="true"
              />
            </span>
          </button>
        </li>
      : null;
  }

  renderEmptyView() {
    const { toggleAddPhoto, gettingPhotos } = this.props;

    return !gettingPhotos
      ? <div className="photos-tab__empty-container has-text-centered column">
          <figure className="photos-tab__empty-icon" />
          <h2 className="photos-tab__empty-title m-t-30">No photos yet</h2>
          <p className="photos-tab__empty-description m-t-10 m-b-50">
            Tutors will provide students with academic support during assigned
            qualification
          </p>
          <button
            className="videos-tab__empty-cta button is-primary hoverable is-large"
            onClick={toggleAddPhoto}
          >
            Add photo
          </button>
        </div>
      : null;
  }

  render() {
    const { photos } = this.props;

    return (
      <div className="column content-middle">
        <ul className="columns is-multiline">
          {this.renderSpinner()}
          {photos && photos.length
            ? this.renderPictures()
            : this.renderEmptyView()}
        </ul>
        {this.renderPagination()}
      </div>
    );
  }
}

ProfilePhotos.defaultProps = {
  photos: [],
  gettingPhotos: false,
  mediaSize: 330,
  itemsPerPage: 11
};

ProfilePhotos.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.object),
  gettingPhotos: PropTypes.bool,
  mediaSize: PropTypes.number,
  itemsPerPage: PropTypes.number,
  toggleAddPhoto: PropTypes.func.isRequired,
  onViewMedia: PropTypes.func.isRequired
};

const mapStateToProps = ({ profileBio }) => ({
  ...profileBio
});

const mapDispatchToProps = dispatch => ({
  onViewMedia: media => dispatch(Creators.viewMedia(media)),
  toggleAddPhoto: () => dispatch(Creators.toggleAddPhoto())
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePhotos);
