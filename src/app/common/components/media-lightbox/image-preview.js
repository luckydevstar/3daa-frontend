import React from 'react';

import CloudinaryMedia from '../cloudinary-media';

const ImagePreview = ({ media }) => {
  return (
    <CloudinaryMedia
      alt={media.title}
      className={'media-lightbox__img'}
      mediaType="image"
      fileId={media.cloudinary_file_id}
    />
  );
};

export default ImagePreview;
