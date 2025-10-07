import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  pickAll,
  path,
  equals,
  trim,
  filter,
  find,
  propEq,
  toString,
  map,
  isEmpty
} from 'ramda';
import cx from 'classnames';
import { Creators } from '../actions';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { noop } from 'app/common/util/helpers';
import { filterVideos, filterCarouselVideos } from '../util/selectors';
import {
  VideoNavigation,
  VideoCarousel,
  VideoExplorer,
  VideoSearchExplorer,
  VideoLeftMenu,
  VideoSlider,
  EmptyView
} from '../components';

const { Footer, UILoading, UIExplorerNav } = common.components;
const { SuperAdmin, CentreAdmin } = Roles;

const { extractUserRole, excerpt } = common.util.helpers;

class VideosNewRoute extends Component {
  UNSAFE_componentWillMount() {
    if (this.props.selectedSector === 0) {
      this.props.selectSector(this.props.sectorId);
      this.props.setSelectedHeader(this.props.currentSector.image);
    }

    this.props.selectCategory(0);

    const userRole = extractUserRole(this.props.user);
    if (userRole === SuperAdmin || userRole === CentreAdmin) {
      this.props.getAllCategories();
    } else {
      this.props.getCategories();
    }
  }

  render() {
    const {
      currentSector,
      categories,
      carouselVideos,
      videos,
      uiLoadingVideos,
      searchTerm,
      selectedCategory,
      onSearch,
      routes,
      lang,
      isCategoryMenu,
      toggleCategoryMenu,
      selectedHeader,
      selectedSector
    } = this.props;

    let tobelistedCategories = [];
    if (selectedSector > 0 && selectedCategory === 0 && categories) {
      tobelistedCategories = filter(
        category => category.abstract_sector_id === selectedSector
      )(categories);
    } else if (selectedCategory > 0 && categories) {
      tobelistedCategories = find(
        propEq('video_category_id', selectedCategory)
      )(categories).subcategories.asMutable();
    }

    return (
      <div className="videos-new-container videos-container videos-route">
        {categories && (
          <VideoNavigation
            {...{
              currentSector,
              categories,
              selectedCategory,
              searchTerm,
              onSearch,
              uiLoadingVideos,
              routes,
              lang,
              selectedHeader,
              toggleLeftMenu: () => toggleCategoryMenu()
            }}
          />
        )}
        {equals(trim(searchTerm), '') ? (
          <div className="video-main-container">
            <UIExplorerNav navTop={125}>
              <div
                className={cx('video-left', { 'is-left-menu': isCategoryMenu })}
              >
                <VideoLeftMenu
                  {...{
                    toggleLeftMenu: () => toggleCategoryMenu()
                  }}
                />
              </div>
            </UIExplorerNav>
            <div
              className={cx('video-right', {
                'is-not-left-menu': !isCategoryMenu
              })}
            >
              {carouselVideos && carouselVideos.length > 0 && (
                <VideoCarousel videos={carouselVideos} />
              )}
              <div className="video-content-container">
                <div className="container">
                  <div className="video-sub-categories">
                    {tobelistedCategories &&
                      map(video => (
                        <div
                          className="sub-category-card"
                          key={`sub-category-card-${video.video_category_id}`}
                        >
                          <div className="title">
                            {video.video_category_title}
                          </div>
                          <div className="desc">
                            {excerpt(
                              toString(video.video_category_description),
                              125
                            )}
                          </div>
                        </div>
                      ))(videos)}
                  </div>
                  <div className="video-content content-section p-l-0">
                    <div className="video-explorer-container p-b-0">
                      {!uiLoadingVideos && isEmpty(videos) && (
                        <EmptyView {...{ searchTerm }} />
                      )}

                      {uiLoadingVideos ? (
                        <UILoading marginTop="120px" />
                      ) : (
                        map(video => (
                          <div
                            key={`video-slider-${video.video_category_id}`}
                            className="video-slider-item is-centered"
                          >
                            <VideoSlider
                              {...{
                                uiLoadingVideos,
                                onVideoClick: noop,
                                videos: video.data,
                                selectedCategory,
                                searchTerm,
                                isCategoryMenu,
                                itemClass: ''
                              }}
                            />
                          </div>
                        ))(videos)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ persisted, video, profile: { user } }) => {
  const picked = pickAll(
    [
      'categories',
      'uiLoadingCategories',
      'uiLoadingVideos',
      'searchTerm',
      'selectedCategory',
      'selectedSector',
      'isCategoryMenu',
      'selectedHeader'
    ],
    video
  );
  return {
    currentSector: path(['sector'])(persisted),
    sectorId: path(['sector', 'sector_id'])(persisted),
    lang: persisted.lang,
    ...picked,
    carouselVideos: filterCarouselVideos(video),
    videos: filterVideos(video),
    user
  };
};

const mapDispatchToProps = dispatch => ({
  getCategories: () => dispatch(Creators.getCategoriesAttempt()),
  getAllCategories: () => dispatch(Creators.getAllCategoriesAttempt()),
  onSearch: query => dispatch(Creators.filterVideos(query)),
  selectCategory: categoryId => dispatch(Creators.selectCategory(categoryId)),
  selectSector: sectorId => dispatch(Creators.selectSector(sectorId)),
  setSelectedHeader: data => dispatch(Creators.setSelectedHeader(data)),
  toggleCategoryMenu: () => dispatch(Creators.toggleCategoryMenu())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideosNewRoute);
