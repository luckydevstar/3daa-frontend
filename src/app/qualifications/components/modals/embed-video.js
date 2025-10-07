import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EmbedVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null
    };
  }

  componentDidMount() {
    const { currentVideo } = this.props;
    if (currentVideo && currentVideo.indexOf('http') > -1) {
      this.setState({ url: currentVideo });
    }
  }

  youtubeIdParser(url) {
    if (!url) return false;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }

  vimeoIdParser(url) {
    if (!url) return false;
    const regExp = /(videos|video|channels|\.com)\/([\d]+)/;
    const match = url.match(regExp);
    return match && match[2] ? match[2] : false;
  }

  createVideoUrl(url) {
    let videoId;
    let result = false;

    if (url && url.indexOf('youtu') > -1) {
      videoId = this.youtubeIdParser(url);
      result = `https://www.youtube.com/embed/${videoId}`;
    }

    if (url && url.indexOf('vimeo') > -1) {
      videoId = this.vimeoIdParser(url);
      result = `https://player.vimeo.com/video/${videoId}?color=caad62&title=0&byline=0&portrait=0`;
    }

    return result;
  }
  handleChange(e) {
    const { value } = e.target;

    this.setState({ url: value });
  }
  render() {
    const { setCurrentMedia, close } = this.props;
    const { url } = this.state;
    const videoUrl = this.createVideoUrl(url);
    return (
      <div>
        <div className="workbooks-media-insertion-modal-body embed">
          {url && videoUrl ? (
            <iframe
              src={videoUrl}
              width="640"
              height="360"
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <div className="embed-message">Please select valid video.</div>
          )}

          <label>Link for Vimeo or YouTube Video</label>
          <input
            className="input"
            name="link"
            type="text"
            placeholder="Paste link here"
            onChange={e => this.handleChange(e)}
          />
        </div>
        <div className="workbooks-media-insertion-modal-footer">
          <div className="button is-primary is-outlined" onClick={close}>
            Cancel
          </div>
          <div
            className="button is-success"
            disabled={!videoUrl}
            onClick={() => setCurrentMedia(videoUrl)}
          >
            Choose Selected
          </div>
        </div>
      </div>
    );
  }
}

EmbedVideo.propTypes = {
  close: PropTypes.func.isRequired,
  setCurrentMedia: PropTypes.func.isRequired
};

export default EmbedVideo;
