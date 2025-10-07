import React from 'react';
import { browserHistory } from 'react-router';

class VideoNotFound extends React.Component {
  handleClick() {
    browserHistory.push('/videos/');
  }

  render() {
    return (
      <div className="video-not-found">
        <div className="video-not-found-icon" />
        <div className="video-not-found-title">Video no longer available</div>
        <div className="video-not-found-subtitle">
          Sorry we cannot show you this video. Either the video has been removed or set to private access only.
        </div>
        <button
          className="button video-not-found-button"
          onClick={this.handleClick}
        >
          Browse Other videos
        </button>
      </div>
    );
  }
}

export default VideoNotFound;
