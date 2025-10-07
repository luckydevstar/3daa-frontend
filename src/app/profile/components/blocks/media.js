import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import common from 'app/common';

const { CloudinaryMedia, UILoading } = common.components;

class Media extends Component {
  createMediaElement(media) {
    const { onViewMedia, thumbnailSize } = this.props;
    const { media_id, cloudinary_file_id, title } = media;

    return (
      <li key={media_id} className="column is-one-third">
        <figure
          className="image is-square clickable"
          onClick={() => onViewMedia(media)}
        >
          <CloudinaryMedia
            alt={title}
            mediaType="image"
            fileId={cloudinary_file_id}
            transformations={{
              width: thumbnailSize,
              height: thumbnailSize,
              crop: 'thumb'
            }}
          />
        </figure>
      </li>
    );
  }

  hasMedia() {
    const { gettingPhotos, photos } = this.props;
    return !gettingPhotos && photos && photos.length > 0;
  }

  render() {
    let mediaList = null;
    let mediaEmptyState = null;

    const {
      photos,
      gettingPhotos,
      mediaLimit,
      memberId,
      isLoggedInUser,
      toggleAddPhoto
    } = this.props;

    if (this.hasMedia()) {
      mediaList = photos
        .slice(0, mediaLimit)
        .map(item => this.createMediaElement(item));
    }

    if (!gettingPhotos && photos && photos.length === 0) {
      mediaEmptyState = (
        <li className="column has-text-centered">
          <div
            className="my-media__empty-icon m-t-40"
            title="No media added yet"
          />
          <p className="my-references__empty-message m-t-40 m-b-40">
            No media added yet
          </p>
          {isLoggedInUser &&
            <button
              type="button"
              className="my-media__empty-cta button is-primary is-outlined is-large is-fullwidth m-t-40 m-b-30"
              onClick={toggleAddPhoto}
            >
              Add media
            </button>}
        </li>
      );
    }

    return (
      <div className="profile-section my-media">
        <div className="profile-title">
          Media
          {this.hasMedia() &&
            <Link to={`/profile/${memberId}/photos`}>
              <span className="link">View all</span>
            </Link>}
        </div>
        {gettingPhotos
          ? <UILoading />
          : <ul className="columns is-multiline">
              {mediaList}
              {mediaEmptyState}
            </ul>}
      </div>
    );
  }
}

Media.defaultProps = {
  photos: [],
  gettingPhotos: false,
  thumbnailSize: 180,
  mediaLimit: 9
};

Media.propTypes = {
  memberId: PropTypes.number.isRequired,
  isLoggedInUser: PropTypes.bool.isRequired,
  photos: PropTypes.arrayOf(PropTypes.object),
  gettingPhotos: PropTypes.bool,
  thumbnailSize: PropTypes.number,
  mediaLimit: PropTypes.number,
  toggleAddPhoto: PropTypes.func.isRequired,
  onViewMedia: PropTypes.func.isRequired
};

export default Media;
