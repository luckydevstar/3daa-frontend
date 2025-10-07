import React, { Component } from 'react';
import PropTypes from 'prop-types';
import plyr from 'plyr';
import common from 'app/common';
import { equals } from 'ramda';

const { CloudinaryMedia } = common.components;

const RenderVideo = ({ vType, vid }) => {
  if (vType === 'vimeo') {
    return <div data-type={vType} data-video-id={vid} />;
  }
  return (
    <CloudinaryMedia
      className="player"
      fileId={vid}
      mediaType="video"
      attributes={{ controls: true }}
    />
  );
};

class VideoPlayerMain extends Component {
  componentDidMount() {
    this.player = plyr.setup('.player');
  }

  componentDidUpdate(nextProps) {
    const { cloudinary_file_id: thisId } = this.props.video;
    const { cloudinary_file_id: nextId } = nextProps.video;
    if (!equals(thisId, nextId)) {
      const video = document.querySelectorAll('.player')[0];
      video.pause();
      video.currentTime = 0;
      video.load();
      // For some reason this doesn't work
      // this.player[0].stop();
      // This is the hack to fix it:
      const instance = document.querySelector('.plyr');
      instance.classList.remove('plyr--playing');
      instance.classList.add('plyr--stopped');
    }
  }

  componentWillUnmount() {
    this.player[0].destroy();
  }

  render() {
    const { video, setViewVideo } = this.props;
    const vType = video && video.type;
    const vid = video && video.cloudinary_file_id;
    return (
      <section
        className="video-player"
        onClick={e => {
          e.stopPropagation();
          setViewVideo();
        }}
      >
        <div className="container">
          {vid ? <RenderVideo {...{ vType, vid }} /> : null}
        </div>
      </section>
    );
  }
}

VideoPlayerMain.propTypes = {
  video: PropTypes.object.isRequired
};

export default VideoPlayerMain;
