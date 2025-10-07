import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import common from 'app/common';
import { createAmazonS3Url } from '../../util/helpers';

class AmazonMedia extends Component {
  render() {
    const {
      alt,
      attributes,
      className,
      fileId,
      handleImageLoaded,
      mediaType,
      style
    } = this.props;

    const url = createAmazonS3Url(fileId);

    // Shows video if media type is video
    if (mediaType === 'video') {
      const url = fileId;

      return (
        <video className={classNames(className)} style={style} {...attributes}>
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
        src={url}
        className={classNames(className)}
        {...attributes}
      />
    );
  }
}

AmazonMedia.defaultProps = {
  mediaType: 'image',
  fileId: null,
  attributes: null,
  style: null,
  alt: '',
  handleImageLoaded: () => {}
};

AmazonMedia.propTypes = {
  mediaType: PropTypes.oneOf(['video', 'image']),
  fileId: PropTypes.string,
  attributes: PropTypes.object,
  style: PropTypes.object,
  handleImageLoaded: PropTypes.func,
  alt: PropTypes.string
};

export default AmazonMedia;
