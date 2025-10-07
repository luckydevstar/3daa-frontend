import React from 'react';
import { Link } from 'react-router';

import common from 'app/common';

const { CloudinaryMedia, UILoading } = common.components;
const { createCloudinaryUrl } = common.util.helpers;

class DashboardRecommendedVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false
    };

    this.setVideoElement = this.setVideoElement.bind(this);
    this.handlePosterClick = this.handlePosterClick.bind(this);
  }

  setVideoElement(el) {
    this.video = el;
    if (el) {
      this.video.addEventListener('ended', () => {
        this.setState({
          playing: false
        });
      });
    }
  }

  handlePosterClick(e) {
    const { playing } = this.state;

    if (!playing) {
      this.video.play();
      this.setState({ playing: true });
    } else {
      this.video.pause();
      this.setState({ playing: false });
    }
  }

  render() {
    const { info } = this.props;
    const { playing } = this.state;

    const btnClass = playing ? 'fa-pause' : 'fa-play';

    return (
      <div className="recommended-video">
        {!info ? (
          // <UILoading alignMiddle />
          <div className="no-video">
            <p>There is no recommended video.</p>
          </div>
        ) : (
          <div className="columns">
            <div className="column is-9 video" onClick={this.handlePosterClick}>
              <CloudinaryMedia
                className="player video"
                fileId={info.cloudinary_file_id}
                mediaType="video"
                setVideoElement={this.setVideoElement}
              />
              <a className="play-arrow">
                <i className={`fa ${btnClass}`} />
              </a>
            </div>
            <div className="column is-3">
              <p className="title">{info.title}</p>
              <p className="desc">{info.description}</p>
              <div className="btns">
                <Link to={`/videos`} className="button is-primary">
                  View More
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default DashboardRecommendedVideo;
