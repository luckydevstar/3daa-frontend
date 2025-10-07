import React from 'react';
import cx from 'classnames';

import { Text } from 'app/intl';

const VideoAddCard = ({ itemClass, toggleAddVideo }) =>
  <li className={cx(itemClass, 'videos-tab__add-media column')}>
    <button
      className="videos-tab__add-media-btn button hoverable image"
      onClick={toggleAddVideo}
    >
      <div className="videos-tab__add-media-label">
        <Text iKey="add_video" />{' '}
        <i
          className="videos-tab__add-media-icon fa fa-plus-circle"
          aria-hidden="true"
        />
      </div>
    </button>
  </li>;

export default VideoAddCard;
