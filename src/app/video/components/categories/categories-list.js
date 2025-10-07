import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { createCloudinaryUrl } from 'app/common/util/helpers';
import common from 'app/common';
import { Text } from 'app/intl';

const UILoading = common.components.UILoading;

const getImage = img =>
  `url(${createCloudinaryUrl(img, 'image', {
    width: '400',
    height: '200',
    crop: 'fill',
    effect: 'brightness:-20'
  })})`;

const Item = ({
  selectedSubCategory,
  onCategoryChange,
  onCategoryEdit,
  onCategoryDelete
}) => ({ video_category_id, description, title, cloudinary_image_id }) => (
  <div
    key={video_category_id}
    className={cx('list-item', {
      active: selectedSubCategory === video_category_id
    })}
    onClick={() => onCategoryChange(video_category_id)}
  >
    <div
      className="cover"
      style={{ backgroundImage: getImage(cloudinary_image_id) }}
    >
      <div className="inner">
        <h4 className="opensans-semibold">{title}</h4>
        <p>{description}</p>
      </div>
      <div className="actions">
        <a onClick={() => onCategoryEdit(video_category_id)}>
          <Text iKey="edit" />
        </a>
        <a onClick={() => onCategoryDelete(video_category_id)}>
          <Text iKey="delete" />
        </a>
      </div>
    </div>
  </div>
);

const VideoCategoriesList = ({
  selectedSubCategory,
  categories,
  onCategoryChange,
  onCategoryEdit,
  toggleAddCategory,
  onCategoryDelete,
  uiLoadingCategories
}) => (
  <div
    className={cx('video-categories-list container', {
      'is-loading': uiLoadingCategories
    })}
  >
    <button className="add-category-btn m-b-10" onClick={toggleAddCategory}>
      <Text iKey="Add Sub-Category" />{' '}
      <i className="fa fa-plus-circle" aria-hidden="true" />
    </button>
    {uiLoadingCategories ? (
      <UILoading minHeight="200px" marginTop="100px" />
    ) : (
      <div className="video-categories-list-items">
        {categories.map(
          Item({
            onCategoryChange,
            onCategoryEdit,
            onCategoryDelete,
            selectedSubCategory
          })
        )}
      </div>
    )}
  </div>
);

VideoCategoriesList.defaultProps = {
  categories: []
};

VideoCategoriesList.propTypes = {
  onCategoryChange: PropTypes.func.isRequired,
  onCategoryDelete: PropTypes.func.isRequired,
  categories: PropTypes.array,
  selectedSubCategory: PropTypes.number
};

export default VideoCategoriesList;
