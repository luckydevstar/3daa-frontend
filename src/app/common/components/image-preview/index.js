import React from 'react';
import { cond, prop, T, always } from 'ramda';
import { createCloudinaryUrl } from 'app/common/util/helpers';
import DefaultPreview from 'images/icon_profile_brand.svg';

const getImage = img =>
  createCloudinaryUrl(img, 'image', {
    width: '70',
    height: '70'
  });

const ShowPreview = cond([
  [
    prop('imagePreview'),
    ({ imagePreview }) => (
      <div
        className="image-preview"
        style={{ backgroundImage: `url(${imagePreview}` }}
        alt="Preview"
      />
    )
  ],
  [
    prop('cloudinary_image_id'),
    ({ cloudinary_image_id }) => (
      <div
        className="image-preview"
        style={{ backgroundImage: `url(${getImage(cloudinary_image_id)}` }}
        alt="Preview"
      />
    )
  ],
  [
    T,
    always(
      <div className="image-preview image-preview-default">
        <span style={{ backgroundImage: `url(${DefaultPreview})` }} />
      </div>
    )
  ]
]);

export default ShowPreview;
