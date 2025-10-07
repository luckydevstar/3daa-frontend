import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { equals, isEmpty, map, length } from 'ramda';
import common from 'app/common';
import CategoriesAddCard from './categories-add-card';
import CategoryCardItem from './category-card-item';
import VideoCategoriesEmpty from './categories-empty';

const {
  components: { UILoading }
} = common;

class CategoryCardList extends Component {
  render() {
    const {
      categories,
      uiLoadingCategories,
      itemClass,
      toggleAddCategory,
      editCategory,
      deleteCategory,
      onCategoryChange
    } = this.props;

    return (
      <div className="video-explorer-container min-content-height-inner p-t-0">
        <div className="container">
          {categories && categories.length > 0 ? (
            <div>
              {uiLoadingCategories ? (
                <UILoading marginTop="120px" />
              ) : (
                <div className="videos-wrapper columns is-multiline is-marginless">
                  {editCategory && (
                    <CategoriesAddCard {...{ itemClass, toggleAddCategory }} />
                  )}
                  {map(
                    category => (
                      <CategoryCardItem
                        {...{
                          key: `category-list-${category.video_category_id}`,
                          itemClass,
                          category,
                          editCategory,
                          deleteCategory,
                          onCategoryChange
                        }}
                      />
                    ),
                    categories
                  )}
                </div>
              )}
            </div>
          ) : (
            <VideoCategoriesEmpty {...{ toggleAddCategory }} />
          )}
        </div>
      </div>
    );
  }
}

CategoryCardList.defaultProps = {
  categories: [],
  uiLoadingCategories: false,
  itemClass: 'is-one-third'
};

CategoryCardList.propTypes = {
  categories: PropTypes.array,
  uiLoadingCategories: PropTypes.bool,
  itemClass: PropTypes.string
};

export default CategoryCardList;
