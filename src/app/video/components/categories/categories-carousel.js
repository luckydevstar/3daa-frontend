import React from 'react';
import PropTypes from 'prop-types';
import { length, isEmpty, not, and, toString } from 'ramda';
import Item from './categories-carousel-item';
import EmptyView from './categories-empty';

const VideoCategoriesCarousel = ({
  uiLoadingCategories,
  categories,
  onCategoryChange,
  selectedCategory,
  toggleAddCategory
}) => {
  if (and(not(uiLoadingCategories), isEmpty(categories))) {
    return <EmptyView {...{ toggleAddCategory }} />;
  }

  return (
    <div className="video-categories-carousel">
      {categories.map(
        ({ video_category_id, title, description, cloudinary_image_id }) =>
          <Item
            {...{
              key: video_category_id,
              video_category_id,
              imageId: cloudinary_image_id,
              categories,
              onCategoryChange,
              selectedCategory,
              title: toString(title),
              description: toString(description),
              categoriesLength: length(categories)
            }}
          />
      )}
    </div>
  );
};

VideoCategoriesCarousel.defaultProps = {
  categories: []
};

VideoCategoriesCarousel.propTypes = {
  onCategoryChange: PropTypes.func.isRequired,
  categories: PropTypes.array,
  selectedCategory: PropTypes.number.isRequired
};

export default VideoCategoriesCarousel;
