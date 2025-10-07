import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { firstLetterCaps } from '../../../common/util/helpers';

class VideoTagsItem extends Component {
  getClasses() {
    const { tag, selectedTags } = this.props;
    if (selectedTags && selectedTags.indexOf(tag) !== -1) {
      return 'tags-content tags-selected';
    }
    return 'tags-content';
  }

  render() {
    const { tag, onTagsClick } = this.props;

    return (
      <p
        className={this.getClasses()}
        onClick={() => {
          onTagsClick(tag);
        }}
      >
        {firstLetterCaps(tag)}
      </p>
    );
  }
}

VideoTagsItem.propTypes = {
  onTagsClick: PropTypes.func.isRequired,
  selectedTags: PropTypes.array.isRequired,
  tag: PropTypes.string.isRequired
};

export default VideoTagsItem;
