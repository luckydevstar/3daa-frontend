import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as lodash from 'lodash';

import LicenseDetails from './license-details';
import common from 'app/common';

const { CloudinaryMedia } = common.components;

class StoreQualificationTopSection extends Component {
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
    const { qualification, count, addToCart } = this.props;
    const { playing } = this.state;

    const btnClass = playing ? 'fa-pause' : 'fa-play';

    return (
      <div className="columns view-course-header">
        <div className="column">
          <div className="video-block" onClick={this.handlePosterClick}>
            <CloudinaryMedia
              className="player video"
              fileId={lodash.get(qualification, 'introduction_video') || ''}
              mediaType="video"
              setVideoElement={this.setVideoElement}
            />
            <a className="play-arrow">
              <i className={`fa ${btnClass}`} />
            </a>
          </div>
        </div>
        <div className="column">
          <LicenseDetails
            {...{
              qualification,
              count,
              addToCart
            }}
            visibleVideo={false}
          />
        </div>
      </div>
    );
  }
}

StoreQualificationTopSection.propTypes = {
  qualification: PropTypes.any,
  count: PropTypes.number,
  addToCart: PropTypes.func
};

StoreQualificationTopSection.defaultProps = {
  qualification: {},
  count: 1,
  addToCart: () => {}
};

export default StoreQualificationTopSection;
