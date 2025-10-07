import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UploadMedia from './upload-media';
import AssetLibrary from './asset-library';
import EmbedVideo from './embed-video';
import CustomiseBlock from './customise-block';
import { path } from 'ramda';
import common from 'app/common';
import { Creators } from 'app/qualifications/actions';

const ContentModal = common.components.ContentModal;
const Navigation = common.components.Navigation;

class VideoInsertionModal extends Component {
  constructor(props) {
    super(props);
    this.tabs = ['Asset Library', 'New Upload', 'Embed', 'Customise'];
    this.elementsPerPage = 8;
    this.state = {
      currentPage: 0,
      currentVideo: null,
      params: {
        offset: 0,
        limit: this.elementsPerPage,
        search: null,
        type: 'video'
      }
    };
  }

  componentDidUpdate(nextProps) {
    if (
      nextProps.currentState &&
      nextProps.currentState.video &&
      this.state.currentVideo === null
    ) {
      this.setCurrentVideo(this.props.currentState.video);
    }
  }

  setCurrentVideo(video) {
    this.setState({ currentVideo: video }, () => {
      this.navigateToCustomise();
    });
  }

  open() {
    this.modal.open();
  }

  close() {
    const paramsCopy = this.state.params;

    paramsCopy.search = null;
    paramsCopy.offset = 0;
    this.setState({ params: paramsCopy, currentPage: 0 }, () => {
      this.modal.close();
    });
  }

  loadVideos() {
    this.props.getVideos(this.state.params);
  }

  resetModalState() {
    const params = {
      offset: 0,
      limit: this.elementsPerPage,
      search: null,
      type: 'video'
    };
    this.setState({ currentPage: 0, currentVideo: null, params });
  }

  handleModalOpen(isOpen) {
    if (isOpen) {
      this.loadVideos();
      if (this.state.currentVideo) {
        this.navigateToCustomise();
      }
    } else {
      this.resetModalState();
    }
  }

  reloadVideos() {
    this.props.getVideos(this.state.params);
  }

  insertSelectedVideo(videoId) {
    this.props.onInsert(videoId);
    this.close();
  }

  filterVideos(phrase) {
    const paramsCopy = this.state.params;

    paramsCopy.search = phrase;
    this.setState({ params: paramsCopy }, () => {
      this.reloadVideos();
    });
  }

  navigateToCustomise() {
    this.setState({ currentPage: 3 });
  }

  resetVideosFilter() {
    const paramsCopy = this.state.params;

    paramsCopy.offset = 0;
    paramsCopy.search = null;
    this.setState({ params: paramsCopy }, () => {
      this.reloadVideos();
    });
  }

  handleSearchKeyUp(e) {
    const phrase = e.target.value.trim().toLowerCase();

    if (e.key === 'Enter' || e.keyCode === 13) {
      this.filterVideos(phrase);
    }

    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
      e.target.value = '';
      this.resetVideosFilter();
    }
  }

  handleSearchChange(e) {
    const phrase = e.target.value;
    if (!phrase || phrase === '') {
      this.resetVideosFilter();
    }
  }

  handleTabChange(newTab) {
    const paramsCopy = this.state.params;

    if (paramsCopy.search !== null || paramsCopy.offset !== 0) {
      paramsCopy.search = null;
      paramsCopy.offset = null;
      this.setState({ currentPage: newTab, params: paramsCopy }, () => {
        this.reloadVideos();
      });
    }
    this.setState({ currentPage: newTab });
  }

  handleMediaDelete(media_id) {
    // TODO need some better handling for media delete
    this.props.deleteVideo(media_id);
    this.reloadVideos();
  }

  handlePaginationChange(newPage) {
    const newOffset = (newPage - 1) * this.elementsPerPage;
    const paramsCopy = this.state.params;

    paramsCopy.offset = newOffset;
    this.setState({ params: paramsCopy }, () => {
      this.reloadVideos();
    });
  }

  render() {
    let Subpage;

    const {
      videos,
      postVideo,
      attemptingPostVideo,
      video_max_size,
      recentlyUploaded,
      currentState,
      total,
      saveChanges
    } = this.props;

    const {
      currentPage,
      currentVideo,
      params: { search, type }
    } = this.state;

    switch (currentPage) {
      case 0:
        Subpage = (
          <AssetLibrary
            media={videos}
            mediaType={type}
            totalMedia={total}
            setCurrentMedia={videoID => this.setCurrentVideo(videoID)}
            close={() => this.close()}
            elementsPerPage={this.elementsPerPage}
            handleMediaDelete={media_id => this.handleMediaDelete(media_id)}
            handlePaginationChange={newPage =>
              this.handlePaginationChange(newPage)
            }
            search={search}
          />
        );
        break;
      case 1:
        Subpage = (
          <UploadMedia
            file_max_size={video_max_size}
            fileType={type}
            uploadMedia={postVideo}
            attempting={attemptingPostVideo}
            recentlyUploaded={recentlyUploaded}
            close={() => this.close()}
            setCurrentMedia={videoID => this.setCurrentVideo(videoID)}
          />
        );
        break;
      case 2:
        Subpage = (
          <EmbedVideo
            close={() => this.close()}
            currentVideo={currentVideo}
            setCurrentMedia={videoID => this.setCurrentVideo(videoID)}
          />
        );
        break;
      case 3:
        Subpage = (
          <CustomiseBlock
            mediaType="video"
            currentMedia={currentVideo}
            currentColor={currentState.color || null}
            currentTitle={currentState.title || null}
            currentDescription={currentState.description || null}
            close={() => this.close()}
            saveChanges={saveChanges}
          />
        );
        break;
      default:
        Subpage = null;
    }

    return (
      <ContentModal
        ref={e => {
          this.modal = e;
        }}
        onStateChange={isOpen => this.handleModalOpen(isOpen)}
      >
        <div className="workbooks-media-insertion-modal">
          <div className="workbooks-media-insertion-modal-header">
            <h1 className="title">Insert Video</h1>
            <Navigation
              tabs={this.tabs}
              activeTab={currentPage}
              callback={e => this.handleTabChange(e)}
            >
              {!currentPage && (
                <ul className="is-right">
                  <p className="control search">
                    <input
                      onChange={e => {
                        this.handleSearchChange(e);
                      }}
                      onKeyUp={e => {
                        this.handleSearchKeyUp(e);
                      }}
                      className="input"
                      type="text"
                      placeholder="Search asset library"
                    />
                  </p>
                </ul>
              )}
            </Navigation>
          </div>

          {Subpage}
        </div>
      </ContentModal>
    );
  }
}

VideoInsertionModal.propTypes = {
  onInsert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  videos: path(['qualifications', 'media', 'videos'])(state),
  total: path(['qualifications', 'media', 'total'])(state),
  video_max_size: path(['config', 'config', 'video', 'max_file_size'])(state),
  attemptingPostVideo: path([
    'qualifications',
    'media',
    'attemptingPostWorkbookMedia'
  ])(state),
  recentlyUploaded: path(['qualifications', 'media', 'recentlyUploaded'])(state)
});

const mapDispatchToProps = dispatch => ({
  getVideos: params => dispatch(Creators.getWorkbookMediaAttempt(params)),
  postVideo: data => dispatch(Creators.postWorkbookMediaAttempt(data)),
  deleteVideo: media_id =>
    dispatch(Creators.deleteWorkbookMediaAttempt(media_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    withRef: true
  }
)(VideoInsertionModal);
