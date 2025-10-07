import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MediaVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false
    };
    this.playVideo = this.playVideo.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.videoBlockClick = this.videoBlockClick.bind(this);
    this.video = null;
  }
  playVideo() {
    this.setState(
      {
        isPlaying: true
      },
      () => {
        this.video.play();
      }
    );
  }
  pauseVideo() {
    this.setState(
      {
        isPlaying: false
      },
      () => {
        this.video.pause();
      }
    );
  }
  videoBlockClick() {
    const { isPlaying } = this.state;
    if (isPlaying) this.pauseVideo();
    else this.playVideo();
  }
  render() {
    const { url, style, attributes, containerAttributes } = this.props;
    const { isPlaying } = this.state;
    const isEmbed =
      url.indexOf('vimeo') !== -1 || url.indexOf('youtube') !== -1;
    if (isEmbed) {
      return (
        <iframe src={url} frameBorder="0" allowFullScreen {...attributes} />
      );
    } else {
      return (
        <div
          className="media-video"
          onClick={this.videoBlockClick}
          {...containerAttributes}
        >
          {!isPlaying && (
            <div className="media-video__play">
              <i className="fa fa-play" />
            </div>
          )}

          <video
            loop
            {...{ style, ...attributes, ref: node => (this.video = node) }}
          >
            <source src={url} type="video/mp4" />
          </video>
        </div>
      );
    }
  }
}

MediaVideo.defaultProps = {
  style: {},
  attributes: {},
  containerAttributes: {}
};

MediaVideo.propTypes = {
  url: PropTypes.string.isRequired,
  style: PropTypes.object,
  attributes: PropTypes.object,
  containerAttributes: PropTypes.object
};

export default MediaVideo;
