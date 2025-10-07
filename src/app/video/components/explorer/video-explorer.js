import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { equals, isEmpty, not, map, length } from 'ramda';
import common from 'app/common';
import VideoAddCard from './video-add-card';
import VideoExplorerItem from './video-explorer-item';
import EmptyView from './videos-empty';

const {
  components: { Pagination, UILoading, ContentModalConfirm }
} = common;

const ids = arr => map(({ media_id }) => media_id, arr);

class VideoExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      deleteVideoData: {
        video_category_id: null,
        media_id: null
      }
    };
    this.confirmModal = null;

    this.toggleVideoDeleteModal = this.toggleVideoDeleteModal.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.videos &&
      this.props.videos &&
      !equals(ids(nextProps.videos), ids(this.props.videos))
    ) {
      this.setState({ currentPage: 1 });
    }
  }

  goToPage(page) {
    this.setState({ currentPage: page });
  }

  toggleVideoDeleteModal(video_category_id, media_id) {
    this.setState(
      {
        deleteVideoData: {
          video_category_id,
          media_id
        }
      },
      () => {
        this.confirmModal.open();
      }
    );
  }

  deleteVideo() {
    const { deleteVideo } = this.props;
    const { deleteVideoData } = this.state;
    if (deleteVideoData.video_category_id && deleteVideoData.media_id) {
      deleteVideo(deleteVideoData.video_category_id, deleteVideoData.media_id);
    }
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
      deleteVideo,
      selectedSubCategory
    } = this.props;
    const { currentPage } = this.state;

    const itemsPerPage = 8;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const videosPage = videos.slice(start, end);

    if (!uiLoadingVideos && isEmpty(videos)) {
      return (
        <EmptyView {...{ searchTerm, toggleAddVideo, selectedSubCategory }} />
      );
    }

    return (
      <div className="video-explorer-container min-content-height-inner">
        <div className="container">
          {uiLoadingVideos ? (
            <UILoading marginTop="120px" />
          ) : (
            <div className="videos-wrapper columns is-multiline is-marginless">
              {editVideo && selectedSubCategory > 0 && (
                <VideoAddCard {...{ itemClass, toggleAddVideo }} />
              )}
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
                      deleteVideo,
                      toggleVideoDeleteModal: this.toggleVideoDeleteModal
                    }}
                  />
                ),
                videosPage
              )}
            </div>
          )}
          {length(videos) > itemsPerPage && (
            <Pagination
              {...{
                itemsLength: videos.length,
                itemsPerPage,
                forcePage: currentPage - 1 || 0,
                maxPagesDisplayed: 3,
                onPageChange: page => this.goToPage(page)
              }}
            />
          )}
          <ContentModalConfirm
            callback={this.deleteVideo}
            ref={e => {
              this.confirmModal = e;
            }}
          >
            <p>Are you sure you want to delete video?</p>
          </ContentModalConfirm>
        </div>
      </div>
    );
  }
}

VideoExplorer.defaultProps = {
  videos: [],
  uiLoadingVideos: false,
  itemClass: 'is-one-third'
};

VideoExplorer.propTypes = {
  videos: PropTypes.array,
  uiLoadingVideos: PropTypes.bool,
  itemClass: PropTypes.string
};

export default VideoExplorer;
