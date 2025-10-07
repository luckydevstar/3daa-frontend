import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import common from 'app/common';
import {
  cond,
  propEq,
  isEmpty,
  head,
  pipe,
  prop,
  toString,
  filter,
  indexOf,
  always,
  T
} from 'ramda';

import { Text } from 'app/intl';

const { createCloudinaryUrl, excerpt } = common.util.helpers;

const CategoryCardItem = ({
  category: { video_category_id, cloudinary_image_id, title, description },
  editCategory,
  deleteCategory,
  onCategoryChange,
  itemClass = 'is-one-quarter'
}) => {
  return (
    <div
      className={cx('video column', itemClass)}
      onClick={() => onCategoryChange(video_category_id)}
    >
      <div
        className="hover-capture"
        style={{
          backgroundImage: `url(${createCloudinaryUrl(
            cloudinary_image_id,
            'image',
            { width: 300, height: 300, crop: 'fill', gravity: 'center' }
          )})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundColor: '#d5eae4'
        }}
      >
        <div className="title">
          <div className="name">{title}</div>
        </div>
        <div className="info">
          <div className="description">
            {excerpt(toString(description), 125)}
            {editCategory ? (
              <div className="video-edit-actions">
                <a
                  className="edit"
                  onClick={e => {
                    e.stopPropagation();
                    editCategory(video_category_id);
                  }}
                >
                  <i className="fa fa-pencil" />
                  <Text iKey="edit" />
                </a>
                <a
                  className="del is-text-danger"
                  onClick={e => {
                    e.stopPropagation();
                    deleteCategory(video_category_id);
                  }}
                >
                  <i className="fa fa-trash is-text-danger" />
                  <Text iKey="delete" />
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

CategoryCardItem.propTypes = {
  category: PropTypes.object.isRequired
};

export default CategoryCardItem;
