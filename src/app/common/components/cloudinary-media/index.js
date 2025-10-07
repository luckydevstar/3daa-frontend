import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import cloudinary from 'cloudinary-core';
import TransparentVideo from '../transparent-video';
import config from 'brand/config';

import { getThumbnails } from 'video-metadata-thumbnails';

class CloudinaryMedia extends Component {
  constructor(props) {
    super(props);
    // this.cl = cloudinary.Cloudinary.new();
    // this.cl.config('cloud_name', this.props.cloudName);
    // this.cl.config('secure', true);
  }

  render() {
    const {
      alt,
      attributes,
      className,
      fileId,
      handleImageLoaded,
      mediaType,
      style,
      transformations,
      transparent,
      thumbnail,
      setVideoElement,
      innerRef
    } = this.props;

    // Shows Thumbnail image if thumbnail
    if (thumbnail) {
      return (
        <img
          alt={alt || ''}
          onError={el => {
            el.target.style.display = 'none';
          }}
          onLoad={handleImageLoaded}
          // src={`${this.cl.video_url(fileId, transformations)}.jpg`}
          src={fileId}
          className={classNames(className)}
          style={style}
          {...attributes}
        />
      );
    }

    // Shows video if media type is video
    if (mediaType === 'video') {
      // const url = this.cl.video_url(fileId, transformations);
      const url = fileId;

      return transparent ? (
        <TransparentVideo {...{ url }} />
      ) : (
        <video
          // poster={this.props.poster || url}
          className={classNames(className)}
          style={style}
          {...attributes}
          ref={el => {
            setVideoElement(el);
          }}
        >
          <source src={url} type="video/mp4" />
          {/* <source src={`${url}.ogv`} type="video/ogg" /> */}
          {/* <source src={`${url}.webm`} type="video/webm" /> */}
          Your browser does not support the video tag.
        </video>
      );
    }

    // Shows image if media type is image
    return (
      <img
        alt={alt || ''}
        onLoad={handleImageLoaded}
        ref={node => (innerRef ? innerRef(node) : null)}
        // src={this.cl.url(fileId, transformations)}
        src={fileId}
        className={classNames(className)}
        {...attributes}
      />
    );
  }
}

CloudinaryMedia.defaultProps = {
  mediaType: 'image',
  fileId: null,
  cloudName: config.CLOUD_NAME,
  transformations: null,
  attributes: null,
  thumbnail: false,
  style: null,
  poster: null,
  transparent: false,
  play: false,
  setVideoElement: () => {}
};

CloudinaryMedia.propTypes = {
  mediaType: PropTypes.oneOf(['video', 'image']),
  fileId: PropTypes.string,
  transformations: PropTypes.object,
  attributes: PropTypes.object,
  cloudName: PropTypes.string,
  thumbnail: PropTypes.bool,
  transparent: PropTypes.bool,
  style: PropTypes.object,
  poster: PropTypes.string,
  setVideoElement: PropTypes.func
};

export default CloudinaryMedia;
