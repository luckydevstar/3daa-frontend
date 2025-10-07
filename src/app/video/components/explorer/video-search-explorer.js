import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  prop,
  isEmpty,
  map,
  length,
  pipe,
  propEq,
  equals,
  find,
  not
} from 'ramda';
import VideoAddCard from './video-add-card';
import VideoExplorerItem from './video-explorer-item';
import EmptyView from './videos-empty';
import common from 'app/common';

const UILoading = common.components.UILoading;

const compareVideosForStyle = (arr, id) => {
  const val = find(propEq('category_id', id))(arr);
  if (val.current < val.max) {
    return true;
  }
  return false;
};

const compareVideosByMaxLength = (arr, id) => {
  const val = find(propEq('category_id', id))(arr);
  if (val.max > 4) {
    return true;
  }
  return false;
};

class VideoSearchExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = { pageInfo: [] };
  }

  componentDidMount() {
    this.setPageInfo(this.props.videos);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setPageInfo(nextProps.videos);
  }

  setPageInfo(videos) {
    const pageInfo = [];
    if (videos.length > 0) {
      map(x => {
        pageInfo.push({
          category_id: x.video_category_id,
          current:
            pipe(
              prop('data'),
              length
            )(x) > 4
              ? 4
              : pipe(
                  prop('data'),
                  length
                )(x),
          max: pipe(
            prop('data'),
            length
          )(x)
        });
      })(videos);
    }
    this.setState({ pageInfo });
  }

  showMoreVideo(category_id) {
    const { pageInfo } = this.state;
    map(x => {
      if (equals(x.category_id, category_id)) {
        if (equals(x.current, x.max)) {
          x.current = 4;
        } else {
          x.current = x.max;
        }
      }
    })(pageInfo);
    this.setState({ pageInfo });
  }

  render() {
    const {
      uiLoadingVideos,
      videos,
      selectedCategory,
      itemClass,
      toggleAddVideo,
      searchTerm,
      editVideo,
      deleteVideo
    } = this.props;
    const { pageInfo } = this.state;

    const filteredVideos = [];
    if (not(isEmpty(pageInfo))) {
      map(x => {
        const info = find(propEq('category_id', x.video_category_id))(pageInfo);
        const val = {
          video_category_title: x.video_category_title,
          video_category_id: x.video_category_id,
          data: x.data.slice(0, info.current)
        };
        filteredVideos.push(val);
      })(videos);
    }

    if (!uiLoadingVideos && isEmpty(videos)) {
      return <EmptyView {...{ searchTerm, toggleAddVideo }} />;
    }

    return (
      <div className="video-explorer-container min-content-height-inner">
        <div className="container">
          {uiLoadingVideos ? (
            <UILoading />
          ) : (
            <div className="videos-wrapper">
              {editVideo && <VideoAddCard {...{ itemClass, toggleAddVideo }} />}
              {map(video => (
                <div className="video-contents" key={video.video_category_id}>
                  <div className="category-info">
                    <span className="info">{video.video_category_title}: </span>
                    {compareVideosByMaxLength(
                      pageInfo,
                      video.video_category_id
                    ) ? (
                      <span
                        className="more-button"
                        onClick={() =>
                          this.showMoreVideo(video.video_category_id)
                        }
                      >
                        {compareVideosForStyle(
                          pageInfo,
                          video.video_category_id
                        )
                          ? ' See more'
                          : ' See less'}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="videos-zone">
                    {map(item => (
                      <VideoExplorerItem
                        {...{
                          key: item.media_id,
                          itemClass,
                          video: item,
                          selectedCategory,
                          editVideo,
                          deleteVideo
                        }}
                      />
                    ))(video.data)}
                  </div>
                </div>
              ))(filteredVideos)}
            </div>
          )}
        </div>
      </div>
    );
  }
}

VideoSearchExplorer.defaultProps = {
  videos: [],
  uiLoadingVideos: false,
  itemClass: 'is-one-third'
};

VideoSearchExplorer.propTypes = {
  videos: PropTypes.array,
  uiLoadingVideos: PropTypes.bool,
  itemClass: PropTypes.string
};

export default VideoSearchExplorer;
