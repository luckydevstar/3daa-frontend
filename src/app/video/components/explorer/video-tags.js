import React, { Component } from 'react';
import PropTypes from 'prop-types';

import VideoTagsItem from './video-tags-item';

class VideoTags extends Component {
  constructor() {
    super();

    this.tags = [];
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.tags.length) {
      this.tags = this.getTags(nextProps.videos);
    }
  }

  getTags(videos) {
    const tags = [];

    if (videos.length) {
      videos.forEach(video => {
        if (video.tags && video.tags.length) {
          video.tags.forEach(tag => {
            if (tags.indexOf(tag) === -1) {
              tags.push(tag);
            }
          });
        }
      });
    }
    return tags;
  }

  tagItems() {
    const { tags } = this;
    const { selectedTags, onTagsClick } = this.props;
    let tagItems = [];

    if (tags.length) {
      tagItems = tags.map((tag, index) => (
        <VideoTagsItem
          key={index + 1}
          tag={tag}
          selectedTags={selectedTags}
          onTagsClick={onTagsClick}
        />
      ));
      tagItems.unshift(
        <p key={0} className="tags-title">
          Tags
        </p>
      );
    }
    return tagItems;
  }

  render() {
    return <div className="video-tags">{this.tagItems()}</div>;
  }
}

VideoTags.propTypes = {
  videos: PropTypes.array.isRequired,
  selectedTags: PropTypes.array.isRequired,
  onTagsClick: PropTypes.func.isRequired
};

export default VideoTags;
