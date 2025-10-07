import React, { Component } from 'react';
import PropTypes from 'prop-types';
import plyr from 'plyr';

import CloudinaryMedia from '../cloudinary-media';

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

class VideoPreview extends Component {
  componentDidMount() {
    this.player = plyr.setup('.player');
  }

  componentWillUnmount() {
    this.player[0].destroy();
  }

  render() {
    const { media } = this.props;
    const vType = media && media.type;
    const vid = media && media.cloudinary_file_id;
    return (
      <section className="video-player">
        <div className="container">
          {vid ? <RenderVideo {...{ vType, vid }} /> : null}
        </div>
      </section>
    );
  }
}

VideoPreview.propTypes = {
  media: PropTypes.object.isRequired
};

export default VideoPreview;
