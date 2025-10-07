import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from './header';
import VideoNew from '../videos/video-new';
import { findIndex, propEq, pickAll, path, find } from 'ramda';
import { navTabs } from '../../config/navs';
import common from 'app/common';
import Isvg from 'react-inlinesvg';

import IconHamburger from 'images/icon-hamburger.svg';

import { _tf } from 'app/intl';

const {
  components: { UINavigation, UIExplorerNav }
} = common;

const noop = () => {};

class VideoNavigation extends Component {
  getActiveSection() {
    const { routes } = this.props;
    const activeSection =
      routes[findIndex(propEq('path', '/videos/'))(routes) + 1].path;
    const filtered = navTabs.filter(
      tab => tab.url === `/video${activeSection}`
    );
    return filtered[0];
  }

  render() {
    const {
      currentSector,
      categories,
      selectedCategory,
      addingVideo,
      onSearch,
      searchTerm,
      toggleAddVideo,
      createVideo,
      uiLoadingVideos,
      routes,
      lang,
      toggleLeftMenu,
      selectedHeader,
      selectedSector,
      sectors
    } = this.props;

    let headerProps;

    if (currentSector) {
      headerProps = {
        subtitle: _tf('watch_and_learn_about', [currentSector.title], lang)
      };
    }

    const activeRoute = routes[routes.length - 1].path;
    const activeTab = navTabs.filter(
      tab => tab.url.substr(1) === activeRoute
    )[0];

    let sectorName = '';
    if (selectedSector && sectors) {
      sectorName = find(propEq('sector_id', selectedSector))(sectors).title;
    }

    return (
      <div>
        <Header
          {...{ toggleAddVideo, selectedHeader, sectorName, ...headerProps }}
        />
        <UIExplorerNav>
          <section className="content-section navigation-section">
            <div className="video-navigation">
              <div className="hamburger is-centered" onClick={toggleLeftMenu}>
                <Isvg className="small" src={IconHamburger} />
              </div>
              <div className="navigation">
                <UINavigation
                  active={activeTab && activeTab.key}
                  tabs={navTabs}
                  onSearch={value => {
                    onSearch(value);
                  }}
                  searchValue={searchTerm}
                  searchPlaceholder="search_videos"
                />
              </div>
            </div>
          </section>
        </UIExplorerNav>
        <VideoNew
          {...{
            categories,
            selectedCategory,
            addingVideo,
            toggleAddVideo,
            createVideo,
            uiLoadingVideos
          }}
        />
      </div>
    );
  }
}

VideoNavigation.propTypes = {
  categories: PropTypes.array,
  selectedCategory: PropTypes.number,
  addingVideo: PropTypes.bool,
  onSearch: PropTypes.func,
  createVideo: PropTypes.func,
  uiLoadingVideos: PropTypes.bool,
  routes: PropTypes.array.isRequired,
  toggleLeftMenu: PropTypes.func
};

VideoNavigation.defaultProps = {
  categories: [],
  selectedCategory: 0,
  addingVideo: false,
  onSearch: noop,
  createVideo: noop,
  uiLoadingVideos: false,
  toggleLeftMenu: noop
};

const mapStateToProps = ({ video, profile: { user } }) => {
  const picked = pickAll(['selectedSector'], video);
  return {
    ...picked,
    sectors: path(['sectors'])(user),
    user
  };
};

export default connect(mapStateToProps, null)(VideoNavigation);
