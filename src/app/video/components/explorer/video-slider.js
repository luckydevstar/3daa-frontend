import React, { Component } from 'react';
import Slider from 'react-slick';
import { equals, isEmpty, map, length } from 'ramda';
import classNames from 'classnames';
import VideoExplorerItem from './video-explorer-item';

class VideoSlider extends Component {
  render() {
    const {
      uiLoadingVideos,
      videos,
      selectedCategory,
      itemClass,
      toggleAddVideo,
      searchTerm,
      editVideo,
      deleteVideo,
      selectedSubCategory,
      isCategoryMenu
    } = this.props;

    var settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToScroll: isCategoryMenu ? 3 : 4,
      slidesToShow: isCategoryMenu ? 3 : 4,
      responsive: [
        {
          breakpoint: 1440,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }
      ]
    };

    return (
      <div
        className={classNames(
          'videos-wrapper videos-wrapper-slider is-marginless',
          {
            'videos-wrapper-with-row': selectedCategory
          }
        )}
      >
        {!selectedCategory ? (
          <Slider {...settings}>
            {map(
              video => (
                <VideoExplorerItem
                  {...{
                    key: video.media_id,
                    itemClass,
                    video,
                    selectedCategory,
                    selectedSubCategory,
                    editVideo,
                    deleteVideo
                  }}
                />
              ),
              videos
            )}
          </Slider>
        ) : (
          map(
            video => (
              <VideoExplorerItem
                {...{
                  key: video.media_id,
                  itemClass,
                  video,
                  selectedCategory,
                  selectedSubCategory,
                  editVideo,
                  deleteVideo
                }}
              />
            ),
            videos
          )
        )}
      </div>
    );
  }
}

export default VideoSlider;
