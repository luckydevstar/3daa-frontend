import React from 'react';
import { connect } from 'react-redux';
import { or, propEq, propOr, find, equals, not, isEmpty } from 'ramda';
import { VideoPlayer, VideoExplorer, VideoNotFound } from '../components';
import { Creators } from '../actions';
import common from 'app/common';
import { filterVideosExceptOwn } from '../util/selectors';

const {
  util: {
    helpers: { deepMerge }
  },
  components: { Footer }
} = common;

class VideosPlayerRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVideo: null,
      setView: false,
      intervalId: 0
    };
    this.toggleCurrentVideoLike = this.toggleCurrentVideoLike.bind(this);
    this.setViewVideo = this.setViewVideo.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      params: { video_id },
      videos,
      params,
      getVideos,
      selectedCategory
    } = this.props;

    if (
      or(
        isEmpty(videos),
        not(equals(parseInt(params.category_id), parseInt(selectedCategory)))
      )
    ) {
      getVideos(params.category_id);
    } else {
      this.setState({
        currentVideo: this.retrieveCurrentVideo(videos, video_id)
      });
    }
  }

  componentDidMount() {
    this.scrollToTheTop();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.state.currentVideo && nextProps.videos.length) {
      this.setState({
        currentVideo: this.retrieveCurrentVideo(
          nextProps.videos,
          this.props.params.video_id
        )
      });
    }
    if (this.props.params.video_id !== nextProps.params.video_id) {
      this.setState({
        setView: false,
        currentVideo: this.retrieveCurrentVideo(
          this.props.videos,
          nextProps.params.video_id
        )
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.video_id !== prevProps.params.video_id) {
      this.scrollToTheTop();
    }
  }

  scrollToTheTop() {
    this.mainNode.parentNode.scrollTop = 0;
  }

  retrieveCurrentVideo(videos, video_id) {
    const video = { ...find(propEq('media_id', parseInt(video_id)), videos) };
    video.liked -= video.member_actions.liked;
    return video;
  }

  setViewVideo() {
    const {
      currentVideo: {
        media_id,
        member_actions: { viewed }
      },
      setView
    } = this.state;

    if (!viewed && !setView) {
      this.setState({
        setView: true
      });
      this.props.viewVideo(media_id);
    }
  }

  toggleCurrentVideoLike() {
    const {
      currentVideo,
      currentVideo: {
        media_id,
        member_actions: { liked }
      }
    } = this.state;

    // Set opposite liked state in this.state
    this.setState({
      currentVideo: deepMerge(currentVideo, {
        member_actions: {
          liked: liked ? 0 : 1
        }
      })
    });

    // Make appropriate request to the api
    // to mirror the changes
    if (liked) {
      this.props.unlikeVideo(media_id);
    } else {
      this.props.likeVideo(media_id);
    }
  }

  render() {
    const { currentVideo } = this.state;
    const { videos, loadingVideos, params } = this.props;
    const { toggleCurrentVideoLike } = this;
    const categoryId = params.category_id;
    const mediaId = propOr(0, 'media_id', currentVideo);

    return (
      <div
        className="video-player-container"
        ref={e => {
          this.mainNode = e;
        }}
      >
        {typeof currentVideo !== 'undefined' ? (
          <div className="wrapper">
            <VideoPlayer
              showInfo
              video={currentVideo}
              toggleCurrentVideoLike={toggleCurrentVideoLike}
              memberActions={currentVideo && currentVideo.member_actions}
              setViewVideo={this.setViewVideo}
            />
            <VideoExplorer
              videos={filterVideosExceptOwn(videos, categoryId, mediaId)}
              uiLoadingVideos={loadingVideos}
              itemClass="is-3-widescreen is-4-desktop is-6-tablet"
            />
          </div>
        ) : (
          <VideoNotFound />
        )}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.loginData.token,
    videos: state.video.videos,
    selectedCategory: state.video.selectedCategory,
    attemptingToRetrieveVideoInfo: state.video.attemptingToRetrieveVideoInfo,
    loadingVideos: state.video.uiLoadingVideos
  };
};

const mapDispatchToProps = dispatch => {
  return {
    likeVideo: videoId => {
      dispatch(Creators.likeVideo(videoId));
    },
    unlikeVideo: videoId => {
      dispatch(Creators.unlikeVideo(videoId));
    },
    viewVideo: videoId => {
      dispatch(Creators.viewVideo(videoId));
    },
    attemptToLoadVideoInfo: (videoId, videos) => {
      dispatch(Creators.videoLoadAttempt(videoId, videos));
    },
    getVideos: categoryId => {
      dispatch(Creators.getVideosAttempt(parseInt(categoryId)));
    },
    getMyVideos: query => {
      dispatch(Creators.getMyVideosAttempt(query));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideosPlayerRoute);
