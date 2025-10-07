import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pickAll, path } from 'ramda';
import cx from 'classnames';
import { VideoExplorer, VideoNavigation, VideoLeftMenu } from '../components';
import { Creators } from '../actions';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { noop } from 'app/common/util/helpers';
import { filterLikedVideos } from '../util/selectors';

const { Footer, UIExplorerNav } = common.components;

const { SuperAdmin, CentreAdmin } = Roles;

const helpers = common.util.helpers;
const extractUserRole = helpers.extractUserRole;

class VideosFavouritesRoute extends Component {
  UNSAFE_componentWillMount() {
    if (this.props.selectedSector === 0) {
      this.props.selectSector(this.props.sectorId);
      this.props.setSelectedHeader(this.props.currentSector.image);
      this.props.selectCategory(0);
    }

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
      videos,
      uiLoadingVideos,
      searchTerm,
      selectedCategory,
      onSearch,
      routes,
      lang,
      isCategoryMenu,
      toggleCategoryMenu,
      selectedHeader
    } = this.props;

    return (
      <div className="videos-new-container videos-container videos-route">
        <div className="min-content-height">
          <VideoNavigation
            {...{
              currentSector,
              searchTerm,
              onSearch,
              uiLoadingVideos,
              routes,
              lang,
              selectedHeader,
              toggleLeftMenu: () => toggleCategoryMenu()
            }}
          />
          <div className="video-main-container">
            <UIExplorerNav navTop={-74}>
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
              <div className="favourite-video-container">
                <div className="video-content content-section container">
                  <VideoExplorer
                    {...{
                      uiLoadingVideos,
                      onVideoClick: noop,
                      videos,
                      selectedCategory,
                      searchTerm,
                      itemClass: isCategoryMenu
                        ? 'is-3-widescreen is-4-desktop is-6-tablet'
                        : 'is-3-widescreen is-3-desktop is-6-tablet'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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
    videos: filterLikedVideos(video),
    user
  };
};

const mapDispatchToProps = dispatch => ({
  getCategories: () => dispatch(Creators.getCategoriesAttempt()),
  getAllCategories: () => dispatch(Creators.getAllCategoriesAttempt()),
  selectSector: sectorId => dispatch(Creators.selectSector(sectorId)),
  selectCategory: categoryId => dispatch(Creators.selectCategory(categoryId)),
  onSearch: query => dispatch(Creators.filterVideos(query)),
  toggleCategoryMenu: () => dispatch(Creators.toggleCategoryMenu()),
  setSelectedHeader: data => dispatch(Creators.setSelectedHeader(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideosFavouritesRoute);
