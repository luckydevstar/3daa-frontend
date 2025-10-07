import React from 'react';
import PropTypes from 'prop-types';
import {
  pipe,
  equals,
  findIndex,
  propEq,
  curry,
  map,
  inc,
  dec,
  contains
} from 'ramda';
import { createCloudinaryUrl } from 'app/common/util/helpers';
import cx from 'classnames';
import { warn } from 'app/common/util/logger';

const isNextToActive = curry((selectedIndex, currentIndex) =>
  pipe(map(fn => fn(currentIndex)), contains(selectedIndex))([inc, dec])
);

// Get the category index in list of categories
const getItemIndex = curry((categories, id) =>
  findIndex(propEq('video_category_id', id), categories)
);

const VideoCarouselItem = ({
  video_category_id,
  selectedCategory,
  categories,
  title,
  description,
  imageId,
  onCategoryChange
}) => {
  const getItemInCategories = getItemIndex(categories);
  const currentIndex = getItemInCategories(video_category_id);
  const selectedIndex = getItemInCategories(selectedCategory);
  const active = equals(currentIndex, selectedIndex);
  const isNext = pipe(dec, equals(selectedIndex))(currentIndex);
  const isPrevious = pipe(inc, equals(selectedIndex))(currentIndex);

  let className = '';

  if (active) {
    if (isNext && isPrevious) {
      className = 'active-small';
    } else if (!isNext && !isPrevious) {
      className = 'active-large';
    } else {
      className = 'active-medium';
    }
  } else if (isNext || isPrevious) {
    className = 'ready';
  }

  return (
    <div
      className={`carousel-item ${className}`}
      style={{
        backgroundImage: `url(${createCloudinaryUrl(imageId, 'image', {
          width: '1200',
          height: '400',
          crop: 'fill',
          effect: 'brightness:-20'
        })})`
      }}
    >
      <div
        className="overlay"
        style={{
          backgroundColor:
            !active && isNextToActive(selectedIndex, currentIndex)
              ? 'rgba(255, 255, 255, .4)'
              : 'rgba(255, 255, 255, 0)'
        }}
      >
        <div
          style={{ opacity: active ? '1' : '0' }}
          className={`title${!active ? '-small' : ''}`}
        >
          {title}
        </div>

        {active &&
          <div style={{ opacity: '1' }} className="description">
            {description}
          </div>}

        {!active &&
          isNextToActive(selectedIndex, currentIndex) &&
          <div className="actions">
            <div
              onClick={() => onCategoryChange(video_category_id)}
              className={cx(
                'button-navigation',
                { 'button-navigation-previous': isPrevious },
                { 'button-navigation-next': isNext }
              )}
              style={{ opacity: '.7' }}
            />
          </div>}
      </div>
    </div>
  );
};

VideoCarouselItem.defaultProps = {
  onCategoryChange: () => {
    warn("You didn't pass onCategoryChange prop");
  },
  selectedCategory: 0,
  categories: [],
  title: 'Default title',
  description: 'Default description',
  imageId: 'hevn5wtyav7rp99ds52g' // FIXME: TODO: Temporary image
};

VideoCarouselItem.propTypes = {
  onCategoryChange: PropTypes.func,
  selectedCategory: PropTypes.number,
  title: PropTypes.string,
  categories: PropTypes.array,
  description: PropTypes.string,
  imageId: PropTypes.string
};

export default VideoCarouselItem;
