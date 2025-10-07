import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pickAll, isEmpty, equals, trim, path } from 'ramda';
import {
  VideoExplorer,
  VideoSearchExplorer,
  VideoCategoriesCarousel,
  VideoNavigation,
  CategoriesEmptyNoAction
} from '../components';
import { Creators } from '../actions';
import common from 'app/common';
import { noop } from 'app/common/util/helpers';
import { filterVideos } from '../util/selectors';

const { Footer } = common.components;

class VideosRoute extends Component {
  UNSAFE_componentWillMount() {
    this.props.getCategories();
  }

  render() {
    const {
      currentSectorTitle,
      videos,
      categories,
      selectedCategory,
      selectCategory,
      uiLoadingVideos,
      uiLoadingCategories,
      searchTerm,
      onSearch,
      routes,
      lang
    } = this.props;

    return (
      <div className="videos-container videos-route">
        <div className="min-content-height">
          <VideoNavigation
            {...{
              currentSectorTitle,
              categories,
              selectedCategory,
              searchTerm,
              onSearch,
              uiLoadingVideos,
              routes,
              lang
            }}
          />
          {categories && !isEmpty(categories) ? (
            <div>
              {equals(trim(searchTerm), '') ? (
                <div>
                  <VideoCategoriesCarousel
                    {...{
                      uiLoadingCategories,
                      categories,
                      onCategoryChange: selectCategory,
                      selectedCategory
                    }}
                  />
                  <VideoExplorer
                    {...{
                      uiLoadingVideos,
                      onVideoClick: noop,
                      videos,
                      selectedCategory,
                      searchTerm,
                      itemClass: 'is-3-widescreen is-4-desktop is-6-tablet'
                    }}
                  />
                </div>
              ) : (
                <VideoSearchExplorer
                  {...{
                    uiLoadingVideos,
                    onVideoClick: noop,
                    videos,
                    selectedCategory,
                    searchTerm,
                    itemClass: 'is-3-widescreen is-4-desktop is-6-tablet'
                  }}
                />
              )}
            </div>
          ) : (
            <CategoriesEmptyNoAction {...{ uiLoadingCategories }} />
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ persisted, video }) => {
  const picked = pickAll(
    [
      'categories',
      'uiLoadingCategories',
      'uiLoadingVideos',
      'searchTerm',
      'selectedCategory'
    ],
    video
  );
  return {
    currentSectorTitle: path(['sector', 'title'])(persisted),
    lang: persisted.lang,
    ...picked,
    videos: filterVideos(video)
  };
};

const mapDispatchToProps = dispatch => ({
  getCategories: () => dispatch(Creators.getCategoriesAttempt()),
  onSearch: query => dispatch(Creators.filterVideos(query)),
  selectCategory: categoryId => dispatch(Creators.selectCategory(categoryId))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideosRoute);
