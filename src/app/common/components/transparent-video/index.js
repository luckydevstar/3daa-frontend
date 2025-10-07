import React, { Component } from 'react';
import PropTypes from 'prop-types';
import defaultVideo from 'videos/activity_default_video_transparent.mp4';

class TransparentVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoHeight: 0,
      videoWidth: 0
    };
    this.videoNode = null;
    this.bufferNode = null;
    this.outputNode = null;
    this.animationId = null;
  }

  componentDidMount() {
    this.startAnimation();
  }

  componentWillUnmount() {
    this.stopAnimation();
    window.cancelAnimationFrame(this.animationId);
  }

  stopAnimation() {
    this.videoNode.removeEventListener('play', () => null);
    this.videoNode.removeEventListener('loadeddata', () => null);
    this.stopVideo();
  }

  stopVideo() {
    this.videoNode.pause();
  }

  startAnimation() {
    const video = this.videoNode;
    video.addEventListener(
      'loadeddata',
      e => this.updateVideoDimensions(e),
      false
    );

    video.addEventListener(
      'play',
      () => {
        if (
          this.state.videoHeight !== 0 &&
          this.state.videoWidth !== 0 &&
          this.outputNode
        ) {
          this.animationId = window.requestAnimationFrame(() =>
            this.processFrame()
          );
        }
      },
      false
    );

    video.addEventListener(
      'pause',
      () => {
        if (
          this.state.videoHeight !== 0 &&
          this.state.videoWidth !== 0 &&
          this.outputNode
        ) {
          window.cancelAnimationFrame(this.animationId);
        }
      },
      false
    );
  }

  updateVideoDimensions(event) {
    const { videoHeight, videoWidth } = event.target;
    const video = this.videoNode;
    if (
      this.state.videoHeight !== videoHeight ||
      this.state.videoWidth !== videoWidth
    ) {
      if (video) {
        this.setState({ videoHeight, videoWidth });
        video.removeEventListener('loadeddata', () => null);
        // NOTE: \/ This is temporary, please remove it from here ASAP. (Play video only when it's inside viewport(Performance issue)); (31/05/17 ~ Pawel)
        video.play();
      }
    }
  }

  processFrame() {
    const outputCanvas = this.outputNode;
    const bufferCanvas = this.bufferNode;
    const output = outputCanvas.getContext('2d');
    const buffer = bufferCanvas.getContext('2d');
    const width = outputCanvas.width;
    const height = outputCanvas.height;
    buffer.drawImage(this.videoNode, 0, 0);
    const image = buffer.getImageData(0, 0, width, height);
    const imageData = image.data;
    const alphaData = buffer.getImageData(0, height, width, height).data;

    for (let i = 3, len = imageData.length; i < len; i += 4) {
      imageData[i] = alphaData[i - 1];
    }

    output.putImageData(image, 0, 0, 0, 0, width, height);
    this.animationId = window.requestAnimationFrame(() => this.processFrame());
  }

  render() {
    const { videoWidth, videoHeight } = this.state;
    return (
      <div>
        <video
          ref={n => {
            this.videoNode = n;
          }}
          crossOrigin="anonymous"
          className="transparent-video"
          style={{ display: 'none' }}
          loop
        >
          <source
            src={`${this.props.url ? this.props.url : defaultVideo}`}
            type="video/mp4"
          />
        </video>
        <canvas
          ref={n => {
            this.bufferNode = n;
          }}
          style={{ display: 'none' }}
          width={videoWidth}
          height={videoHeight}
        />
        <canvas
          ref={n => {
            this.outputNode = n;
          }}
          width={videoWidth}
          height={parseInt(videoHeight) / 2}
        />
      </div>
    );
  }
}

TransparentVideo.defaultProps = {
  url: null
};

TransparentVideo.propTypes = {
  url: PropTypes.string
};

export default TransparentVideo;
